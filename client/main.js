if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, scene, renderer;
var material, dae, skin;

var currentModel;

var mouse2D, mouse3D, raycaster, rollOveredFace;
var rollOverMesh;
var voxelPosition = new THREE.Vector3(), tmpVec = new THREE.Vector3(), normalMatrix = new THREE.Matrix3();
var i, intersector;
var intersectorHeightOffset;

var buildings = new Array();
//bolean
var allowBuildingPlacement; 		

var floor;					//needed to restrict mouse projection to floor only
var collidableMeshList = [];	//collidable list
var collidableBoundingBoxes = [];	//avoid creating a new bounding box every time we check for collision
var ghostHeight;
var colliderBox;

var t = 0;
var clock = new THREE.Clock();

init();
animate();

function initFloor() {
	// FLOOR
    var floorTexture = new THREE.ImageUtils.loadTexture( './art/textures/terrain/types/desert_lakebed_dry_b.png' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
    floorTexture.repeat.set( 10, 10 );
    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(40, 40, 10, 10);
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = 0;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);
}

function buildBoundingMeshFromBox (boundingBox, widthSegments, heightSegments, depthSegments) {
	var width = boundingBox.max.x - boundingBox.min.x;
	var height = boundingBox.max.y - boundingBox.min.y;
	var depth = boundingBox.max.z - boundingBox.min.z;
	var bbGeometry = new THREE.CubeGeometry( width, height, depth, widthSegments, heightSegments, depthSegments );
	var bbMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true} );
	var bbMesh = new THREE.Mesh( bbGeometry, bbMaterial );
	bbMesh.visible = false;
	return bbMesh;
}

function buildBoundingMeshFromObject (object, widthSegments, heightSegments, depthSegments) {
	var boundingBox = new THREE.Box3();	
	boundingBox.setFromObject(object);
	
	return buildBoundingMeshFromBox(boundingBox, widthSegments, heightSegments, depthSegments);
}

function initRollOver(position) {
	rollOverMesh = buildBoundingMeshFromObject(currentModel, 1, 1, 1);			// use values higher than 1 for increased collision precision
	ghostHeight = rollOverMesh.geometry.height;	
	var ghostModel = currentModel.clone();
	setMaterial(ghostModel, material.clone());
	setTransparent(ghostModel);		
	ghostModel.position.set(0, -ghostHeight/2, 0 );			//compensate for the difference in coordinates between the model center and the bounding volume center;	
	rollOverMesh.add(ghostModel);
    rollOverMesh.position.x = 0;
    //rollOverMesh.position.z = position.z;	
	rollOverMesh.position.y = floor.position.y + ghostHeight/2;			//avoid clipping thorugh terrain at the start	
	scene.add( rollOverMesh );
}

function registerCollidableBoundingMesh(model) {			//using this method might cause trouble if we decide to allow players to move buildings instead of destroying and building new ones
	var modelBoundingBox = new THREE.Box3();	
	modelBoundingBox.setFromObject(model);	
	var modelBoundingMesh = buildBoundingMeshFromBox(modelBoundingBox, 1, 1, 1);
	modelBoundingMesh.position.set(model.position.x, model.position.y + modelBoundingMesh.geometry.height/2, model.position.z);			//compensate for difference in reference points	
	scene.add(modelBoundingMesh);								//need to add on the scene otherwise raytracing won't work
	collidableMeshList.push(modelBoundingMesh);
	collidableBoundingBoxes.push(modelBoundingBox);
}

function getModelWithBoundingMesh(model) {						//testing currently - might be needed in the future if we decide not to go with the registerCollidableBoundingMesh method
	var daeBB = buildBoundingMeshFromObject(model, 1, 1, 1);
	daeBB.position.set(0, daeBB.geometry.height/2, 0);			//compensate for difference in reference points*
	dae.position.set(0, -daeBB.geometry.height/2, 0);				//compensate for difference in reference points*     -   * = not needed when we don't display the bounding boxes
//	collidableMeshList.push(daeBB);								
	daeBB.add(model);
	return daeBB
}

function init() {
	//CONTAINER    
	container = document.createElement( 'div' );
    document.body.appendChild( container );	

	//SCENE
    scene = new THREE.Scene();
	
	//CAMERA
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 2, 2, 3 );

	//FLOOR
	initFloor();				

    // LIGHTS
    scene.add( new THREE.AmbientLight( 0xcccccc ) );
    var directionalLight = new THREE.DirectionalLight(/*Math.random() * 0xffffff*/0xeeeeee );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add( directionalLight );
	
    // picking
    projector = new THREE.Projector();
    mouse2D = new THREE.Vector3( 0, 10000, 0.5 );
	
	//RENDERER
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
	
	//STATS
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );
	
	//LOADER
	var loader = new IberModelLoader();	
	loader.loadModels();

    // register event handlers
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );   
    document.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'resize', onWindowResize, false );

}

function collidablesContainEmitter(colliderOrigin) {
	for(index = 0; index < collidableBoundingBoxes.length; index ++) {
		if(collidableBoundingBoxes[index].containsPoint(colliderOrigin)){				
			return true;
		}
	}
	return false;
}

function changeColliderColor(collider, r, g, b) {
	collider.children[0].material.ambient.r = r;
	collider.children[0].material.ambient.g = g;
	collider.children[0].material.ambient.b = b;
}

function detectCollision (collider) {			//collider = oject that detects collision (casts rays)
	
	if(collider)
    {
        var collisionFlag = false;
        var originPoint = collider.position.clone();
    	
       	for (var vertexIndex = 0; vertexIndex < collider.geometry.vertices.length; vertexIndex++)
        {                
        	var localVertex = collider.geometry.vertices[vertexIndex].clone();
        	var globalVertex = localVertex.applyMatrix4( collider.matrix );
            var directionVector = globalVertex.sub( collider.position );
                    
            var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
            var collisionResults = ray.intersectObjects( collidableMeshList );
            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
    			collisionFlag = true; 
    			break;		
    		}
    	}	
        if(collisionFlag == true) {
    		changeColliderColor(collider, 255, 0, 0);
        }
        else {
    		if(collidablesContainEmitter(originPoint) == true) {
    			collisionFlag = true;			
    			changeColliderColor(collider, 255, 0, 0);
    		}
    		else 
    			changeColliderColor(collider, 0, 255, 0);
        }
    	allowBuildingPlacement = !collisionFlag;
    }
}

function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onDocumentMouseDown( event ) {
    event.preventDefault();
	if(allowBuildingPlacement && rollOverMesh) {                               //only place if there is no collision and if the ghost model is visible     
		var intersects = raycaster.intersectObject( floor );
    	intersector = getRealIntersector( intersects );

	    var i = buildings.length - 1;
   		buildings[i] = currentModel.clone();
    	buildings[i].position = intersector.point;
		scene.add(buildings[i]);
		registerCollidableBoundingMesh(buildings[i]);
	}
}

var angle = 0.0;

function onKeyDown ( event ) {
    switch( event.keyCode ) {
        case 87: // w  
            camera.position.z--; 
            break;
        case 83: // s
            camera.position.z++; 
            break;
        case 65: // a  
            camera.position.x--; 
            break;
        case 68: // d
            camera.position.x++; 
            break;
        case 69: // e  
            angle -= 0.05;
            camera.position.x = Math.cos( angle ) * 10;
            camera.position.z = Math.sin( angle ) * 10;
            break;
        case 81: // q  
            angle += 0.05;
            camera.position.x = Math.cos( angle ) * 10;
            camera.position.z = Math.sin( angle ) * 10;
            break;
        case 82: // r
            camera.position.y++; 
            break;
        case 70: // f  
            camera.position.y--; 
            break;
        case 80: // p  
            togglePlacementMode();
            break;
        case 219: // [, {
            previousBuilding();
            break;
        case 221: // ], }
            nextBuilding();           
            break;
    }
};

function nextBuilding() {
    var index = loadedModels.indexOf(currentModel);
    if(index != loadedModels.length-1) {
        index++;
        currentModel = loadedModels[index];
        refreshRollover();
        console.log(index);
    }
}

function previousBuilding() {
    var index = loadedModels.indexOf(currentModel);
    if(index != 0) {
        index--;
        currentModel = loadedModels[index];
        refreshRollover();
        console.log(index);
    }
}

function refreshRollover() {
    if(rollOverMesh) {                                //check if it is set
        togglePlacementMode();
        togglePlacementMode();
    }
}

function togglePlacementMode () {
    if(rollOverMesh) {
        scene.remove(rollOverMesh);
        rollOverMesh = null;
    }
    else {
        var intersector = getMouseProjectionOnFloor();
        initRollOver(intersector); 
    }
}                         

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
	update();
    render();
}

function update() {
	var delta = clock.getDelta();
	if ( t > 1 ) t = 0;
	stats.update();
}

function getMouseProjectionOnFloor() {
    raycaster = projector.pickingRay( mouse2D.clone(), camera );
    var intersects = raycaster.intersectObject( floor );
    if ( intersects.length > 0 ) {
        intersector = getRealIntersector( intersects );
        return intersector;
    }
    return null;
}

function render() {
    var timer = Date.now() * 0.0005;
    camera.lookAt( scene.position );

    intersector = getMouseProjectionOnFloor();
    if ( intersector && rollOverMesh) {
		intersector.point.y += ghostHeight/2;			//height correction - needed because the bounding volume has the center of mass as a reference point and thus half of it clips through the floor;            
		setVoxelPosition( intersector );
        rollOverMesh.position = voxelPosition;
    }

	detectCollision(rollOverMesh);	
	
    renderer.render( scene, camera );
}

function getRealIntersector( intersects ) {
    for( i = 0; i < intersects.length; i++ ) {
        intersector = intersects[ i ];
        if ( intersector.object == floor ) {		//otherwise we can build buildings on top of each other when viewing at the right angle
            return intersector;
        }
    }
    return null;
}

function setVoxelPosition( intersector ) {
    normalMatrix.getNormalMatrix( intersector.object.matrixWorld );
    //tmpVec.copy( intersector.face.normal );
    tmpVec.applyMatrix3( normalMatrix ).normalize();
    voxelPosition.addVectors( intersector.point, tmpVec );
}

function setTransparent(node) {
	node.material.opacity = 0.5;
	node.material.transparent = true;
	if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            setTransparent(node.children[i]);
        }
    }
}

function setMaterial(node, material) {
    node.material = material;
    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            setMaterial(node.children[i], material);
        }
    }
}

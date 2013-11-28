if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, scene, renderer;
var material, dae, skin;

var currentModel;
var selectedModel;

var mouse2D, mouse3D, raycaster, rollOveredFace;
var rollOverMesh;
var voxelPosition = new THREE.Vector3(), tmpVec = new THREE.Vector3(), normalMatrix = new THREE.Matrix3();
var i, intersector;
var intersectorHeightOffset;

var buildings = new Array();
//bolean
var allowBuildingPlacement;         

var floor;                  //needed to restrict mouse projection to floor only
var collidableMeshList = [];    //collidable list
var collidableBoundingBoxes = [];   //avoid creating a new bounding box every time we check for collision
var selectableMeshes = [];          //merge this with collidableMeshList?       //might slow down collision detection, but we don't keep that many arrays;
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
    console.log(width + " - " + height + " - " + depth);
    var bbGeometry = new THREE.CubeGeometry( width, height, depth, widthSegments, heightSegments, depthSegments );
    var bbMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true} );
    var bbMesh = new THREE.Mesh( bbGeometry, bbMaterial );
    
    bbMesh.visible = true;
    return bbMesh;
}

function buildBoundingMeshFromObject (object, widthSegments, heightSegments, depthSegments) {
    var boundingBox = new THREE.Box3(); 
    boundingBox.setFromObject(object);
    console.log(boundingBox);
    var mesh = buildBoundingMeshFromBox(boundingBox, widthSegments, heightSegments, depthSegments);
    mesh.boundingBox = boundingBox;
    return mesh;
}

function initRollOver(position) {
    rollOverMesh = buildBoundingMeshFromObject(currentModel, 3, 3, 3);            // use values higher than 1 for increased collision precision
    var ghostModel = cloneModel(currentModel);
    var ghostMaterial = ghostModel.material;
    
    setMaterial(ghostModel, ghostMaterial.clone());
    setTransparent(ghostModel);     

    ghostModel.position.set(-rollOverMesh.boundingBox.center().x, -rollOverMesh.boundingBox.center().y, -rollOverMesh.boundingBox.center().z);
    rollOverMesh.add(ghostModel);
      
    scene.add( rollOverMesh );
}

function setRollOverPosition (intersector) {
    setVoxelPosition( intersector );
    rollOverMesh.position.x = voxelPosition.x + rollOverMesh.boundingBox.center().x;
    rollOverMesh.position.y = voxelPosition.y + rollOverMesh.boundingBox.center().y;
    rollOverMesh.position.z = voxelPosition.z + rollOverMesh.boundingBox.center().z;
}

function registerCollidableBoundingMesh(model) {            //using this method might cause trouble if we decide to allow players to move buildings instead of destroying and building new ones
    var modelBoundingBox = new THREE.Box3(); 
    modelBoundingBox.setFromObject(model);
    
    console.log(modelBoundingBox);
    collidableBoundingBoxes.push(modelBoundingBox);

    //showBoundingBox(modelBoundingBox);                //collision debugging

    var modelBoundingMesh = buildBoundingMeshFromBox(modelBoundingBox, 1, 1, 1);
    console.log(modelBoundingMesh.offsetVector);
    modelBoundingMesh.position.set(modelBoundingBox.center().x, modelBoundingBox.center().y, modelBoundingBox.center().z);
    scene.add(modelBoundingMesh);                               //need to add on the scene otherwise raytracing won't work
    collidableMeshList.push(modelBoundingMesh);

    model.modelBoundingBox = modelBoundingBox;                               //add bounding box to the model (use for deletion)
    model.modelBoundingMesh = modelBoundingMesh;                   //add bounding mesh to the model (use for deletion)

    //console.log(collidableMeshList);
    selectableMeshes.push( getMeshFromModel(model) );                   //TODO fix this!
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

var pointMesh = null;

function detectCollision (collider) {           //collider = oject that detects collision (casts rays)
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
    if(rollOverMesh) {                                             //if the ghost model is visible     
        if(allowBuildingPlacement) {                               //and there there is no collision 
            intersector = getMouseProjectionOnFloor();
            if(intersector) {                                                        //avoid errors when trying to place buildings and the mouse hovers outside the floor area
                var i = buildings.length - 1;
                buildings[i] = cloneModel(currentModel);
                buildings[i].position = intersector.point;
                scene.add(buildings[i]);
                registerCollidableBoundingMesh(buildings[i]);
                
            }   
        }
    }
    else {                                                          //if the model is not visible, then we are in select building mode
        var intersects = getMouseProjectionOnObjects( selectableMeshes );
        if(intersects.length > 0) {
            if (selectedModel != intersects[0].object) {                    //we have a new selection
                clearSelectedModel();
                highlightSelectedModel (intersects[0].object);
            }
        }   
        else {                                                                      //not selected anything 
            clearSelectedModel();
        }            
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
        case 75: // k
            printEmitterOfModel(rollOverMesh);                  //collision debugging
            showEmitterOfModel(rollOverMesh);
            break;
    }
};

function cloneModel(model) {                                    
    var clone = model.clone();
    
    clone.material = model.material;
    clone.modelBoundingBox = model.modelBoundingBox;
    clone.modelBoundingMesh = model.modelBoundingMesh;

    return clone;
}

function showBoundingBox(modelBoundingBox) {
    var pointGeometry = new THREE.CubeGeometry( 0.3, 0.3, 0.3);
    var pointMinMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000} );
    var pointMinMesh = new THREE.Mesh( pointGeometry, pointMinMaterial );
    pointMinMesh.position.x = modelBoundingBox.min.x;
    pointMinMesh.position.y = modelBoundingBox.min.y;
    pointMinMesh.position.z = modelBoundingBox.min.z;
    //console.log(pointMinMesh.position);
    scene.add(pointMinMesh);
    //console.log(pointMinMesh.position);

    var pointMaxMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00} );
    var pointMaxMesh = new THREE.Mesh( pointGeometry, pointMaxMaterial );
    pointMaxMesh.position.x = modelBoundingBox.max.x;
    pointMaxMesh.position.y = modelBoundingBox.max.y;
    pointMaxMesh.position.z = modelBoundingBox.max.z;
    scene.add(pointMaxMesh);
}

function showEmitterOfModel (collider) {                            //collision debugging
    if (collider) {
        var originPoint = collider.position.clone();
        if(pointMesh == null){   
            //console.log("point");
            var pointGeometry = new THREE.CubeGeometry( 0.3, 0.3, 0.3);
            var pointMaterial = new THREE.MeshBasicMaterial( { color: 0x000000} );
            pointMesh = new THREE.Mesh( pointGeometry, pointMaterial );
            scene.add(pointMesh);
        }
        if(pointMesh)
        {
            pointMesh.position.x = originPoint.x;
            pointMesh.position.y = originPoint.y;
            pointMesh.position.z = originPoint.z;
        }
    }
    else {
        scene.remove(pointMesh);
        pointMesh = null;
    }
}

function printEmitterOfModel (collider) {                       //keep for collision debugging
    if(collider) { 
        var originPoint = collider.position.clone();
        console.log(originPoint)
    }
}

function nextBuilding() {
    var index = loadedModels.indexOf(currentModel);
    if(index != loadedModels.length-1) {
        index++;
        currentModel = loadedModels[index];
        refreshRollover();
        //console.log(index);
    }
}

function previousBuilding() {
    var index = loadedModels.indexOf(currentModel);
    if(index != 0) {
        index--;
        currentModel = loadedModels[index];
        refreshRollover();
        //console.log(index);
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
        clearSelectedModel();                 //clear selected model
        var intersector = getMouseProjectionOnFloor();
        if(intersector)                                     //avoid errors when mouse is outside the floor area
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

function highlightSelectedModel (model) {
    selectedModel = model;                            //get the first object intersected;
    selectedModel.oldMaterial = selectedModel.material;
    var highlightMaterial = selectedModel.material.clone();             //needed, otherwise all models of the same type will get highlighted
    highlightMaterial.emissive.setHex(0x888888);
    selectedModel.material = highlightMaterial;
}

function clearSelectedModel () {
    if(selectedModel) {                                         //if we already have a model selected
        selectedModel.material = selectedModel.oldMaterial;             //reset material to old one
    }
    selectedModel = null;
}

function getMeshFromModel (model) {
    if(model.children) {
        for(var i = 0; i < model.children.length; i++) {
            var child = model.children[i];
            if(child instanceof THREE.Mesh) {
                return child;
            }
        }
        return null;
    }
    return null;
}

function getMouseProjectionOnObjects(objectArray) {
    raycaster = projector.pickingRay( mouse2D.clone(), camera );
    var intersects = raycaster.intersectObjects( objectArray );
    return intersects;
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

    
    if (rollOverMesh) {                                     //project rays only if the rollOverMesh is set 
        intersector = getMouseProjectionOnFloor();
        if ( intersector ) {
            setRollOverPosition(intersector);
        }
    }

    detectCollision(rollOverMesh);  
    
    renderer.render( scene, camera );
}

function getRealIntersector( intersects ) {
    for( i = 0; i < intersects.length; i++ ) {
        intersector = intersects[ i ];
        if ( intersector.object == floor ) {        //otherwise we can build buildings on top of each other when viewing at the right angle
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

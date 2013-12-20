if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var container, stats;

var camera, scene, renderer;
var material, dae, skin;

var currentModel;
var selectedModel;

var mouse2D, raycaster;
var mouseOffsetX, mouseOffsetY;
var rollOverMesh;
var voxelPosition = new THREE.Vector3(), tmpVec = new THREE.Vector3(), normalMatrix = new THREE.Matrix3();
var i, intersector;

var noCollision;

var floor;                  //needed to restrict mouse projection to floor only
var collidableMeshList = [];    //collidable list
var collidableBoundingBoxes = [];   //avoid creating a new bounding box every time we check for collision
var selectableMeshes = [];          //merge this with collidableMeshList?       //might slow down collision detection, but we don't keep that many arrays;

var flag_placed = false;
var handling_flag = false;

var t = 0;
var clock = new THREE.Clock();

var cameraLookAt, cameraLookAngle, cameraElevationAngle;
var structureCollection;
var sounds = {};

var city;

init();
animate();

/*function initFloor() {
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
}*/

function initFloor() {
    var loader = new TerrainLoader();
    loader.load();
}

function initRollOver(position) {
    if(currentModel){
        if(currentModel.material == null && getFlag() == null){
            rollOverMesh = currentModel.getBoundingMesh(3, 3, 3);            // use values higher than 1 for increased collision precision
            var ghostModel = currentModel.getClone();
            ghostModel.position.set(-rollOverMesh.boundingBox.center().x, -rollOverMesh.boundingBox.center().y, -rollOverMesh.boundingBox.center().z);
            rollOverMesh.add(ghostModel);
            rollOverMesh.position.set(position.x, position.y, position.z);              //set initial position
            scene.add( rollOverMesh );
            
        }
        else if(currentModel.material != null){
            rollOverMesh = currentModel.getBoundingMesh(3, 3, 3);            // use values higher than 1 for increased collision precision
            var ghostModel = currentModel.getClone();
            var ghostMaterial = ghostModel.material.clone();

            setMaterial(ghostModel, ghostMaterial);
            setTransparent(ghostModel);     

            ghostModel.position.set(-rollOverMesh.boundingBox.center().x, -rollOverMesh.boundingBox.center().y, -rollOverMesh.boundingBox.center().z);
            rollOverMesh.add(ghostModel);

            rollOverMesh.position.set(position.x, position.y, position.z);              //set initial position

            scene.add( rollOverMesh );
        }
    }
}

function setRollOverPosition (intersector) {
    setVoxelPosition( intersector );
    rollOverMesh.position.x = voxelPosition.x + rollOverMesh.boundingBox.center().x;
    rollOverMesh.position.y = voxelPosition.y + rollOverMesh.boundingBox.center().y;
    rollOverMesh.position.z = voxelPosition.z + rollOverMesh.boundingBox.center().z;
}

function registerCollidableBoundingMesh(model) {            //using this method might cause trouble if we decide to allow players to move buildings instead of destroying and building new ones
    modelBoundingBox = model.getBoundingBox();    
    collidableBoundingBoxes.push(modelBoundingBox);
    //showBoundingBox(modelBoundingBox);                //collision debugging
    
    var modelBoundingMesh = model.getBoundingMesh(1, 1, 1);
    modelBoundingMesh.position.set(modelBoundingBox.center().x, modelBoundingBox.center().y, modelBoundingBox.center().z);
    scene.add(modelBoundingMesh);                               //need to add on the scene otherwise raytracing won't work
    collidableMeshList.push(modelBoundingMesh);

    //model.modelBoundingBox = modelBoundingBox;                               //add bounding box to the model (use for deletion)
    //model.modelBoundingMesh = modelBoundingMesh;                   //add bounding mesh to the model (use for deletion)

    selectableMeshes.push( model.getMesh() );                   //TODO fix this!
}

function onTerrainLoad() {
    scene.add(floor);

    //BIRD
    initBirds(scene);  
}

function initCamera() {
    camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 2000 );
    camera.position.set(0, 25, 50 );
    cameraLookAt = scene.position;

    setCameraLookAngle();
    setCameraElevationAngle()
}

function initSound(){
	sounds.error = new Sound(['audio/game/error.mp3'], { loop: false});
	sounds.selected = {
		barracks: new Sound(['audio/selected/sel_barracks.ogg']),
		blacksmith: new Sound(['audio/selected/sel_blacksmith.ogg']),
		civic: new Sound(['audio/selected/sel_civ_center.ogg']),
		corral: new Sound(['audio/selected/sel_corral.ogg']),
		farm: new Sound(['audio/selected/sel_farmstead.ogg']),
		fortress: new Sound(['audio/selected/sel_fortress.ogg']),
		house: new Sound(['audio/selected/sel_house.ogg']),
		storehouse: new Sound(['audio/selected/sel_storehouse.ogg']),
		temple: new Sound(['audio/selected/sel_temple.ogg']),
		tower: new Sound(['audio/selected/sel_tower.ogg'])
	}
}

function init() {
    //CONTAINER    
    container = document.getElementById( 'main' );
    setMouseOffset();

    //GUI
    initGui();

	//MUSIC
	Music.initMusic();

	//SOUND
	initSound();

    //SCENE
    scene = new THREE.Scene();

    //CAMERA
    initCamera();

    //FLOOR
    initFloor();
    
    // LIGHTS
    scene.add( new THREE.AmbientLight( 0xcccccc ) );
    var directionalLight = new THREE.DirectionalLight(/*Math.random() * 0xffffff*/0xeeeeee );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() + 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add( directionalLight );

	var skybox = Skybox.get([
		/*'art/skybox/cloudy_0/yellowcloud_ft.jpg',
		'art/skybox/cloudy_0/yellowcloud_bk.jpg',
		'art/skybox/cloudy_0/yellowcloud_up.jpg',
		'art/skybox/cloudy_0/yellowcloud_dn.jpg',
		'art/skybox/cloudy_0/yellowcloud_rt.jpg',
		'art/skybox/cloudy_0/yellowcloud_lf.jpg'
		'art/skybox/cloudy_0/bluecloud_ft.jpg',
		'art/skybox/cloudy_0/bluecloud_bk.jpg',
		'art/skybox/cloudy_0/bluecloud_up.jpg',
		'art/skybox/cloudy_0/bluecloud_dn.jpg',
		'art/skybox/cloudy_0/bluecloud_rt.jpg',
		'art/skybox/cloudy_0/bluecloud_lf.jpg'*/
		'art/skybox/cloudy_0/graycloud_ft.jpg',
		'art/skybox/cloudy_0/graycloud_bk.jpg',
		'art/skybox/cloudy_0/graycloud_up.jpg',
		'art/skybox/cloudy_0/graycloud_dn.jpg',
		'art/skybox/cloudy_0/graycloud_rt.jpg',
		'art/skybox/cloudy_0/graycloud_lf.jpg'
	]);
	scene.add(skybox);

    // picking
    projector = new THREE.Projector();
    mouse2D = new THREE.Vector3( 0, 10000, 0.5 );
    
    //RENDERER
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( container.offsetWidth, container.offsetHeight );
    container.appendChild( renderer.domElement );
    
    //STATS
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '60px';
    stats.domElement.style.right = '10px';
    container.appendChild( stats.domElement );

    //MODEL LOADERS
	var iberLoader = new IberModelLoader();
	iberLoader.addEventListener(ModelLoader.doneLoading, function () {
		console.log("Done loading Iberians");
	});
	iberLoader.loadModels();

	var romeLoader = new RomeModelLoader();
	romeLoader.addEventListener(ModelLoader.doneLoading, function(){
		console.log("Done loading Romans");
	});
	romeLoader.loadModels();

	var heleLoader = new HeleModelLoader();
	heleLoader.addEventListener(ModelLoader.doneLoading, function(){
		console.log("Done loading Hellenes");
	});
	heleLoader.loadModels();

	var kartLoader = new KartModelLoader();
	kartLoader.addEventListener(ModelLoader.doneLoading, function(){
		console.log("Done loading Carthaginians");
	});
	kartLoader.loadModels();

	var persLoader = new PersModelLoader();
	persLoader.addEventListener(ModelLoader.doneLoading, function(){
		console.log("Done loading Persians");
	});
	persLoader.loadModels();

	var gaiaLoader = new GaiaModelLoader();
	gaiaLoader.addEventListener(ModelLoader.doneLoading, function(){
		console.log("Done loading Gaia");
	});
	gaiaLoader.loadModels();

	// COLLECTION OF STRUCTURES
	structureCollection = new ModelArray();

    // load city from server
    requestCity();

    // register event handlers
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );   
    document.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'resize', onWindowResize, false );

	$( document ).ready(function() {
		Gui.console.printText("Welcome to Utopolis [Beta]", 120000);
	});
}

function requestCity() {
    request = $.ajax({
        url: 'http://localhost:8080/api/city/1',
        type: 'GET'
    });

    request.done(function (response, textStatus, jqXHR){
        console.log("SERVER RESPONSE: Hooray, it worked!");
        city = response;
        console.log(city);
        placeCity();
    });

    request.fail(function (jqXHR, textStatus, errorThrown){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });
}

function placeCity() {
    city.structures.forEach(function(structure) {
        placeStructure(structure);
    });
}

function placeStructure(struct) {
    console.log(struct);
    var structure = Gui.getStructureInfoByTypeId(struct.structureId);
    console.log(structure);

    var model = loadedModels[struct.structureId].getClone();
 	model.position = new THREE.Vector3( struct.x, struct.y, struct.z )
 	//model.rotation = new THREE.Vector3( 0, struct.rotation, 0 )

     scene.add(model);
     registerCollidableBoundingMesh(model);

     // Create a structure
     var structure = new Structure(model.name, model);
     structureCollection.add(structure);
}

function collidablesContainEmitter(colliderOrigin) {
    for(var index = 0; index < collidableBoundingBoxes.length; index ++) {
        if(collidableBoundingBoxes[index].containsPoint(colliderOrigin)){               
            return true;
        }
    }
    return false;
}

function changeColliderColor(collider, r, g, b) {
    if(collider.children[0].material != null ){
        collider.children[0].material.ambient.r = r;
        collider.children[0].material.ambient.g = g;
        collider.children[0].material.ambient.b = b;
    }
}

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
        noCollision = !collisionFlag;
    }
}

function setMouseOffset() {
    var curleft = 0;
	var curtop = 0;
    if (container.offsetParent) {
        var currentObj = container;
        do {
           curleft += currentObj.offsetLeft;
           curtop += currentObj.offsetTop;
        } while (currentObj = currentObj.offsetParent);
    }
    //return { x : curleft, y : curtop };
    mouseOffsetX = -curleft;
    mouseOffsetY = -curtop;
	/**
	 * mouseOffsetX = $(container).offset().left
	 * mouseOffsetY = $(container).offset().top
	 */
};

function onDocumentMouseMove( event ) {                                  // do we need to compute this on every movement?           
    event.preventDefault();
    mouse2D.x = ( (event.clientX + mouseOffsetX) / container.offsetWidth) * 2 - 1;
    mouse2D.y = - ( (event.clientY + mouseOffsetY) / container.offsetHeight ) * 2 + 1;
    //console.log(mouse2D);
}

function buildingPlacementAllowed() {                                     // true = can place buildings
    var mousePosValid = false;
    if(mouse2D.x > -1 && mouse2D.x < 1 && mouse2D.y > -1 && mouse2D.y < 1){                
        mousePosValid = true;
    }

    return noCollision && mousePosValid;
}

function onDocumentMouseDown( event ) {
    event.preventDefault();
	if((event.target || event.srcElement).nodeName != "CANVAS"){
		// We did not click on a canvas (so on the GUI instead)
		return;
	}

    if(rollOverMesh) {                                             //if the ghost model is visible
        if( buildingPlacementAllowed() ) {                               
            intersector = getMouseProjectionOnFloor();
            if(intersector) {
                var model;                                                        //avoid errors when trying to place buildings and the mouse hovers outside the floor area
                if(handling_flag){
                    model = currentModel;
                    model.position = intersector.point;
                    model.rotation = rollOverMesh.rotation.clone();

                    scene.add(model);
                    registerCollidableBoundingMesh(model);
                }
                else{
                    model = currentModel.getClone();
    				model.position = intersector.point;
    				model.rotation = rollOverMesh.rotation.clone();

    				scene.add(model);
    				registerCollidableBoundingMesh(model);

    				// Create a structure
    				var structure = new Structure(model.name, model);
                    structureCollection.add(structure);

    				// Now select what we just made (this is sort of ugly I suppose, but it works)
    				togglePlacementMode();
    				var intersects = getMouseProjectionOnObjects( selectableMeshes );
    				if(intersects.length > 0) {
    					if (selectedModel != intersects[0].object) {                    //we have a new selection
    						var topLevelMesh = getTopLevelMesh(model);
    						Gui.structureConstructed(structureCollection.findByMesh(topLevelMesh));// Inform the GUI we've constructed a building.

    						// Highlight selected model
    						clearSelectedModel();
    						highlightSelectedModel (intersects[0].object);
    					}
    				}
                }
            }
        }
		else {
			sounds.error.play();
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
    if(flag_placed){
        togglePlacementMode();
    }
}

function onKeyDown ( event ) {
    switch( event.keyCode ) {
        case 87: // w  
            moveCameraForward();
            break;
        case 83: // s
            moveCameraBackwards();
            break;
        case 65: // a  
            moveCameraLeft();
            break;
        case 68: // d
            moveCameraRight(); 
            break;
        case 69: // e  
            rotateCameraRight();
            break;
        case 81: // q  
            rotateCameraLeft();
            break;
        case 82: // r
            increaseCameraElevation(); 
            break;
        case 70: // f  
            decreaseCameraElevation(); 
            break;
        case 190: // .
            cameraZoomIn();
            break;
        case 188: // ,
            cameraZoomOut();
            break;
        case 80: // p  
            togglePlacementMode();
            break;
        case 219: // [, {
            rotateRollOverCCW();
            break;
        case 221: // ], }
            rotateRollOverCW();           
            break;
        case 75: // k
            printEmitterOfModel(rollOverMesh);                  //collision debugging
            showEmitterOfModel(rollOverMesh);
            break;
        case 88: // x
            removeSelectedModel();
            break;
		case 77: // "m"
			Music.toggle();
			break;

    }
}
function getLookAtDirection() {
    var lookDirection = cameraLookAt.clone();
    return lookDirection.sub(camera.position);
}

function getLookAtProjection () {                                                           //get projection of the cameraLookAtPoint on the y = camera.position.y plane.
    var projectionPoint = cameraLookAt.clone();
    projectionPoint.y = camera.position.y;
    return projectionPoint;
}

function getProjectionDirection() {
    var projectionPoint = getLookAtProjection();
    return projectionPoint.sub(camera.position);
}

function setCameraElevationAngle() {
    if(cameraElevationAngle === undefined){
        var lookAtReference = new THREE.Vector3 (cameraLookAt.x, camera.position.y, cameraLookAt.z);
        var elevationAngle = camera.position.angleTo(lookAtReference);
        cameraElevationAngle = elevationAngle;
    }
    return elevationAngle;                                      
}

function setCameraLookAngle() {
    if(cameraLookAngle === undefined) {
        var lookAtReference = new THREE.Vector3 (cameraLookAt.x, camera.position.y, cameraLookAt.z + getProjectionDistance());                                      
        var lookAngle = camera.position.angleTo(lookAtReference) + Math.PI/2;
        cameraLookAngle = lookAngle;
    }
    return lookAngle;
}

function getProjectionDistance() {                                                        //gets the distance to the projection of the cameraLookAtPoint on the y = camera.position.y plane.
    var projectionPoint = getLookAtProjection();
    var projectionDistance = camera.position.distanceTo(projectionPoint);
    return projectionDistance;
}

function getNormalizedProjectionDirection() {
    var projectionDirection = getProjectionDirection();
    return projectionDirection.normalize();
}

function rotateCameraRight() {
    cameraLookAngle -= 0.05;
    
    var projectionDistance = getProjectionDistance();
    camera.position.x = cameraLookAt.x + Math.cos( cameraLookAngle ) * projectionDistance;
    camera.position.z = cameraLookAt.z + Math.sin( cameraLookAngle ) * projectionDistance;        
}

function rotateCameraLeft() {
    cameraLookAngle += 0.05;
    
    var projectionDistance = getProjectionDistance();
    camera.position.x = cameraLookAt.x + Math.cos( cameraLookAngle ) * projectionDistance;
    camera.position.z = cameraLookAt.z + Math.sin( cameraLookAngle ) * projectionDistance;       
}



function moveCameraLeft() {
    var projectionDirection = getNormalizedProjectionDirection();
    //console.log(projectionDirection);
    if( Math.abs( cameraLookAt.x + projectionDirection.z ) < floor.geometry.width/2 && Math.abs( cameraLookAt.z - projectionDirection.x ) < floor.geometry.height/2 ) {
        camera.position.x += projectionDirection.z;
        camera.position.z -= projectionDirection.x;
        cameraLookAt.x += projectionDirection.z; 
        cameraLookAt.z -= projectionDirection.x; 
    }
}

function moveCameraRight() {
    var projectionDirection = getNormalizedProjectionDirection();
    //console.log(projectionDirection);
    if( Math.abs( cameraLookAt.x - projectionDirection.z ) < floor.geometry.width/2 && Math.abs( cameraLookAt.z + projectionDirection.x ) < floor.geometry.height/2 ) {
        camera.position.x -= projectionDirection.z;
        camera.position.z += projectionDirection.x;
        cameraLookAt.x -= projectionDirection.z; 
        cameraLookAt.z += projectionDirection.x;        
    }
}

function moveCameraForward() {
    var projectionDirection = getNormalizedProjectionDirection();
    //console.log(projectionDirection);
    if( Math.abs( cameraLookAt.x + projectionDirection.x ) < floor.geometry.width/2 && Math.abs( cameraLookAt.z + projectionDirection.z ) < floor.geometry.height/2 ) {
        camera.position.x += projectionDirection.x;
        camera.position.z += projectionDirection.z;
        cameraLookAt.x += projectionDirection.x; 
        cameraLookAt.z += projectionDirection.z; 
    }
}

function moveCameraBackwards() {
    var projectionDirection = getNormalizedProjectionDirection();
    //console.log(projectionDirection);
    if( Math.abs( cameraLookAt.x - projectionDirection.x ) < floor.geometry.width/2 && Math.abs( cameraLookAt.z - projectionDirection.z ) < floor.geometry.height/2 ) {
        camera.position.x -= projectionDirection.x;
        camera.position.z -= projectionDirection.z;
        cameraLookAt.x -= projectionDirection.x; 
        cameraLookAt.z -= projectionDirection.z; 
    }
}

function cameraZoomIn() {
    var lookDirection = getLookAtDirection().normalize();
    if(camera.position.distanceTo(cameraLookAt) > 25 ) {
        camera.position.x += lookDirection.x;
        camera.position.y += lookDirection.y;
        camera.position.z += lookDirection.z;
    }
}

function cameraZoomOut() {
    var lookDirection = getLookAtDirection().normalize();
    if(camera.position.distanceTo(cameraLookAt) < 75 ) {
        camera.position.x -= lookDirection.x;
        camera.position.y -= lookDirection.y;
        camera.position.z -= lookDirection.z;
    }
}

function increaseCameraElevation () {
    if(cameraElevationAngle*180/Math.PI > 35.0) {
        cameraElevationAngle -= 0.05;
        var lookDistance = camera.position.distanceTo(cameraLookAt);
        
        camera.position.x = cameraLookAt.x + Math.sin( cameraElevationAngle ) * Math.cos( cameraLookAngle ) * lookDistance;
        camera.position.z = cameraLookAt.z + Math.sin( cameraElevationAngle ) * Math.sin( cameraLookAngle ) * lookDistance;
        camera.position.y = cameraLookAt.y + Math.cos( cameraElevationAngle ) * lookDistance;        
    }
}

function decreaseCameraElevation () {
    if(cameraElevationAngle*180/Math.PI < 65) {
        cameraElevationAngle += 0.05;
        var lookDirection = getLookAtDirection().normalize();
        var lookDistance = camera.position.distanceTo(cameraLookAt);
        
        camera.position.x = cameraLookAt.x + Math.sin( cameraElevationAngle ) * Math.cos( cameraLookAngle ) * lookDistance;
        camera.position.z = cameraLookAt.z + Math.sin( cameraElevationAngle ) * Math.sin( cameraLookAngle ) * lookDistance;
        camera.position.y = cameraLookAt.y + Math.cos( cameraElevationAngle ) * lookDistance;           
    }
}

/*function nextBuilding() {
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
*/

function rotateRollOverCW() {
    if(rollOverMesh) {
        rollOverMesh.rotation.y += Math.PI/2;
    }
}

function rotateRollOverCCW() {
    if(rollOverMesh) {
        rollOverMesh.rotation.y -= Math.PI/2;      
    }
}

function removeSelectedModel() {
    if(selectedModel){
        for (var i = 0; i < scene.children.length; i++) {
            var child = scene.children[i];
            if(child.getMesh) {
                if (child.getMesh() == selectedModel) {                
                    scene.remove(child);                                            
                    scene.remove(selectedModel.modelBoundingMesh);

                    var meshIndex = collidableMeshList.indexOf(selectedModel.modelBoundingMesh);
                    collidableMeshList.splice(meshIndex, 1);
                    var bboxIndex = collidableBoundingBoxes.indexOf(selectedModel.modelBoundingBox);
                    collidableBoundingBoxes.splice(bboxIndex, 1);
                    var selectableIndex = selectableMeshes.indexOf(selectedModel);
                    selectableMeshes.splice(selectableIndex, 1);
                    break;
                }    
            }   
        }
        selectedModel = null;
    }
}

function refreshRollover() {
    if(rollOverMesh) {                                //check if it is set
        togglePlacementMode();					// why twice?
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
        //console.log(intersector);
        if(intersector)                                     //avoid errors when mouse is outside the floor area
            initRollOver(intersector);
        else {
            var projectionDirection = getNormalizedProjectionDirection();
            var floorSize = floor.modelBoundingBox.size(); 
            initRollOver(new THREE.Vector3(+projectionDirection.z * floorSize.x, 0, -projectionDirection.x * floorSize.z));            //force init at edge of the map if mouse projection is outside the floor surface 
        }
    }
}                         

function onWindowResize() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.offsetWidth, container.offsetHeight );
}

function animate() {
    requestAnimationFrame( animate );
    update();
    TWEEN.update();
    render();
}

function update() {
    var delta = clock.getDelta();
    if ( t > 1 ) t = 0;
    updateBirds(delta);
    updateFlag(delta);
    stats.update();
}

function highlightSelectedModel (model) {
	var topLevelMesh = getTopLevelMesh(model);
	Gui.structureSelected(structureCollection.findByMesh(topLevelMesh));// Inform the GUI we've selected a building. Will also play sound


    selectedModel = model;                                              //get the first object intersected;
    selectedModel.oldMaterial = selectedModel.material;
    var highlightMaterial = selectedModel.material.clone();             //needed, otherwise all models of the same type will get highlighted
    highlightMaterial.emissive.setHex(0x888888);
    selectedModel.material = highlightMaterial;
}

function clearSelectedModel () {
	Gui.structureUnselected();

    if(selectedModel) {                                         //if we already have a model selected
        selectedModel.material = selectedModel.oldMaterial;             //reset material to old one
    }
    selectedModel = null;
}

function getMouseProjectionOnObjects(objectArray) {
    raycaster = projector.pickingRay( mouse2D.clone(), camera );
    var intersects = raycaster.intersectObjects( objectArray );
    return intersects;
}

function getMouseProjectionOnFloor() {
    raycaster = projector.pickingRay( mouse2D.clone(), camera );
    var intersects = raycaster.intersectObject( floor.getMesh() );
    if ( intersects.length > 0 ) {
        intersector = getRealIntersector( intersects );
        return intersector;
    }
    return null;
}

function render() {
    camera.lookAt( cameraLookAt );

    if (rollOverMesh) {                                     //project rays only if the rollOverMesh is set 
        intersector = getMouseProjectionOnFloor();
        if ( intersector ) {
            //console.log(intersector);
            setRollOverPosition(intersector);
        }
    }

    detectCollision(rollOverMesh);  
    
    renderer.render( scene, camera );
}

function getRealIntersector( intersects ) {
    for( i = 0; i < intersects.length; i++ ) {
        intersector = intersects[ i ];
        if ( intersector.object == floor.getMesh() ) {        //otherwise we can build buildings on top of each other when viewing at the right angle
            return intersector;
        }
    }
    return null;
}

/** Travels up the model hierarchy until it finds a mesh whose parent is a scene*/
function getTopLevelMesh(object){
	if(object.parent instanceof THREE.Scene)
		return object;
	return getTopLevelMesh(object.parent);
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

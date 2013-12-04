if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var container, stats;

var camera, scene, renderer;
var material, dae, skin;

var currentModel;
var selectedModel;

var mouse2D, mouse3D, raycaster, rollOveredFace;
var mouseOffsetX, mouseOffsetY;
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

var cameraLookAt, cameraLookAngle, cameraElevationAngle;

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
    rollOverMesh = currentModel.getBoundingMesh(3, 3, 3);            // use values higher than 1 for increased collision precision
    var ghostModel = currentModel.getClone();
    var ghostMaterial = ghostModel.material.clone();

    setMaterial(ghostModel, ghostMaterial);
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

function init() {
    //CONTAINER    
    container = document.getElementById( 'main' );
    setMouseOffset();

    //SCENE
    scene = new THREE.Scene();
    
    //CAMERA
    camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 2000 );
    camera.position.set(0, 25, 50 );
    cameraLookAt = scene.position;

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

function setMouseOffset() {
    var curleft = curtop = 0;
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
};

function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse2D.x = ( (event.clientX + mouseOffsetX) / container.offsetWidth) * 2 - 1;
    mouse2D.y = - ( (event.clientY + mouseOffsetY) / container.offsetHeight ) * 2 + 1;
    //console.log(mouse2D);
}

function onDocumentMouseDown( event ) {
    event.preventDefault();
    if(rollOverMesh) {                                             //if the ghost model is visible     
        if(allowBuildingPlacement) {                               //and there there is no collision 
            intersector = getMouseProjectionOnFloor();
            if(intersector) {                                                        //avoid errors when trying to place buildings and the mouse hovers outside the floor area
                var i = buildings.length - 1;
                buildings[i] = currentModel.getClone();
                buildings[i].position = intersector.point;
                //console.log(intersector.point);
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
            previousBuilding();
            break;
        case 221: // ], }
            nextBuilding();           
            break;
        case 75: // k
            printEmitterOfModel(rollOverMesh);                  //collision debugging
            showEmitterOfModel(rollOverMesh);
            break;
        case 88: // x
            removeSelectedModel();
            break
    }
};

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
    var lookAtReference = new THREE.Vector3 (cameraLookAt.x, camera.position.y, cameraLookAt.z);
    var elevationAngle = camera.position.angleTo(lookAtReference);
    cameraElevationAngle = elevationAngle;
    return elevationAngle;                                      
}

function setCameraLookAngle() {
    var lookAtReference = new THREE.Vector3 (cameraLookAt.x, camera.position.y, cameraLookAt.z + getProjectionDistance());                                      
    var lookAngle = camera.position.angleTo(lookAtReference) + Math.PI/2;
    cameraLookAngle = lookAngle;
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
    if(cameraLookAngle === undefined)
        setCameraLookAngle();

    cameraLookAngle -= 0.05;
    
    var projectionDistance = getProjectionDistance();
    camera.position.x = cameraLookAt.x + Math.cos( cameraLookAngle ) * projectionDistance;
    camera.position.z = cameraLookAt.z + Math.sin( cameraLookAngle ) * projectionDistance;        
}

function rotateCameraLeft() {
    if(cameraLookAngle === undefined)
        setCameraLookAngle();

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
    if(camera.position.distanceTo(cameraLookAt) > 35 ) {
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
    if(cameraElevationAngle === undefined)
        setCameraElevationAngle();
    if(cameraLookAngle === undefined)
        setCameraLookAngle();

    if(cameraElevationAngle*180/Math.PI > 35.0) {
        cameraElevationAngle -= 0.05;
        var lookDirection = getLookAtDirection().normalize();
        var lookDistance = camera.position.distanceTo(cameraLookAt);
        
        camera.position.x = cameraLookAt.x + Math.sin( cameraElevationAngle ) * Math.cos( cameraLookAngle ) * lookDistance;
        camera.position.z = cameraLookAt.z + Math.sin( cameraElevationAngle ) * Math.sin( cameraLookAngle ) * lookDistance;
        camera.position.y = cameraLookAt.y + Math.cos( cameraElevationAngle ) * lookDistance;        
    }
}

function decreaseCameraElevation () {
    if(cameraElevationAngle === undefined)
        setCameraElevationAngle();
    if(cameraLookAngle === undefined)
        setCameraLookAngle();

    if(cameraElevationAngle*180/Math.PI < 60) {
        cameraElevationAngle += 0.05;
        var lookDirection = getLookAtDirection().normalize();
        var lookDistance = camera.position.distanceTo(cameraLookAt);
        
        camera.position.x = cameraLookAt.x + Math.sin( cameraElevationAngle ) * Math.cos( cameraLookAngle ) * lookDistance;
        camera.position.z = cameraLookAt.z + Math.sin( cameraElevationAngle ) * Math.sin( cameraLookAngle ) * lookDistance;
        camera.position.y = cameraLookAt.y + Math.cos( cameraElevationAngle ) * lookDistance;           
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

function removeSelectedModel() {
    for (var i = 0; i < scene.children.length; i++) {
        if (getMeshFromModel(scene.children[i]) == selectedModel) {
            scene.remove(scene.children[i]);
            break;
        }
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
        //console.log(intersector);
        if(intersector)                                     //avoid errors when mouse is outside the floor area
            initRollOver(intersector); 
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
    render();
}

function update() {
    var delta = clock.getDelta();
    if ( t > 1 ) t = 0;
    stats.update();
}

function highlightSelectedModel (model) {
    selectedModel = model;                                              //get the first object intersected;
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
    var timer = Date.now() * 0.0005;
    camera.lookAt( cameraLookAt );

    
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
        if ( intersector.object == floor.getMesh() ) {        //otherwise we can build buildings on top of each other when viewing at the right angle
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

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var host =  "http://localhost:8080/api/";
var Main = {
	city: null,
	clientOnlyMode: false,
	actorsDefinition: {
		// Actors HELLENIC buildings
		"hele_house": "structures/hellenes/house_new.xml",
		"hele_farm": "structures/hellenes/farmstead_new.xml",
		"hele_corral": "structures/hellenes/corral.xml",
		"hele_market": "structures/hellenes/market.xml",
		'hele_barracks': 'structures/hellenes/barracks_new.xml',
		"hele_storehouse": "structures/hellenes/storehouse.xml",
		"hele_blacksmith": "structures/hellenes/blacksmith.xml",
		"hele_fortress": "structures/hellenes/fortress_new.xml",
		"hele_tower": "structures/hellenes/wall_tower.xml",
		"hele_civic": "structures/hellenes/civic_centre_new.xml",
		"hele_temple": "structures/hellenes/temple_new.xml",

		// Actors ROMAN buildings
		'rome_house': 'structures/romans/house.xml',
		'rome_farm': 'structures/romans/farmstead.xml',
		'rome_corral': 'structures/romans/corral.xml',
		'rome_market': 'structures/romans/market.xml',
		'rome_storehouse': 'structures/romans/storehouse.xml',
		'rome_barracks': 'structures/romans/barracks.xml',
		'rome_blacksmith': 'structures/romans/blacksmith.xml',
		'rome_fortress': 'structures/romans/fortress.xml',
		'rome_tower': 'structures/romans/wall_tower.xml',
		'rome_civic': 'structures/romans/civic_centre.xml',
		'rome_temple': 'structures/romans/temple_mars.xml',

		// Actors CARTHAGINIAN buildings
		'kart_house': 'structures/carthaginians/house.xml',
		'kart_farm': 'structures/carthaginians/farmstead.xml',
		'kart_corral': 'structures/carthaginians/corral.xml',
		'kart_market': 'structures/carthaginians/market.xml',
		'kart_storehouse': 'structures/carthaginians/storehouse.xml',
		'kart_barracks': 'structures/carthaginians/barracks.xml',
		'kart_blacksmith': 'structures/carthaginians/blacksmith.xml',
		'kart_fortress': 'structures/carthaginians/fortress.xml',
		'kart_tower': 'structures/carthaginians/wall_tower.xml',
		'kart_civic': 'structures/carthaginians/civil_centre.xml',
		'kart_temple': 'structures/carthaginians/temple_big.xml',

		// Actors IBERIAN buildings
		'iber_house': 'structures/iberians/house.xml',
		'iber_farm': 'structures/iberians/farmstead.xml',
		'iber_corral': 'structures/iberians/corral.xml',
		'iber_market': 'structures/iberians/market.xml',
		'iber_storehouse': 'structures/iberians/storehouse.xml',
		'iber_barracks': 'structures/iberians/barracks.xml',
		'iber_blacksmith': 'structures/iberians/blacksmith.xml',
		'iber_fortress': 'structures/iberians/fortress.xml',
		'iber_tower': 'structures/iberians/wall_tower.xml',
		'iber_civic': 'structures/iberians/civil_centre.xml',
		'iber_temple': 'structures/iberians/temple.xml',

		// Actors PERSIAN buildings
		'pers_house': 'structures/persians/house.xml',
		'pers_farm': 'structures/persians/farmstead.xml',
		'pers_corral': 'structures/persians/corral.xml',
		'pers_market': 'structures/persians/market.xml',
		'pers_storehouse': 'structures/persians/storehouse.xml',
		'pers_barracks': 'structures/persians/barracks.xml',
		'pers_blacksmith': 'structures/persians/blacksmith.xml',
		'pers_fortress': 'structures/persians/fortress.xml',
		'pers_tower': 'structures/persians/wall_tower.xml',
		'pers_civic': 'structures/persians/civil_centre.xml',
		'pers_temple': 'structures/persians/temple.xml',

		// Actors PTOLEMIES buildings
		'ptol_house': 'structures/ptolemies/house.xml',
		'ptol_farm': 'structures/ptolemies/farmstead.xml',
		'ptol_corral': 'structures/ptolemies/corral.xml',
		'ptol_market': 'structures/ptolemies/market.xml',
		'ptol_storehouse': 'structures/ptolemies/storehouse.xml',
		'ptol_barracks': 'structures/ptolemies/barracks.xml',
		'ptol_blacksmith': 'structures/ptolemies/blacksmith.xml',
		'ptol_fortress': 'structures/ptolemies/fortress.xml',
		'ptol_tower': 'structures/ptolemies/defense_tower.xml',
		'ptol_civic': 'structures/ptolemies/civic_centre.xml',
		'ptol_temple': 'structures/ptolemies/temple.xml',

		// Actors PTOLEMIES buildings
		'maur_house': 'structures/mauryans/house.xml',
		'maur_farm': 'structures/mauryans/farmstead.xml',
		'maur_corral': 'structures/mauryans/corral.xml',
		'maur_market': 'structures/mauryans/market.xml',
		'maur_storehouse': 'structures/mauryans/storehouse.xml',
		'maur_barracks': 'structures/mauryans/barracks.xml',
		'maur_blacksmith': 'structures/mauryans/blacksmith.xml',
		'maur_fortress': 'structures/mauryans/fortress.xml',
		'maur_tower': 'structures/mauryans/wall_tower.xml',
		'maur_civic': 'structures/mauryans/civil_centre.xml',
		'maur_temple': 'structures/mauryans/temple.xml',

		// Actors GAIA
		'gaia_aleppo_pine': 'flora/trees/aleppo_pine.xml',
		'gaia_european_beech' : 'flora/trees/european_beech.xml',
		'gaia_mediterranean_cypress' : 'flora/trees/mediterranean_cypress.xml',
		'gaia_pine' : 'flora/trees/pine.xml',
		'gaia_poplar' : 'flora/trees/poplar.xml'
	},

	/** Initiates structure placement, loads model if not done so already */
	initStructurePlacement: function(structureId){
		function init(){
			currentModel = loadedModels[structureId];
			if(rollOverMesh) {
				refreshRollover();
			}
			if(rollOverMesh == undefined){
				togglePlacementMode();
			}
		}

		if(loadedModels[structureId] !== undefined){
			// Model is already loaded, show placement mode
			init();
		}
		else {
			// Model is not loaded, show placement when done loading
			loadModels([structureId], init);
		}
	},
	clientOnlyMode: false
}
var container, stats;

var camera,
	scene, 						// Base scene
	hlOutlineScene,				// For highlighting, contains outline mesh
	hlSelectedObjectScene,		// For highlighting, contains the selected object which is overlayed on outline
	renderer;

var loadedModels = [];
var currentModel;
var selectedModel;

var mouse2D, raycaster;
var mouseOffsetX, mouseOffsetY;
var rollOverMesh;
var voxelPosition = new THREE.Vector3(), tmpVec = new THREE.Vector3(), normalMatrix = new THREE.Matrix3();
var i, intersector, projector;

var noCollision;

var floor;                  //needed to restrict mouse projection to floor only
var collidableMeshList = [];    //collidable list
var collidableBoundingBoxes = [];   //avoid creating a new bounding box every time we check for collision
var selectableMeshes = [];          //merge this with collidableMeshList?       //might slow down collision detection, but we don't keep that many arrays;

var flag_placed = false;
var handling_flag = false;

var clock = new THREE.Clock();

var cameraLookAt, cameraLookAngle, cameraElevationAngle;
var structureCollection;
var sounds = {};
var outlineOffset = new THREE.Vector3(1, 1, 1);

init();

function initFloor() {
    var loader = new TerrainLoader();
    loader.load();
}

function initModels(callback){
	function load(name, xml){
		var loader = new ActorModelLoader();
		loader.addEventListener(ActorModelLoader.doneLoading, function(res){
			loadedModels[res.scene.name] = new ModelWrapper(res.scene);
			loader = null;

			if(--queue === 0){
				callback();
			}
		});
		loader.loadActorXml(name, xml);
	}
}

function initFloor() {
    var loader = new TerrainLoader();
    loader.load();
}

/** Loads structure models into memory
 * @param modelNames names of models, see Main.actorsDefinition
 * @param callback executed when done */
function loadModels(modelNames, callback){
	Gui.loadingSpinner.show();

	if(modelNames.length == 0){
		Gui.loadingSpinner.hide();

		if(typeof(callback) === 'function')
			callback();
		return;
	}

	function load(name, xml){
		var loader = new ActorModelLoader();
		loader.addEventListener(ActorModelLoader.doneLoading, function(res){
			loadedModels[res.scene.name] = new ModelWrapper(res.scene);
			loader = null;

			if(--queue === 0){
				Gui.loadingSpinner.hide();

				if(typeof(callback) === 'function')
					callback();
			}
		});
		loader.loadActorXml(name, xml);
	}

	var queue = modelNames.length;
	for(var i in modelNames){
		if(!modelNames.hasOwnProperty(i)) continue;
		load(modelNames[i], Main.actorsDefinition[modelNames[i]]);
	};
}

function initRollOver(position) {
    var ghostModel;
    if(currentModel){
        if(currentModel.material == null && getFlag() == null){
            rollOverMesh = currentModel.getBoundingMesh(3, 3, 3);            // use values higher than 1 for increased collision precision
            ghostModel = currentModel.getClone();
            ghostModel.position.set(-rollOverMesh.boundingBox.center().x, -rollOverMesh.boundingBox.center().y, -rollOverMesh.boundingBox.center().z);
            rollOverMesh.add(ghostModel);
            rollOverMesh.position.set(position.x, position.y, position.z);              //set initial position
            scene.add( rollOverMesh );

        }
        else if(currentModel.material != null){
            rollOverMesh = currentModel.getBoundingMesh(3, 3, 3);            // use values higher than 1 for increased collision precision
            ghostModel = currentModel.getClone();
			ghostModel.name = "ghost";
			rollOverMesh.add(ghostModel);

			var ghostMaterial = new THREE.MeshBasicMaterial( { opacity: .5, transparent:true, needsUpdate: true });
			rollOverMesh.material = ghostMaterial;
			// Apply ghost material to all sub meshes
			rollOverMesh.traverse(function(obj){
				if(obj instanceof THREE.Mesh){
					// Only replace the meshes that have the player color material
					if(obj.material instanceof THREE.ShaderMaterial){
						obj.material = ghostMaterial;
					}
					else {
						obj.visible = false;
					}
				}
			});

            ghostModel.position.set(-rollOverMesh.boundingBox.center().x, -rollOverMesh.boundingBox.center().y, -rollOverMesh.boundingBox.center().z);
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
    var modelBoundingBox = model.getBoundingBox();
    collidableBoundingBoxes.push(modelBoundingBox);
    //showBoundingBox(modelBoundingBox);                //collision debugging

    var modelBoundingMesh = model.getBoundingMesh(1, 1, 1);
    modelBoundingMesh.position.set(modelBoundingBox.center().x, modelBoundingBox.center().y, modelBoundingBox.center().z);
    scene.add(modelBoundingMesh);                               //need to add on the scene otherwise raytracing won't work
    collidableMeshList.push(modelBoundingMesh);

    //model.modelBoundingBox = modelBoundingBox;                               //add bounding box to the model (use for deletion)
    //model.modelBoundingMesh = modelBoundingMesh;                   //add bounding mesh to the model (use for deletion)


	selectableMeshes = selectableMeshes.concat( model.getDescendants() );        //  Add all descendants so players can click on props, too         //TODO fix this!
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
	sounds.questCompleted = new Sound(['audio/game/quest_complete.mp3'], { loop: false});
	sounds.mailSent = new Sound(['audio/game/mail_sent.wav'], { loop: false});
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
	hlOutlineScene = new THREE.Scene();
	hlSelectedObjectScene = new THREE.Scene();

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

	hlSelectedObjectScene.add( new THREE.AmbientLight( 0xcccccc ) );
	hlSelectedObjectScene.add(directionalLight.clone());

	var skybox = Skybox.get([
		'art/skybox/cloudy_0/yellowcloud_ft.jpg',
		'art/skybox/cloudy_0/yellowcloud_bk.jpg',
		'art/skybox/cloudy_0/yellowcloud_up.jpg',
		'art/skybox/cloudy_0/yellowcloud_dn.jpg',
		'art/skybox/cloudy_0/yellowcloud_rt.jpg',
		'art/skybox/cloudy_0/yellowcloud_lf.jpg'/*
		'art/skybox/cloudy_0/bluecloud_ft.jpg',
		'art/skybox/cloudy_0/bluecloud_bk.jpg',
		'art/skybox/cloudy_0/bluecloud_up.jpg',
		'art/skybox/cloudy_0/bluecloud_dn.jpg',
		'art/skybox/cloudy_0/bluecloud_rt.jpg',
		'art/skybox/cloudy_0/bluecloud_lf.jpg'
		'art/skybox/cloudy_0/graycloud_ft.jpg',
		'art/skybox/cloudy_0/graycloud_bk.jpg',
		'art/skybox/cloudy_0/graycloud_up.jpg',
		'art/skybox/cloudy_0/graycloud_dn.jpg',
		'art/skybox/cloudy_0/graycloud_rt.jpg',
		'art/skybox/cloudy_0/graycloud_lf.jpg'*/
	]);
	scene.add(skybox);

    // picking
    projector = new THREE.Projector();
    mouse2D = new THREE.Vector3( 0, 10000, 0.5 );

    //RENDERER
    renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.autoClear = false; 							// Because we render multiple passes
	renderer.setClearColor(0x000000, 1);
    renderer.setSize( container.offsetWidth, container.offsetHeight );
    container.appendChild( renderer.domElement );

    //STATS
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '80px';
    stats.domElement.style.right = '10px';
    container.appendChild( stats.domElement );

	// COLLECTION OF STRUCTURES
	structureCollection = new ModelArray();

	// Show login screen
	Gui.showLogin();
}

function placeCity(structures) {
	// Preload structure models
	var modelNames = [];
	$.each(structures, function(i, val) { if(modelNames.indexOf(val.structureId) == -1 ) { modelNames.push(val.structureId); } });

	loadModels(modelNames, function (){
		structures.forEach(function(structure) {
			placeStructure(structure);
		});
	});
}

function placeStructure(struct) {
    var model = loadedModels[struct.structureId].getClone();
 	model.position = new THREE.Vector3( struct.x, struct.y, struct.z );
 	model.rotation.y = struct.rotation;

    scene.add(model);
    registerCollidableBoundingMesh(model);

    // Create a structure
    var structure = new Structure(model.name, model, struct.id, struct.numCitizens);
    structureCollection.add(structure);
}

function saveStructure( structure ) {
    var struct = {
		maxCitizens: 100,
		numCitizens: structure.citizens,
		structureId: structure.name,
		x: structure.model.position.x,
		y: structure.model.position.y,
		z: structure.model.position.z,
		rotation: structure.model.rotation.y
	};

	if(Main.clientOnlyMode){
		structure.id = parseInt(Math.random() * 65535, 2);
		return;
	}
    var request = $.ajax({
        url: host + "city/" + Main.city.id + "/structure",
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(struct),
		context: structure
    });

    request.done(function(response, textStatus, jqXHR){
		// todo: Checking mechanism for concurrent requests!
		console.log("SERVER RESPONSE: new structure saved");
		// Save the newly generated id to the structure on the client
		this.id = response.id;
	});

    request.fail(function (jqXHR, textStatus, errorThrown){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });

}

/** Starts the game, populates the world, registers event handlers */
Main.startGame = function(){
	// register event handlers
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	window.addEventListener( 'resize', onWindowResize, false );
	scene.addEventListener("UPDATE", Gui.update);

	// Place structures
	if(!Main.clientOnlyMode){
		placeCity(Main.city.structures);
	}

	// Start game loop
	animate();

	// Display welcome message
	Gui.console.printText("Welcome to Utopolis [Beta]", 120000);
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
	collider.material.color.r = r;
	collider.material.color.g = g;
	collider.material.color.b = b;

	/*
	collider.children[0].material.color.r = r;
	collider.children[0].material.color.g = g;
	collider.children[0].material.color.b = b;

	collider.material.color.setHex(0xffff00);
	 collider.material.needsUpdate = true;

	 if(collider.children[0].material != null && collider.children[0].material.ambient){
    }*/
}

function detectCollision (collider) {           //collider = oject that detects collision (casts rays)
    if(collider)  {
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
}

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
    //event.preventDefault();
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
					// This is needed to update a material run-time
					model.material.needsUpdate = true;

					function setUpdateGeom(obj){
						// On all meshes (including props), set to be updateable

						if((obj instanceof THREE.Mesh)){
							obj.geometry.buffersNeedUpdate = true;
							obj.geometry.uvsNeedUpdate = true;
						}
					};
					model.traverse(setUpdateGeom);
    				scene.add(model);
    				registerCollidableBoundingMesh(model);

    				// Create a structure
    				var structure = new Structure(model.name, model);
                    structureCollection.add(structure);

                    saveStructure(structure);

    				// Now select what we just made (this is sort of ugly I suppose, but it works)
    				togglePlacementMode();
    				intersects = getMouseProjectionOnObjects( selectableMeshes );
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
	var tagName = $("*:focus").prop('tagName');
	if(tagName == "SELECT" || tagName == "INPUT" || tagName == "TEXTAREA"){
		// We're in a form, escape!
		return;
	}

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
        cameraElevationAngle = camera.position.angleTo(lookAtReference);
    }
    return cameraElevationAngle;
}

function setCameraLookAngle() {
    if(cameraLookAngle === undefined) {
        var lookAtReference = new THREE.Vector3 (cameraLookAt.x, camera.position.y, cameraLookAt.z + getProjectionDistance());
        cameraLookAngle = camera.position.angleTo(lookAtReference) + Math.PI / 2;
    }
    return cameraLookAngle;
}

function getProjectionDistance() {                                                        //gets the distance to the projection of the cameraLookAtPoint on the y = camera.position.y plane.
    var projectionPoint = getLookAtProjection();
    return camera.position.distanceTo(projectionPoint);
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
        //var lookDirection = getLookAtDirection().normalize();
        var lookDistance = camera.position.distanceTo(cameraLookAt);

        camera.position.x = cameraLookAt.x + Math.sin( cameraElevationAngle ) * Math.cos( cameraLookAngle ) * lookDistance;
        camera.position.z = cameraLookAt.z + Math.sin( cameraElevationAngle ) * Math.sin( cameraLookAngle ) * lookDistance;
        camera.position.y = cameraLookAt.y + Math.cos( cameraElevationAngle ) * lookDistance;
    }
}

function rotateRollOverCW() {
    if(rollOverMesh) {
        rollOverMesh.rotation.y += Math.PI/10;
    }
}

function rotateRollOverCCW() {
    if(rollOverMesh) {
        rollOverMesh.rotation.y -= Math.PI/10;
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
    stats.update();

	// Set size of the outline mesh, depending of distance to camera (very, VERY hackish :/) actually I dont think it's working at all
	if(outlineMesh && selectedModel){
		outlineMesh.scale.copy(selectedModel.scale).add(outlineOffset.clone().multiplyScalar(0.0001 * (camera.position.distanceTo(selectedModel.position)))).multiplyScalar(1.02);
	}

	var delta = clock.getDelta();
	// Dispatch 'UPDATE' event on scene
	scene.dispatchEvent({
		type: "UPDATE",
		delta: delta
	});
}

function render() {
	camera.lookAt( cameraLookAt );

	if (rollOverMesh) {                                     //project rays only if the rollOverMesh is set
		intersector = getMouseProjectionOnFloor();
		if ( intersector ) {
			setRollOverPosition(intersector);
		}
	}

	detectCollision(rollOverMesh);

	renderer.clear();
	renderer.render(scene, camera );
	renderer.render(hlOutlineScene, camera);
	renderer.render(hlSelectedObjectScene, camera);

}

var outlineMesh,
	selectedMesh;
function highlightSelectedModel (model) {
	var topLevelMesh = getTopLevelMesh(model);
	Gui.structureSelected(structureCollection.findByMesh(topLevelMesh));// Inform the GUI we've selected a building. Will also play sound

	// Create 'outline' mesh
	outlineMesh = topLevelMesh.clone();
	var outlineMaterial = new THREE.MeshBasicMaterial ( { depthWrite: false });
	setMaterial(outlineMesh, outlineMaterial);
	outlineMesh.position.copy(topLevelMesh.position);
	outlineMesh.rotation.copy(topLevelMesh.rotation);
	outlineMesh.scale.copy(topLevelMesh.scale);
	hlOutlineScene.add(outlineMesh);

	// Create 'outline overlay' mesh
	selectedMesh = topLevelMesh.clone();
	selectedMesh.position.copy(topLevelMesh.position);
	selectedMesh.rotation.copy(topLevelMesh.rotation);
	selectedMesh.scale.copy(topLevelMesh.scale);
	hlSelectedObjectScene.add(selectedMesh);

	selectedModel = topLevelMesh;                                              //get the first object intersected;
}

function clearSelectedModel () {
	Gui.structureUnselected();

    if(selectedModel) {                                         //if we already have a model selected

		// Delete previous outline mesh
		if(outlineMesh)
			hlOutlineScene.remove(outlineMesh);
		// Delete previous selected mesh
		if(selectedMesh)
			hlSelectedObjectScene.remove(selectedMesh);

	}
    selectedModel = null;
}

function getMouseProjectionOnObjects(objectArray) {
    raycaster = projector.pickingRay( mouse2D.clone(), camera );
    return raycaster.intersectObjects(objectArray);
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


function removeLights(model) {
	if (model.children) {
		for (var j = 0; j < model.children.length; j++) {
			var child = model.children[j];
			if (child instanceof THREE.Light) {
				model.children.splice(j, 1);
			}
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

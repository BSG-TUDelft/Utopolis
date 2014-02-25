/**
 * Created with JetBrains WebStorm.
 * User: wouter
 * Date: 19-12-13
 * Time: 22:31
 * To change this template use File | Settings | File Templates.
 */

"use strict";
var ActorModelLoader = function () {

	// PRIVATE VARS
	var scope = this;	// Because we lose reference to ourselves after calling colladaloader
	var colladaLoader = new THREE.ColladaLoader();
	colladaLoader.options.convertUpAxis = true;

	var textureUrlPrefix = "./art/textures/skins/";
	var meshUrlPrefix = "./art/meshes/";
	var actorsUrlPrefix = "./art/actors/";

	// PUBLIC METHODS
	/** Loads a model and its textures by providing the actor XML file */
	function loadActorXml (name, actorXml) {
		scope.modelName = name;
		var url =  actorsUrlPrefix + actorXml;
		$.ajax({
			type: "GET",
			url: url,
			dataType: "xml",
			success: function (xml) {
				//$(xml).find("variant[name*='Texture-Branches-1']").find("texture[name*='baseTex']").attr("file")
				//$(xml).find("variant[name*='Texture-Branches-1'] texture[name*='baseTex']").attr("file")

				//scope.propsQueue = $(xml).find("variant[name!='death'] props prop[attachpoint*='root']").map(function(index, el) { return el.attributes['actor'].nodeValue;}).toArray();
				//scope.propsQueue = $(xml).find("variant").first().find("props prop[attachpoint*='root']").map(function(index, el) { return { actor: el.attributes['actor'].nodeValue, attachPoint: el.attributes['attachpoint'].nodeValue };}).toArray();

				// Find all props that are attached to the root (the only ones we can actually use at this point)
				scope.propsQueue = $(xml).find("variant").first()// todo: also include garrisoned variant so we can have the flag
					.find("props prop").map(function(index, el) {
						// todo: filter these attachpoints through jQuery find
						if(el.attributes['attachpoint'].nodeValue != 'smoke' && el.attributes['attachpoint'].nodeValue != 'fire' && el.attributes['attachpoint'].nodeValue != 'loaded-projectile' && el.attributes['attachpoint'].nodeValue != 'projectile' && el.attributes['attachpoint'].nodeValue != 'garrisoned2' && el.attributes['attachpoint'].nodeValue != 'garrisoned_1')
							return { actor: el.attributes['actor'].nodeValue, attachPoint: el.attributes['attachpoint'].nodeValue };
					}).toArray();
				var textureUrl = textureUrlPrefix + $(xml).find("texture[name*='baseTex']").attr("file");
				textureUrl = checkTextureUrl(url, textureUrl);

				// Taking the first mesh
				var meshUrl = meshUrlPrefix + $(xml).find("mesh").first().text();
				var material;

				// This crude way of defining material looks if the <material> node contains the word player
				// and if so, loads the player color shader (where transparency == player color)
//				if($(xml).find("material").first().text().indexOf("player") > -1)
					material = getPlayerColorMaterial(textureUrl);
//				else
//					material = getAdditiveAlphaBlendingMaterial(textureUrl);

				// Load the mesh
				colladaLoader.load(meshUrl, function(material) {
					// Create closure for material
					return function(collada){
						doneLoadingScene(collada, material);
					}
				}(material));
			},
			error: function(xhr, status, error){
				console.error("ActorModelLoader.loadActorXml: Error loading xml [" + url + "]. Name: [" + name + "]. Error message: " + error);
			}
		});
	}

	// PRIVATE METHODS

	/** Gets called when main collada model is downloaded from the server*/
	function doneLoadingScene (collada, material){
		scope.scene = collada.scene;
		scope.scene.name = scope.modelName;
		scope.scene.castShadow = true;

		removeLights(scope.scene);
		setMaterial(scope.scene, material);

		scope.scene.scale.x = scope.scene.scale.y = scope.scene.scale.z = scope.scale;
		scope.scene.updateMatrix();

		loadProps();


		// Will dispatch event when done loading all the models
		checkIfDone();
	}

	/** Fires when a prop is done loading from the server */
	function doneLoadingProp(collada, material, attachPoint){
		var mesh = collada.scene;

		setMaterial(mesh, material);
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;	// Set scale to 1 because children are recursively scaled for some arcane reason

		var attachTo = null;
		// Find the scene to add this prop to
		if(attachPoint != "root"){
			// Prop is not added to root, find the child (prefixed with 'prop_' in collada file)
			attachTo = scope.scene.getObjectByName("prop_" + attachPoint, true);
		}
		if(attachTo == null){
			attachTo = scope.scene;
		}

		/*if(attachPoint == 'garrisoned'){
			scene.addEventListener("UPDATE", function(res){
				mesh.updateAnimation( 1000 * res.delta);
			});
		}*/
		attachTo.add(mesh);
		scope.scene.updateMatrix();


		checkIfDone();
	}

	/** Goes through the props array, loads props XML and mesh / textures afterwards */
	function loadProps(){
		for(var i = 0;  i < scope.propsQueue.length; i++){
			var url = actorsUrlPrefix + scope.propsQueue[i].actor;
			var attachPoint = scope.propsQueue[i].attachPoint;

			$.ajax({
				type: "GET",
				url: url,
				dataType: "xml",
				success: function(reqUrl, attachPoint) {
					// create closure for reqUrl, attachPoint and propIndex
					return function (xml) {

					if($(xml).find("actor group variant mesh").size() === 0){
						// There's no mesh, we don't know how to handle this. Keep calm and parse on.
						removeFromQueue(reqUrl);
						checkIfDone();
						return;
					}
					if($(xml).find("actor group variant textures texture[name*='baseTex']").size() === 0){
						console.warn("ActorModelLoader.loadProps: Could not find any texture with name=baseTex in prop [" + reqUrl + "]. Will not load this prop");
						removeFromQueue(reqUrl);
						checkIfDone();
						return;
					}

					var propMeshUrl = meshUrlPrefix + $(xml).find("actor group variant mesh").first().text();
					var propTextureUrl = textureUrlPrefix + $(xml).find("actor group variant textures texture[name*='baseTex']").first().attr("file");
					propTextureUrl = checkTextureUrl(reqUrl, propTextureUrl);

					// This crude way of defining material looks if the <material> node contains the word player
					// and if so, loads the player color shader (where transparency == player color)
					var material;
					if($(xml).find("material").first().text().indexOf("player") > -1)
						material = getPlayerColorMaterial(propTextureUrl);
					else
						material = getAdditiveAlphaBlendingMaterial(propTextureUrl);

					var propLoader = new THREE.ColladaLoader();
					propLoader.options.convertUpAxis = true;
					propLoader.load(propMeshUrl, function( material, attachPoint) {
						// Create closure for material and attachPoint
						return function(collada) {
							// Remove prop from loading queue
							removeFromQueue(reqUrl);

							doneLoadingProp(collada, material, attachPoint);
					}}(material, attachPoint));

				}}(url, attachPoint),
				error: function(reqUrl) {
					// create closeure for reqUrl
					return function(xhr, status, error){
					console.error("ActorModelLoader.loadProps: Error loading prop for [" + scope.modelName + "] xml [" + reqUrl + "]. Error message: " + error);
				}}(url)
			});
		}
		// removes a prop from the queue
		function removeFromQueue(url){
			for(var i = 0;  i < scope.propsQueue.length; i++){
				if(actorsUrlPrefix + scope.propsQueue[i].actor == url){
					scope.propsQueue.splice(i,1);
					break;
				}
			}
			//checkIfDone();
		}
	}

	/** If the mesh contains instances of THREE.Light, remove them */
	function removeLights(mesh) {
		if (mesh.children) {
			for (var j = 0; j < mesh.children.length; j++) {
				var child = mesh.children[j];
				if (child instanceof THREE.Light) {
					mesh.children.splice(j, 1);
				}
			}
		}
	}


	/** Recursively set material on children */
	function setMaterial(node, material) {
		node.material = material;
		if (node.children) {
			for (var i = 0; i < node.children.length; i++) {
				setMaterial(node.children[i], material);
			}
		}
	}

	/** Returns the material used in meshes that need to be textures with player color
	 * @param textureUrl {String} url to texture
	 * @returns {THREE.MeshLambertMaterial} to be applied to meshes */
	function getAdditiveAlphaBlendingMaterial(textureUrl){
		var texture = THREE.ImageUtils.loadTexture(textureUrl);
		var material = new THREE.MeshLambertMaterial({map: texture});

		material.transparent = true;
		material.needsUpdate = true;
		material.blending = THREE["AdditiveAlphaBlending"];
		return material;
	}

	/** Returns the material used in meshes that need to be textures with player color
	 * @param textureUrl {String} url to texture
	 * @returns {THREE.ShaderMaterial} to be applied to meshes */
	function getPlayerColorMaterial(textureUrl){
		// texture
		var texture = THREE.ImageUtils.loadTexture(textureUrl);

		// uniforms
		var uniforms = {
			color: { type: "c", value: scope.playerColor },
			texture: { type: "t", value: texture }
		};

		// attributes
		var attributes = {	};

		// material
		return new THREE.ShaderMaterial({
			needsUpdate: true,
			attributes: attributes,
			uniforms: uniforms,
			vertexShader: document.getElementById('player_color_vertex_shader').textContent,
			fragmentShader: document.getElementById('player_color_fragment_shader').textContent
		});
	}

	/** Will see if everything that needs to be loaded is loaded, fires doneLoading event if this is the case*/
	function checkIfDone(){
		if(scope.propsQueue.length === 0){
			scope.dispatchEvent({ type: ActorModelLoader.doneLoading, scene: scope.scene });
		}
	}

	/** Helper function to convert path ending with .dds to .png. */
	function checkTextureUrl(actorXml, textureUrl){//todo: whatif file has dds in the name?
		if(textureUrl.match(/dds/)){
			if(!scope.suppressDDSWarning){
				console.warn("ActorModelLoader.loadActorXml: The actor xml [" + actorXml + "] asked me to load a texture [" + textureUrl + "] but this appears to be a DirectDrawSurface (.dds) file which WebGL can't handle! I've taken the liberty of interpreting it as a .png file, so that had better be there!");
			}
			return textureUrl.substring(0, textureUrl.length - 3) + "png";
		}
		return textureUrl;
	}

	// PUBLIC INTERFACE
	// Public members
	this.modelName = null;
	this.playerColor = new THREE.Color( 0xFF0066 );

	// Public methods
	/** Loads a model and its textures by providing the actor XML file */
	this.loadActorXml = loadActorXml;
};
ActorModelLoader.prototype = {
	// Public properties
	/** Factor to which the models are scaled */
	scale: .5,

	modelName: null,
	textureUrl: null,
	propsQueue: [],	// Array of objects containing { actor, attachPoint}
	scene: null,
	suppressDDSWarning: true
};

// Public events
ActorModelLoader.doneLoading = "DONE_LOADING";

THREE.EventDispatcher.prototype.apply( ActorModelLoader.prototype );






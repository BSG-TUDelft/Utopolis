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
	var me = this;	// Because we lose reference to ourselves after calling colladaloader
	var colladaLoader = new THREE.ColladaLoader();
	colladaLoader.options.convertUpAxis = true;

	var textureUrlPrefix = "./art/textures/skins/";
	var meshUrlPrefix = "./art/meshes/";
	var actorsUrlPrefix = "./art/actors/";

	// PUBLIC METHODS
	/** Loads a model and its textures by providing the actor XML file */
	function loadActorXml (name, actorXml) {
		this.modelName = name;
		var url =  actorsUrlPrefix + actorXml;
		$.ajax({
			type: "GET",
			url: url,
			dataType: "xml",
			success: function (xml) {
				//$(xml).find("variant[name*='Texture-Branches-1']").find("texture[name*='baseTex']").attr("file")
				//$(xml).find("variant[name*='Texture-Branches-1'] texture[name*='baseTex']").attr("file")

				// Find all props that are attached to the root (the only ones we can actually use at this point)
				//me.props = $(xml).find("variant[name!='death'] props prop[attachpoint*='root']").map(function(index, el) { return el.attributes['actor'].nodeValue;}).toArray();
				me.props = $(xml).find("variant").first().find("props prop[attachpoint*='root']").map(function(index, el) { return el.attributes['actor'].nodeValue;}).toArray();

				me.textureUrl = textureUrlPrefix + $(xml).find("texture[name*='baseTex']").attr("file");
				me.textureUrl = checkTextureUrl(url, me.textureUrl);

				// Taking the first mesh
				var meshUrl = meshUrlPrefix + $(xml).find("mesh").first().text();

				// Load the mesh
				colladaLoader.load(meshUrl, doneLoadingScene);
			},
			error: function(xhr, status, error){
				console.error("ActorModelLoader.loadActorXml: Error loading xml [" + url + "]. Name: [" + name + "]. Error message: " + error);
			}
		});
	}

	// PRIVATE METHODS

	/** Gets called when */
	function doneLoadingScene (collada){
		me.scene = collada.scene;
		me.scene.name = me.modelName;
		removeLights(me.scene);

		var texture = THREE.ImageUtils.loadTexture(me.textureUrl);
		var material = new THREE.MeshLambertMaterial({map: texture});

		// Todo: figure out if we need different blend modes for different materials. Maybe additive alpha blending is overkill?
		material.transparent = true;
		material.blending = THREE["AdditiveAlphaBlending"];

		setMaterial(me.scene, material);
		me.scene.scale.x = me.scene.scale.y = me.scene.scale.z = me.scale;
		me.scene.updateMatrix();

		loadProps();


		// Will dispatch event when done loading all the models
		checkIfDone();
	}

	/** Fires when a prop is done loading */
	function doneLoadingProp(collada, propTextureUrl){
		var mesh = collada.scene;

		var texture = THREE.ImageUtils.loadTexture(propTextureUrl);
		var material = new THREE.MeshBasicMaterial({map: texture});

		// Todo: figure out if we need different blend modes for different materials. Maybe additive alpha blending is overkill?
		material.transparent = true;
		material.blending = THREE["AdditiveAlphaBlending"];

		setMaterial(mesh, material);
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;	// Set scale to 1 because children are recursively scaled for some arcane reason

		me.scene.add(mesh);
		me.scene.updateMatrix();


		checkIfDone();
	}

	/** Goes through the props array, loads props XML and mesh / textures afterwards */
	function loadProps(){
		for(var i = 0;  i < me.props.length; i++){
			var url = actorsUrlPrefix + me.props[i];
			$.ajax({
				type: "GET",
				url: url,
				dataType: "xml",
				success: function(reqUrl) {
					// create closure for reqUrl
					return function (xml) {
						if($(xml).find("actor group variant mesh").size() > 0){
							// This is a regular mesh prop, load collada model and texture
							var propMeshUrl = meshUrlPrefix + $(xml).find("actor group variant mesh").first().text();
							var propTextureUrl = textureUrlPrefix + $(xml).find("actor group variant textures texture[name*='baseTex']").first().attr("file");
							propTextureUrl = checkTextureUrl(reqUrl, propTextureUrl);

							var propLoader = new THREE.ColladaLoader();
							propLoader.options.convertUpAxis = true;
							propLoader.load(propMeshUrl, function( prTU) {
								// Create closure for propTextureUrl
								return function(collada) {
									// Remove prop from loading queue
									me.props.splice( $.inArray(reqUrl, me.props), 1 );

									doneLoadingProp(collada, prTU);
								}}(propTextureUrl));
						}
						if ($(xml).find("actor group variant decal").size() > 0){
							// This is a decal prop
							var width = $(xml).find("actor group variant decal").attr("width");
							var textureUrl = textureUrlPrefix + $(xml).find("actor group variant decal ~ textures texture[name*=baseTex]").attr("file");
							textureUrl = checkTextureUrl(reqUrl, textureUrl);

							loadDecal(textureUrl, width);
						}

						if($(xml).find("actor group variant textures texture[name*='baseTex']").size() === 0){
							console.warn("ActorModelLoader.loadProps: Could not find any texture with name=baseTex in prop [" + reqUrl + "]. We will not load this prop");
							checkIfDone();
							return;
						}
				}}(url),
				error: function(reqUrl) {
					// create closeure for reqUrl
					return function(xhr, status, error){
					console.error("ActorModelLoader.loadProps: Error loading prop xml [" + reqUrl + "]. Error message: " + error);
				}}(url)
			});
		}
	}

	/** Loads a decal (TODO) */
	function loadDecal(textureUrl, width){
		console.log("Loading decal: " + width + ", " + textureUrl);
		// TODO: ATTACH TO FLOOR SOMEHOW
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

	/** Will see if everything that needs to be loaded is loaded, fires doneLoading if this is the case*/
	function checkIfDone(){
		if(me.props.length === 0){
			me.dispatchEvent({ type: ActorModelLoader.doneLoading, scene: me.scene });
		}
	}

	/** Helper function to convert path ending with .dds to .png. */
	function checkTextureUrl(actorXml, textureUrl){
		if(textureUrl.match(/dds/)){
			if(!me.suppressDDSWarning){
				console.warn("ActorModelLoader.loadActorXml: The actor xml [" + actorXml + "] asked me to load a texture [" + textureUrl + "] but this appears to be a DirectDrawSurface (.dds) file which WebGL can't handle! I've taken the liberty of interpreting it as a .png file, so that had better be there!");
			}
			return textureUrl.substring(0, textureUrl.length - 3) + "png";
		}
		return textureUrl;
	}

	// PUBLIC INTERFACE
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
	props: [],
	scene: null,
	suppressDDSWarning: true
};

// Public events
ActorModelLoader.doneLoading = "DONE_LOADING";

THREE.EventDispatcher.prototype.apply( ActorModelLoader.prototype );

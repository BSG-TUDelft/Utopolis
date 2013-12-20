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

	// PUBLIC METHODS
	/** Loads a model and its textures by providing the actor XML file */
	function loadActorXml (name, actorXml) {
		this.modelName = name;
		$.ajax({
			type: "GET",
			url: actorXml,
			dataType: "xml",
			success: function (xml) {
				//$(xml).find("variant[name*='Texture-Branches-1']").find("texture[name*='baseTex']").attr("file")
				//$(xml).find("variant[name*='Texture-Branches-1'] texture[name*='baseTex']").attr("file")


				me.textureUrl = textureUrlPrefix + $(xml).find("texture[name*='baseTex']").attr("file");
				if(me.textureUrl.match(/dds/)){
					console.warn("ActorModelLoader.loadActorXml: The actor xml [" + actorXml + "] asked me to load a texture [" + me.textureUrl + "] but this appears to be a DirectDrawSurface (.dds) file which WebGL can't handle! I've taken the liberty of interpreting it as a .png file, so that had better be there!");
					me.textureUrl = me.textureUrl.substring(0, me.textureUrl.length - 3) + "png";
				}
				// Taking the first mesh
				var meshUrl = meshUrlPrefix + $(xml).find("mesh").first().text();

				// Load the mesh
				colladaLoader.load(meshUrl, doneLoadingMesh);
			},
			error: function(xhr, status, error){
				console.error("ActorModelLoader.loadActorXml: Error loading xml [" + actorXml + "]. Error message: " + error);
			}
		});
	}

	// PRIVATE METHODS

	/** Gets called when */
	function doneLoadingMesh (collada){
		var dae = collada.scene;
		dae.name = me.modelName;
		removeLights(dae);

		var texture = THREE.ImageUtils.loadTexture(me.textureUrl);
		var material = new THREE.MeshLambertMaterial({map: texture});

		material.transparent = true;
		material.blending = THREE["AdditiveAlphaBlending"];

		setMaterial(dae, material);
		dae.scale.x = dae.scale.y = dae.scale.z = me.scale;
		dae.updateMatrix();

		// Will dispatch event when done loading all the models
		me.dispatchEvent({ type: ActorModelLoader.doneLoading, scene: dae })
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
	textureUrl: null

};

// Public events
ActorModelLoader.doneLoading = "DONE_LOADING";

THREE.EventDispatcher.prototype.apply( ActorModelLoader.prototype );

/*
	loadModels: function () {
		for (var key in this.modelStructuresArray) {
			if (!this.modelStructuresArray.hasOwnProperty(key)) continue;
			this.load(key,
				this.modelStructuresArray,
				$.proxy(this.decreaseRemainingStructures, this)
			);		// Pass context to all callback functions because JS gets weird
		}
	},

	load: function (key, map, callbackDecRemainingStructures) {
		this.colladaLoader.load(map[key], this.setTextureOnModel(key, this.textureFile, callbackDecRemainingStructures));
	},

	setTextureOnModel: function (key, textureFile, callbackDecRemainingStructures) {
		return function (collada) {
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

			var dae = collada.scene;
			dae.name = key;
			removeLights(dae);
			var texture = THREE.ImageUtils.loadTexture(textureFile);
			var material = new THREE.MeshLambertMaterial({map: texture});

			material.transparent = true;
			material.blending = THREE.AdditiveAlphaBlending;

			setMaterial(dae, material);
			dae.scale.x = dae.scale.y = dae.scale.z = 0.4;
			dae.updateMatrix();
			this.loadedModels[key] = new ModelWrapper(dae);
			callbackDecRemainingStructures();
		};
	},

	decreaseRemainingStructures: function () {
		this.numModelStructures--;
		if (this.numModelStructures == 0) {
			// Will dispatch event when done loading all the models
			this.dispatchEvent({ type: ModelLoader.doneLoading })
		}
	},

	getSize: function (obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key))
				size++;
		}
		return size;
	}*/






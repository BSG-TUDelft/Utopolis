/**
 * Created with JetBrains WebStorm.
 * User: wouter
 * Date: 19-12-13
 * Time: 22:31
 * To change this template use File | Settings | File Templates.
 */

var BaseModelLoader = function () {

	this.numModelStructures = this.getSize(this.modelStructuresArray);
	this.colladaLoader = new THREE.ColladaLoader();
	this.colladaLoader.options.convertUpAxis = true;
}


BaseModelLoader.prototype = {
	// Public events
	doneLoading: "DONE_LOADING",


	numModelStructures: 0,
	colladaLoader: null,

	loadModels: function () {
		for (var key in this.modelStructuresArray) {
			if (!this.modelStructuresArray.hasOwnProperty(key)) continue;
			this.load(key,
				this.modelStructuresArray,
				$.proxy(this.decreaseRemainingStructures, this)			// Pass context to all callback functions because JS gets weird
			);
		}
	},

	load: function (key, map, callbackDecRemainingStructures) {
		this.colladaLoader.load( map[key], this.setTextureOnModel(key, this.textureFile, callbackDecRemainingStructures) );
	},

	setTextureOnModel : function (key, textureFile, callbackDecRemainingStructures) {
		return function ( collada ) {
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
		if(this.numModelStructures == 0) {
			// Will dispatch event when done loading all the models
			this.dispatchEvent( { type: ModelLoader.doneLoading })
		}
	},

	getSize: function(obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key))
				size++;
		}
		return size;
	}
}

THREE.EventDispatcher.prototype.apply( BaseModelLoader.prototype );





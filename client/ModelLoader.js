var loadedModels = [];

ModelLoader = function ( file ) {
	this.textureFile = file;
}

ModelLoader.prototype.loader = new THREE.ColladaLoader();
ModelLoader.prototype.loader.options.convertUpAxis = true;

ModelLoader.prototype.load = function (modelFile, callbackDecRemainingStructures) {
	this.loader.load( modelFile, this.setTextureOnModel(this.textureFile, callbackDecRemainingStructures) );
}

ModelLoader.prototype.setTextureOnModel = function (textureFile, callbackDecRemainingStructures) {
	
	return function ( collada ) {  	
		dae = collada.scene;
  		removeLights(dae);
   		var texture = THREE.ImageUtils.loadTexture(textureFile);
   		material = new THREE.MeshLambertMaterial({map: texture});
   		setMaterial(dae, material);
   		dae.scale.x = dae.scale.y = dae.scale.z = 0.2;
   		dae.updateMatrix();
   		this.loadedModels.push(dae);
		callbackDecRemainingStructures();
	};
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

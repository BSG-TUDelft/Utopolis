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
   		var texture = THREE.ImageUtils.loadTexture(textureFile);
   		material = new THREE.MeshLambertMaterial({map: texture});
   		setMaterial(dae, material);
   		dae.scale.x = dae.scale.y = dae.scale.z = 0.2;
   		dae.updateMatrix();
   		this.loadedModels.push(dae);
		callbackDecRemainingStructures();
		};
}

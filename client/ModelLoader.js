//var textureFile = './art/textures/skins/structural/iber_struct.png';
//var modelFile = './art/meshes/structural/iber_temple.dae';

ModelLoader = function () {

}

ModelLoader.prototype.loader = new THREE.ColladaLoader();
ModelLoader.prototype.loader.options.convertUpAxis = true;

ModelLoader.prototype.load = function (modelFile, textureFile) {
	this.loader.load( modelFile, this.setTextureOnModel(textureFile) );
}

ModelLoader.prototype.setTextureOnModel = function (textureFile) {
	return function ( collada ) {  	
		dae = collada.scene;
   		var texture = THREE.ImageUtils.loadTexture(textureFile);
   		material = new THREE.MeshLambertMaterial({map: texture});
   		setMaterial(dae, material);
   		dae.scale.x = dae.scale.y = dae.scale.z = 0.2;
   		dae.updateMatrix();
//		console.log(dae);
//		scene.add(dae);
		initRollOver();
		};
}

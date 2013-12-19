
var GaiaModelLoader = function () {
	this.modelStructuresArray = {
		"gaia_aleppo_pine":"./art/meshes/gaia/tree_pine_aleppo_1.dae"
	};
	this.textureFile = './art/textures/skins/gaia/aleppo_pine.png';

	BaseModelLoader.prototype.constructor.call();

	this.loadActorXml('./art/actors/flora/trees/aleppo_pine.xml')
}

GaiaModelLoader.prototype = new BaseModelLoader();
GaiaModelLoader.prototype.constructor = GaiaModelLoader;



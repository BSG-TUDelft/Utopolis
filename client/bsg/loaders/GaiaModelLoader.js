
var GaiaModelLoader = function () {
	this.modelStructuresArray = {
		//"gaia_aleppo_pine":"./art/meshes/gaia/tree_pine_aleppo_1.dae"
	};
	this.textureFile = './art/textures/skins/gaia/aleppo_pine.png';

	BaseModelLoader.prototype.constructor.call();

	function load(name, xml){
		var testLoader = new ActorModelLoader();
		testLoader.addEventListener(ActorModelLoader.doneLoading, function(res){
			console.log(res.scene);
			loadedModels[res.scene.name] = new ModelWrapper(res.scene);
			testLoader = null;
		});
		testLoader.loadActorXml(name, xml);

	}
	load('gaia_aleppo_pine', './art/actors/flora/trees/aleppo_pine.xml');
	load('hele_blacksmith', './art/actors/structures/hellenes/blacksmith.xml');

}

GaiaModelLoader.prototype = new BaseModelLoader();
GaiaModelLoader.prototype.constructor = GaiaModelLoader;



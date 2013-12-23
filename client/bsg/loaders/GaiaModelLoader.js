
var GaiaModelLoader = function () {
	this.modelStructuresArray = {
		//"gaia_aleppo_pine":"./art/meshes/gaia/tree_pine_aleppo_1.dae"
	};
	this.textureFile = './art/textures/skins/gaia/aleppo_pine.png';

	BaseModelLoader.prototype.constructor.call();

	function load(name, xml){
		var testLoader = new ActorModelLoader();
		testLoader.addEventListener(ActorModelLoader.doneLoading, function(res){
			loadedModels[res.scene.name] = new ModelWrapper(res.scene);
			testLoader = null;
		});
		testLoader.loadActorXml(name, xml);

	}
	load('gaia_aleppo_pine', 'flora/trees/aleppo_pine.xml');

	//load('hele_blacksmith', '');
	//load('hele_farm', '');
	//load('hele_house', '');

	var actors = {
		"hele_house": "structures/hellenes/house_new.xml",
		"hele_farm": "structures/hellenes/farmstead_new.xml",
		"hele_corral": "structures/hellenes/corral.xml",
		'hele_barracks': 'structures/hellenes/barracks.xml',
		"hele_storehouse": "structures/hellenes/storehouse.xml",
		"hele_blacksmith": "structures/hellenes/blacksmith.xml",
		"hele_fortress": "structures/hellenes/fortress_new.xml",
		"hele_tower": "structures/hellenes/wall_tower.xml",
		"hele_civic": "structures/hellenes/civic_centre_new.xml",
		"hele_temple": "structures/hellenes/temple_new.xml",

		'rome_house': 'structures/romans/house.xml',
		'rome_farm': 'structures/romans/farmstead.xml',
		'rome_corral': 'structures/romans/corral.xml',
		'rome_storehouse': 'structures/romans/storehouse.xml',
		'rome_barracks': 'structures/romans/barracks.xml',
		'rome_blacksmith': 'structures/romans/blacksmith.xml',
		'rome_fortress': 'structures/romans/fortress.xml',
		'rome_tower': 'structures/romans/wall_tower.xml',
		'rome_civic': 'structures/romans/civic_centre.xml',
		'rome_temple': 'structures/romans/temple_new.xml',

		'kart_house': 'structures/carthaginians/house.xml',
		'kart_farm': 'structures/carthaginians/farmstead.xml',
		'kart_corral': 'structures/carthaginians/corral.xml',
		'kart_storehouse': 'structures/carthaginians/storehouse.xml',
		'kart_barracks': 'structures/carthaginians/barracks.xml',
		'kart_blacksmith': 'structures/carthaginians/blacksmith.xml',
		'kart_fortress': 'structures/carthaginians/fortress.xml',
		'kart_tower': 'structures/carthaginians/wall_tower.xml',
		'kart_civic': 'structures/carthaginians/civil_centre.xml',
		'kart_temple': 'structures/carthaginians/temple_big.xml',

		'iber_house': 'structures/iberians/house.xml',
		'iber_farm': 'structures/iberians/farmstead.xml',
		'iber_corral': 'structures/iberians/corral.xml',
		'iber_storehouse': 'structures/iberians/storehouse.xml',
		'iber_barracks': 'structures/iberians/barracks.xml',
		'iber_blacksmith': 'structures/iberians/blacksmith.xml',
		'iber_fortress': 'structures/iberians/fortress.xml',
		'iber_tower': 'structures/iberians/wall_tower.xml',
		'iber_civic': 'structures/iberians/civil_centre.xml',
		'iber_temple': 'structures/iberians/temple.xml',

		'pers_house': 'structures/persians/house.xml',
		'pers_farm': 'structures/persians/farmstead.xml',
		'pers_corral': 'structures/persians/corral.xml',
		'pers_storehouse': 'structures/persians/storehouse.xml',
		'pers_barracks': 'structures/persians/barracks.xml',
		'pers_blacksmith': 'structures/persians/blacksmith.xml',
		'pers_fortress': 'structures/persians/fortress.xml',
		'pers_tower': 'structures/persians/wall_tower.xml',
		'pers_civic': 'structures/persians/civil_centre.xml',
		'pers_temple': 'structures/persians/temple.xml'

	}
	for(var i in actors){
		load(i, actors[i]);
	}

	//Gui.enoughResources = function() { return true; }	// use this for testing
}

GaiaModelLoader.prototype = new BaseModelLoader();
GaiaModelLoader.prototype.constructor = GaiaModelLoader;



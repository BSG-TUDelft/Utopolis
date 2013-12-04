//number of remaining structures to load
var numModelStructures;								// --- WARNING!!! --- make sure to change this number if you want to load more/less models 

IberModelLoader = function () {
	numModelStructures = this.getSize(this.modelStructuresArray);
}

IberModelLoader.prototype.loader = new ModelLoader('./art/textures/skins/structural/iber_struct.png');

IberModelLoader.prototype.loadModels = function () {
	for (var key in this.modelStructuresArray) {
	  	if (this.modelStructuresArray.hasOwnProperty(key)) {				//check if the property does not come from the constructor - i think we can safely remove this after some testing.
    		this.loader.load(key, this.modelStructuresArray, this.decreaseRemainingStructures);	
  		}
	}
}

IberModelLoader.prototype.decreaseRemainingStructures = function () {
	numModelStructures--;
	if(numModelStructures == 0) {
		//currentModel = loadedModels[0];
	}
}

IberModelLoader.prototype.modelStructuresArray = {
	'iber_barracks': './art/meshes/structural/iber_barracks.dae',
	'iber_blacksmith_struct': './art/meshes/structural/iber_blacksmith_struct.dae',
	'iber_civic_centre': './art/meshes/structural/iber_civic_centre.dae',
	'iber_corral': './art/meshes/structural/iber_corral.dae',
	'iber_dock': './art/meshes/structural/iber_dock.dae',		
	'iber_farmstead': './art/meshes/structural/iber_farmstead.dae',
	'iber_farmstead_b': './art/meshes/structural/iber_farmstead_b.dae',
	'iber_fortress': './art/meshes/structural/iber_fortress.dae',
	'iber_house_a': './art/meshes/structural/iber_house_a.dae',
	'iber_house_b': './art/meshes/structural/iber_house_b.dae',
	'iber_house_c': './art/meshes/structural/iber_house_c.dae',
	'iber_market': './art/meshes/structural/iber_market.dae',
	'iber_sb_mon_1': './art/meshes/structural/iber_sb_mon_1.dae',
	'iber_scout_tower': './art/meshes/structural/iber_scout_tower.dae',
	'iber_storehouse': './art/meshes/structural/iber_storehouse.dae',		
	'iber_temple': './art/meshes/structural/iber_temple.dae',
	'iber_wall_gate': './art/meshes/structural/iber_wall_gate.dae',
	'iber_wall_long': './art/meshes/structural/iber_wall_long.dae',
	'iber_wall_medium': './art/meshes/structural/iber_wall_medium.dae',
	'iber_wall_short': './art/meshes/structural/iber_wall_short.dae',
	'iber_wall_tower': './art/meshes/structural/iber_wall_tower.dae',
}

IberModelLoader.prototype.getSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) 
        	size++;
    }
    return size;
}


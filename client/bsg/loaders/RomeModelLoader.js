
var RomeModelLoader = function () {
	this.numModelStructures = this.getSize(this.modelStructuresArray);
}

RomeModelLoader.prototype.loader = new ModelLoader('./art/textures/skins/structural/rome_struct_2.png');

RomeModelLoader.prototype.loadModels = function () {
	for (var key in this.modelStructuresArray) {
	  	if (this.modelStructuresArray.hasOwnProperty(key)) {				//check if the property does not come from the constructor - i think we can safely remove this after some testing.
			this.loader.load(key,
				this.modelStructuresArray,
				$.proxy(this.decreaseRemainingStructures, this)		// Pass context to all callback functions because JS gets weird
			);
  		}
	}
}

RomeModelLoader.prototype.decreaseRemainingStructures = function () {
	this.numModelStructures--;
	if(this.numModelStructures == 0) {
		// Will dispatch event when done loading all the models
		this.dispatchEvent( { type: ModelLoader.doneLoading })
	}
}

RomeModelLoader.prototype.modelStructuresArray = {
	/*'rome_house': './art/meshes/structural/roman_house_a.dae',
	'rome_farm': './art/meshes/structural/rome_fc.dae',
	'rome_corral': './art/meshes/structural/rome_corral.dae',
	'rome_storehouse': './art/meshes/structural/rome_storehouse.dae',
	'rome_barracks': './art/meshes/structural/rome_barracks.dae',
	'rome_blacksmith': './art/meshes/structural/rome_blacksmith_struct_b.dae',
	'rome_fortress': './art/meshes/structural/rome_fortress.dae',
	'rome_tower': './art/meshes/structural/rome_wall_tower.dae',
	'rome_civic': './art/meshes/structural/rome_civic_center.dae', // MISSING TEXTURE
	'rome_temple': './art/meshes/structural/rome_temple_2.dae'		// needs a different texture*/


	/* unused:
	'rome_dock': './art/meshes/structural/rome_dock.dae',
	'rome_civic_house': './art/meshes/structural/rome_civic_house.dae',
	'roman_house_b': './art/meshes/structural/roman_house_b.dae',
	'roman_house_c': './art/meshes/structural/roman_house_c.dae',
	'rome_market_struct1': './art/meshes/structural/rome_market_struct1.dae',
	'rome_market_struct2': './art/meshes/structural/rome_market_struct2.dae',
	'rome_scout_tower': './art/meshes/structural/rome_scout_tower.dae',
	'rome_temple_big': './art/meshes/structural/rome_temple_big.dae',
	'rome_wall_gate': './art/meshes/structural/rome_wall_gate.dae',
	'rome_wall_long': './art/meshes/structural/rome_wall_long.dae',
	'rome_wall_medium': './art/meshes/structural/rome_wall_medium.dae',
	'rome_wall_short': './art/meshes/structural/rome_wall_short.dae', */
}

RomeModelLoader.prototype.getSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) 
        	size++;
    }
    return size;
}

THREE.EventDispatcher.prototype.apply( RomeModelLoader.prototype );



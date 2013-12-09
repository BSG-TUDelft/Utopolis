
var KartModelLoader = function () {
	this.numModelStructures = this.getSize(this.modelStructuresArray);
}

KartModelLoader.prototype.loader = new ModelLoader('./art/textures/skins/structural/kart_struct.png');

KartModelLoader.prototype.loadModels = function () {
	for (var key in this.modelStructuresArray) {
	  	if (this.modelStructuresArray.hasOwnProperty(key)) {				//check if the property does not come from the constructor - i think we can safely remove this after some testing.
			this.loader.load(key,
				this.modelStructuresArray,
				$.proxy(this.decreaseRemainingStructures, this)		// Pass context to all callback functions because JS gets weird
			);
  		}
	}
}

KartModelLoader.prototype.decreaseRemainingStructures = function () {
	this.numModelStructures--;
	if(this.numModelStructures == 0) {
		// Will dispatch event when done loading all the models
		this.dispatchEvent( { type: ModelLoader.doneLoading })
	}
}

KartModelLoader.prototype.modelStructuresArray = {
	'kart_house': './art/meshes/structural/kart_house_a.dae',
	'kart_farm': './art/meshes/structural/kart_farmstead.dae',
	'kart_corral': './art/meshes/structural/kart_corral.dae',
	'kart_storehouse': './art/meshes/structural/kart_storehouse.dae',
	'kart_blacksmith': './art/meshes/structural/kart_blacksmith.dae',
	'kart_fortress': './art/meshes/structural/kart_fortress.dae',
	'kart_wall': './art/meshes/structural/kart_wall_tower.dae',
	'kart_barracks': './art/meshes/structural/kart_barracks.dae',
	'kart_civic': './art/meshes/structural/kart_civiccentre.dae',
	'kart_temple': './art/meshes/structural/kart_temple_big.dae'

	/* Unused
	'kart_dock': './art/meshes/structural/kart_dock.dae',
	'kart_governmentcentre': './art/meshes/structural/kart_governmentcentre.dae',
	'kart_embassy': './art/meshes/structural/kart_embassy.dae',
	'kart_house_b': './art/meshes/structural/kart_house_b.dae',
	'kart_house_c': './art/meshes/structural/kart_house_c.dae',
	'kart_market': './art/meshes/structural/kart_market.dae',
	//'kart_superdock': './art/meshes/structural/kart_superdock.dae',  PARSE ERROR!!
	'kart_wall_gate': './art/meshes/structural/kart_wall_gate.dae',
	'kart_wall_long': './art/meshes/structural/kart_wall_long.dae',
	'kart_wall_medium': './art/meshes/structural/kart_wall_medium.dae',
	'kart_wall_short': './art/meshes/structural/kart_wall_short.dae',
	*/

}

KartModelLoader.prototype.getSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) 
        	size++;
    }
    return size;
}

THREE.EventDispatcher.prototype.apply( KartModelLoader.prototype );



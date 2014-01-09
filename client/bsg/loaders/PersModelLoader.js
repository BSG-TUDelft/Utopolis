
var PersModelLoader = function () {
	this.numModelStructures = this.getSize(this.modelStructuresArray);
}

PersModelLoader.prototype.loader = new ModelLoader('./art/textures/skins/structural/pers_struct.png');

PersModelLoader.prototype.loadModels = function () {
	for (var key in this.modelStructuresArray) {
	  	if (this.modelStructuresArray.hasOwnProperty(key)) {				//check if the property does not come from the constructor - i think we can safely remove this after some testing.
			this.loader.load(key,
				this.modelStructuresArray,
				$.proxy(this.decreaseRemainingStructures, this)		// Pass context to all callback functions because JS gets weird
			);
  		}
	}
}

PersModelLoader.prototype.decreaseRemainingStructures = function () {
	this.numModelStructures--;
	if(this.numModelStructures == 0) {
		// Will dispatch event when done loading all the models
		this.dispatchEvent( { type: ModelLoader.doneLoading })
	}
}

PersModelLoader.prototype.modelStructuresArray = {
	/*"pers_house":"./art/meshes/structural/pers_house_c.dae",
	"pers_farms":"./art/meshes/structural/pers_farmstead.dae",
	"pers_corral":"./art/meshes/structural/pers_corral.dae",
	"pers_storehouse":"./art/meshes/structural/pers_storehouse.dae",
	"pers_barracks":"./art/meshes/structural/pers_barracks.dae",
	"pers_blacksmith":"./art/meshes/structural/pers_blacksmith.dae",
	"pers_fortress":"./art/meshes/structural/pers_fortress_b.dae",
	"pers_tower":"./art/meshes/structural/pers_scout_tower_a.dae",
	"pers_civic":"./art/meshes/structural/pers_civic.dae",
	"pers_temple":"./art/meshes/structural/pers_temple_1.dae"

	/* Unused:
	//"pers_sb_1":"./art/meshes/structural/pers_sb_1.dae",
	//"pers_gardens_water":"./art/meshes/structural/pers_gardens_water.dae",
	"pers_gardens_waterfall":"./art/meshes/structural/pers_gardens_waterfall.dae",
	"pers_gardens_tree_euro_beech_a_aut":"./art/meshes/structural/pers_gardens_tree_euro_beech_a_aut.dae",
	"pers_wall_gate":"./art/meshes/structural/pers_wall_gate.dae",
	//"pers_gardens_tree_euro_beech_c":"./art/meshes/structural/pers_gardens_tree_euro_beech_c.dae", PARSE ERROR!!
	//"pers_gardens_tree_baobab_a":"./art/meshes/structural/pers_gardens_tree_baobab_a.dae",  PARSE ERROR!!
	"pers_house_d":"./art/meshes/structural/pers_house_d.dae",
	//"pers_market":"./art/meshes/structural/pers_market.dae",
	//"pers_fortress":"./art/meshes/structural/pers_fortress.dae", //PARSE ERROR!!
	"pers_stables":"./art/meshes/structural/pers_stables.dae",
	"pers_scout_tower_a":"./art/meshes/structural/pers_scout_tower_a.dae",
	//"pers_gardens_wrld_bush_b_2":"./art/meshes/structural/pers_gardens_wrld_bush_b_2.dae",  PARSE ERROR!!
	"pers_blacksmith_props":"./art/meshes/structural/pers_blacksmith_props.dae",
	"pers_dock":"./art/meshes/structural/pers_dock.dae",
	//"pers_gardens_bush_tempe_la_b2":"./art/meshes/structural/pers_gardens_bush_tempe_la_b2.dae", PARSE ERROR!!
	"pers_wall_medium":"./art/meshes/structural/pers_wall_medium.dae",
	//"pers_gardens_grass_field":"./art/meshes/structural/pers_gardens_grass_field.dae", PARSE ERROR!!
	"pers_wall_tower":"./art/meshes/structural/pers_wall_tower.dae",
	//"pers_gardens_tree_palmdate_b":"./art/meshes/structural/pers_gardens_tree_palmdate_b.dae", PARSE ERROR!!
	//"pers_gardens_water_lillies":"./art/meshes/structural/pers_gardens_water_lillies.dae", PARSE ERROR!!
	//"pers_gardens_struct_nature":"./art/meshes/structural/pers_gardens_struct_nature.dae", PARSE ERROR!!
	//"pers_gardens_bush_tempe_la_a":"./art/meshes/structural/pers_gardens_bush_tempe_la_a.dae",  PARSE ERROR!!
	"pers_wall":"./art/meshes/structural/pers_wall.dae",
	"pers_market_b":"./art/meshes/structural/pers_market_b.dae",
	//"pers_gardens_bush_desert_c":"./art/meshes/structural/pers_gardens_bush_desert_c.dae", PARSE ERROR!!
	"pers_sb2":"./art/meshes/structural/pers_sb2.dae",
	"pers_market_a":"./art/meshes/structural/pers_market_a.dae",
	//"pers_gardens_tree_apple_bloom":"./art/meshes/structural/pers_gardens_tree_apple_bloom.dae", PARSE ERROR!!
	//"pers_gardens_trunk_baobab":"./art/meshes/structural/pers_gardens_trunk_baobab.dae", PARSE ERROR!!
	//"pers_gardens_trunk_deciduous_b":"./art/meshes/structural/pers_gardens_trunk_deciduous_b.dae", PARSE ERROR!!
	//"pers_gardens_log_b":"./art/meshes/structural/pers_gardens_log_b.dae", PARSE ERROR!!
	"pers_gardens_struct":"./art/meshes/structural/pers_gardens_struct.dae",
	//"pers_gardens_tree_lumbardypoplar_a":"./art/meshes/structural/pers_gardens_tree_lumbardypoplar_a.dae",  PARSE ERROR!!
	"pers_scout_tower_b":"./art/meshes/structural/pers_scout_tower_b.dae",
	"pers_house_a":"./art/meshes/structural/pers_house_a.dae",
	//"pers_gardens_tree_baobab_b":"./art/meshes/structural/pers_gardens_tree_baobab_b.dae", PARSE ERROR!!
	"pers_ishtar":"./art/meshes/structural/pers_ishtar.dae",
	"pers_house_b":"./art/meshes/structural/pers_house_b.dae",
	"pers_sb_1_new":"./art/meshes/structural/pers_sb_1_new.dae",
	"pers_gardens_struct_transp":"./art/meshes/structural/pers_gardens_struct_transp.dae",
	//"pers_gardens_turf":"./art/meshes/structural/pers_gardens_turf.dae", PARSE ERROR!!
	"pers_wall_long":"./art/meshes/structural/pers_wall_long.dae",
	//"pers_gardens_bush_dese_a":"./art/meshes/structural/pers_gardens_bush_dese_a.dae", PARSE ERROR!!
	"pers_wall_short":"./art/meshes/structural/pers_wall_short.dae",
	"pers_palace":"./art/meshes/structural/pers_palace.dae",
	//"pers_gardens_bush_lush_a":"./art/meshes/structural/pers_gardens_bush_lush_a.dae", PARSE ERROR!!
	*/

}

PersModelLoader.prototype.getSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) 
        	size++;
    }
    return size;
}

THREE.EventDispatcher.prototype.apply( PersModelLoader.prototype );



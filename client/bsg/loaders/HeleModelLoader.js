
var HeleModelLoader = function () {
	this.numModelStructures = this.getSize(this.modelStructuresArray);
}

HeleModelLoader.prototype.loader = new ModelLoader('./art/textures/skins/structural/hele_struct_b.png');

HeleModelLoader.prototype.loadModels = function () {
	for (var key in this.modelStructuresArray) {
	  	if (this.modelStructuresArray.hasOwnProperty(key)) {				//check if the property does not come from the constructor - i think we can safely remove this after some testing.
			this.loader.load(key,
				this.modelStructuresArray,
				$.proxy(this.decreaseRemainingStructures, this)		// Pass context to all callback functions because JS gets weird
			);
  		}
	}
}

HeleModelLoader.prototype.decreaseRemainingStructures = function () {
	this.numModelStructures--;
	if(this.numModelStructures == 0) {
		// Will dispatch event when done loading all the models
		this.dispatchEvent( { type: ModelLoader.doneLoading })
	}
}

HeleModelLoader.prototype.modelStructuresArray = {
	//"hele_house":"./art/meshes/structural/hele_house_a.dae",
	//"hele_farm":"./art/meshes/structural/hele_farmstead.dae",
	"hele_corral":"./art/meshes/structural/hele_corral.dae",
	"hele_storehouse":"./art/meshes/structural/hele_storehouse.dae",
	//"hele_blacksmith":"./art/meshes/structural/hele_blacksmith_struct_b.dae",
	"hele_fortress":"./art/meshes/structural/hele_fortress.dae",
	"hele_tower":"./art/meshes/structural/hele_wall_tower.dae",
	"hele_civic":"./art/meshes/structural/hele_civic_struct.dae",
	"hele_temple":"./art/meshes/structural/hele_roundtemple_structB.dae"


	//missing:
	//'rome_barracks': './art/meshes/structural/rome_barracks.dae',


	/* unused:	"hele_blacksmith_struct_b":"./art/meshes/structural/hele_blacksmith_struct_b.dae",
	 "hele_cc":"./art/meshes/structural/hele_cc.dae",
	 //"hele_civic_props":"./art/meshes/structural/hele_civic_props.dae",parse error !!
	 //"hele_civic_round":"./art/meshes/structural/hele_civic_round.dae", parse error !!
	 //"hele_civic_shields":"./art/meshes/structural/hele_civic_shields.dae", parse error !!
	 "hele_civic_struct":"./art/meshes/structural/hele_civic_struct.dae",
	 //"hele_civic_tiles_long":"./art/meshes/structural/hele_civic_tiles_long.dae",parse error !!
	 //"hele_civic_tiles_short":"./art/meshes/structural/hele_civic_tiles_short.dae",parse error !!
	 //"hele_civic_trees":"./art/meshes/structural/hele_civic_trees.dae", parse error
	 "hele_corral":"./art/meshes/structural/hele_corral.dae",
	 "hele_farmstead":"./art/meshes/structural/hele_farmstead.dae",
	 "hele_ff":"./art/meshes/structural/hele_ff.dae",
	 "hele_fortress":"./art/meshes/structural/hele_fortress.dae",
	 "hele_fortress_up":"./art/meshes/structural/hele_fortress_up.dae",
	 "hele_gate":"./art/meshes/structural/hele_gate.dae",
	 "hele_gate_door":"./art/meshes/structural/hele_gate_door.dae",
	 "hele_gym":"./art/meshes/structural/hele_gym.dae",
	 //"hele_gym_a":"./art/meshes/structural/hele_gym_a.dae", parse error!
	 //"hele_gym_b":"./art/meshes/structural/hele_gym_b.dae", parse error!
	 "hele_hc":"./art/meshes/structural/hele_hc.dae",
	 "hele_house_a":"./art/meshes/structural/hele_house_a.dae",
	 "hele_house_b":"./art/meshes/structural/hele_house_b.dae",
	 "hele_house_c":"./art/meshes/structural/hele_house_c.dae",
	 "hele_house_d":"./art/meshes/structural/hele_house_d.dae",
	 "hele_house_e":"./art/meshes/structural/hele_house_e.dae",
	 "hele_ho_a":"./art/meshes/structural/hele_ho_a.dae",
	 "hele_ho_b":"./art/meshes/structural/hele_ho_b.dae",
	 "hele_ho_c":"./art/meshes/structural/hele_ho_c.dae",
	 //"hele_market_decor":"./art/meshes/structural/hele_market_decor.dae",
	 "hele_market_props_a":"./art/meshes/structural/hele_market_props_a.dae",
	 "hele_market_struct":"./art/meshes/structural/hele_market_struct.dae",
	 "hele_market_struct_b":"./art/meshes/structural/hele_market_struct_b.dae",
	 "hele_market_tile_c":"./art/meshes/structural/hele_market_tile_c.dae",
	 "hele_mc":"./art/meshes/structural/hele_mc.dae",
	 "hele_pc":"./art/meshes/structural/hele_pc.dae",
	 "hele_Prytaneion_decor":"./art/meshes/structural/hele_Prytaneion_decor.dae",
	 "hele_Prytaneion_props":"./art/meshes/structural/hele_Prytaneion_props.dae",
	 "hele_Prytaneion_struct":"./art/meshes/structural/hele_Prytaneion_struct.dae",
	 "hele_Prytaneion_structB":"./art/meshes/structural/hele_Prytaneion_structB.dae",
	 "hele_Prytaneion_tiles":"./art/meshes/structural/hele_Prytaneion_tiles.dae",
	 //"hele_roundtemple_props":"./art/meshes/structural/hele_roundtemple_props.dae",
	 //"hele_roundtemple_struct":"./art/meshes/structural/hele_roundtemple_struct.dae", parse error !!
	 "hele_roundtemple_structB":"./art/meshes/structural/hele_roundtemple_structB.dae",
	 "hele_sb1":"./art/meshes/structural/hele_sb1.dae",
	 "hele_sb3":"./art/meshes/structural/hele_sb3.dae",
	 "hele_sb4":"./art/meshes/structural/hele_sb4.dae",
	 "hele_scout_tower":"./art/meshes/structural/hele_scout_tower.dae",
	 //"hele_siege_tower":"./art/meshes/structural/hele_siege_tower.dae",parse error !!
	 "hele_stoa2_base":"./art/meshes/structural/hele_stoa2_base.dae",
	 "hele_stoa_base":"./art/meshes/structural/hele_stoa_base.dae",
	 "hele_storehouse":"./art/meshes/structural/hele_storehouse.dae",
	 "hele_tc":"./art/meshes/structural/hele_tc.dae",
	 "hele_temple_a_base":"./art/meshes/structural/hele_temple_a_base.dae",
	 //"hele_temple_a_props":"./art/meshes/structural/hele_temple_a_props.dae",parse error !!
	 //"hele_temple_a_struct":"./art/meshes/structural/hele_temple_a_struct.dae",parse error !!
	 //"hele_temple_b_base":"./art/meshes/structural/hele_temple_b_base.dae",parse error !!
	 //"hele_temple_b_props":"./art/meshes/structural/hele_temple_b_props.dae",parse error !!
	 //"hele_temple_b_struct":"./art/meshes/structural/hele_temple_b_struct.dae",parse error !!
	 //"hele_temple_c_base":"./art/meshes/structural/hele_temple_c_base.dae",parse error !!
	 //"hele_temple_c_props":"./art/meshes/structural/hele_temple_c_props.dae",parse error !!
	 //"hele_theatron_decor":"./art/meshes/structural/hele_theatron_decor.dae",
	 "hele_theatron_marble":"./art/meshes/structural/hele_theatron_marble.dae",
	 "hele_theatron_nature":"./art/meshes/structural/hele_theatron_nature.dae",
	 //"hele_theatron_propsa":"./art/meshes/structural/hele_theatron_propsa.dae",parse error !!
	 //"hele_theatron_struct":"./art/meshes/structural/hele_theatron_struct.dae",
	 //"hele_theatron_tilec":"./art/meshes/structural/hele_theatron_tilec.dae",
	 "hele_wall_gate":"./art/meshes/structural/hele_wall_gate.dae",
	 "hele_wall_long":"./art/meshes/structural/hele_wall_long.dae",
	 "hele_wall_medium":"./art/meshes/structural/hele_wall_medium.dae",
	 "hele_wall_short":"./art/meshes/structural/hele_wall_short.dae",
	 "hele_wall_tower":"./art/meshes/structural/hele_wall_tower.dae"*/
}

HeleModelLoader.prototype.getSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) 
        	size++;
    }
    return size;
}

THREE.EventDispatcher.prototype.apply( HeleModelLoader.prototype );



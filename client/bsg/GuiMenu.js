var menuData = {
	empires: [{
		name: "Hellenes",
		tabCss: "tab_helle",
		structures: [{
			name: "House",
			structureId: "hele_house",
			iconCss: "hele_house",
			structureType: 'house'
		},{
			name: "Farm",
			structureId: "hele_farm",
			iconCss: "hele_farm",
			structureType: "farm"
//				},{
//					name: "Corral",
//					structureId: "hele_corral",
//					iconCss: "hele_corral"
		},{
			name: "Storehouse",
			structureId: "hele_storehouse",
			iconCss: "hele_storehouse",
			structureType: "storehouse"
//				},{
//					name: "Barracks",
//					structureId: "hele_barracks",
//					iconCss: "hele_barracks"
		},{
			name: "Blacksmith",
			structureId: "hele_blacksmith",
			iconCss: "hele_blacksmith",
			structureType: "blacksmith"
//				},{
//					name: "Civic center",
//					structureId: "hele_civic",
//					iconCss: "hele_civic"
/*			cost: {
				stone: 1,
				metal: 1,
				food: 2
			},
			requirements: {
				culture: 4,
				knowledge: 4
			},
			buildTime: 30000 */
		},{
			name: "Tower",
			structureId: "hele_tower",
			iconCss: "hele_tower",
			structureType: "tower"

		},{
			name: "Fortress",
			structureId: "hele_fortress",
			iconCss: "hele_fortress",
			structureType: "fortress"

//				},{
//					name: "Temple",
//					structureId: "hele_temple",
//					iconCss: "hele_temple"
		}]
	}, {
		name: "Romans",
		tabCss: "tab_rome",
		structures: [{
			name: "House",
			structureId: "rome_house",
			iconCss: "rome_house",
			structureType: 'house'
		},{
			name: "Farm",
			structureId: "rome_farm",
			iconCss: "rome_farm",
			structureType: "farm"
		},{
			name: "Corral",
			structureId: "rome_corral",
			iconCss: "rome_corral",
			structureType: "corral"
		},{
			name: "Storehouse",
			structureId: "rome_storehouse",
			iconCss: "rome_storehouse",
			structureType: "storehouse"
		},{
			name: "Barracks",
			structureId: "rome_barracks",
			iconCss: "rome_barracks",
			structureType: "barracks"
		},{
			name: "Blacksmith",
			structureId: "rome_blacksmith",
			iconCss: "rome_blacksmith",
			structureType: "blacksmith"
//		},{
//			name: "Civic center",
//			structureId: "rome_civic",
//			iconCss: "rome_civic",
//			structureType: "civic"
		},{
			name: "Tower",
			structureId: "rome_tower",
			iconCss: "rome_tower",
			structureType: "tower"
		},{
			name: "Fortress",
			structureId: "rome_fortress",
			iconCss: "rome_fortress",
			structureType: "fortress"
		},{
			name: "Temple",
			structureId: "rome_temple",
			iconCss: "rome_temple",
			structureType: "temple"
		}]
	}, {
		name: "Carthaginians",
		tabCss: "tab_kart",
		structures: [{
			name: "House",
			structureId: "kart_house",
			iconCss: "kart_house",
			structureType: "house"
//				},{
//					name: "Farm",
//					structureId: "kart_farm",
//					iconCss: "kart_farm"
		},{
			name: "Corral",
			structureId: "kart_corral",
			iconCss: "kart_corral",
			structureType: "corral"
		},{
			name: "Storehouse",
			structureId: "kart_storehouse",
			iconCss: "kart_storehouse",
			structureType: "storehouse"
		},{
			name: "Barracks",
			structureId: "kart_barracks",
			iconCss: "kart_barracks",
			structureType: "barracks"
		},{
			name: "Blacksmith",
			structureId: "kart_blacksmith",
			iconCss: "kart_blacksmith",
			structureType: "blacksmith"
		},{
			name: "Civic center",
			structureId: "kart_civic",
			iconCss: "kart_civic",
			structureType: "civic"
		},{
			name: "Tower",
			structureId: "kart_tower",
			iconCss: "kart_tower",
			structureType: "tower"
		},{
			name: "Fortress",
			structureId: "kart_fortress",
			iconCss: "kart_fortress",
			structureType: "fortress"
		},{
			name: "Temple",
			structureId: "kart_temple",
			iconCss: "kart_temple",
			structureType: "temple"
		}]
	}, {
		name: "Iberians",
		tabCss: "tab_iber",
		structures: [{
			name: "House",
			structureId: "iber_house_a",
			iconCss: "iber_house",
			structureType: "house"
		},{
			name: "Farm",
			structureId: "iber_farmstead",
			iconCss: "iber_farm",
			structureType: "farm"
		},{
			name: "Corral",
			structureId: "iber_corral",
			iconCss: "iber_corral",
			structureType: "corral"
		},{
			name: "Storehouse",
			structureId: "iber_storehouse",
			iconCss: "iber_storehouse",
			structureType: "storehouse"
		},{
			name: "Barracks",
			structureId: "iber_barracks",
			iconCss: "iber_barracks",
			structureType: "barracks"
		},{
			name: "Blacksmith",
			structureId: "iber_blacksmith_struct",
			iconCss: "iber_blacksmith",
			structureType: "blacksmith"
		},{
			name: "Civic center",
			structureId: "iber_civic_centre",
			iconCss: "iber_civic",
			structureType: "civic"
		},{
			name: "Tower",
			structureId: "iber_scout_tower",
			iconCss: "iber_tower",
			structureType: "tower"
		},{
			name: "Fortress",
			structureId: "iber_fortress",
			iconCss: "iber_fortress",
			structureType: "fortress"
		},{
			name: "Temple",
			structureId: "iber_temple",
			iconCss: "iber_temple",
			structureType: "temple"
		}]
	}, {
		name: "Persians",
		tabCss: "tab_pers",
		structures: [{
			name: "House",
			structureId: "pers_house",
			iconCss: "pers_house",
			structureType: "house"
		},{
			name: "Farm",
			structureId: "pers_farm",
			iconCss: "pers_farm",
			structureType: "farm"
		},{
			name: "Corral",
			structureId: "pers_corral",
			iconCss: "pers_corral",
			structureType: "corral"
		},{
			name: "Storehouse",
			structureId: "pers_storehouse",
			iconCss: "pers_storehouse",
			structureType: "storehouse"
		},{
			name: "Barracks",
			structureId: "pers_barracks",
			iconCss: "pers_barracks",
			structureType: "barracks"
		},{
			name: "Blacksmith",
			structureId: "pers_blacksmith",
			iconCss: "pers_blacksmith",
			structureType: "blacksmith"
		},{
			name: "Civic center",
			structureId: "pers_civic",
			iconCss: "pers_civic",
			structureType: "civic"
		},{
			name: "Tower",
			structureId: "pers_tower",
			iconCss: "pers_tower",
			structureType: "tower"
		},{
			name: "Fortress",
			structureId: "pers_fortress",
			iconCss: "pers_fortress",
			structureType: "fortress"
		},{
			name: "Temple",
			structureId: "pers_temple",
			iconCss: "pers_temple",
			structureType: "temple"
		}]
	//}, {
	//	name: "Mauryans",
	//	tabCss: "tab_maur"
		}, {
			name: "Gaia",
			tabCss: "tab_gaia"
		}
	],

	/** Contains definitions for structure types. Note that keys under 'cost' and 'requirements' refer to keys in the resources collection */
	structureTypes: {
		"house": {
			cost: {
				wood: 1,
				food: 2
			},
			requirements: {
				culture: 4,
				knowledge: 4
			},
			buildTime: 30000,
			generates: {
				wood: 1,
				metal: 1,
				stone: 1,
				safety: 1
			}
		},
		"farm": {
			cost: {
				metal: 2,
				food: 2
			},
			requirements: {
				knowledge: 4,
				culture: 4
			},
			buildTime: 30000,
			generates: {
				food: 2,
				health: 1
			}
		},
		"corral": {
			cost: {
				metal: 4,
				food: 2
			},
			requirements: {
				knowledge: 4,
				culture: 4
			},
			buildTime: 30000,
			generates: {
				food: 4,
				health: 1
			}
		},
		"storehouse": {
			cost: {
				wood: 3,
				stone: 6
			},
			requirements: {
				knowledge: 4,
				culture: 4
			},
			buildTime: 120000,
			generates: {
				stone: 6,
				metal: 6,
				wood: 6,
				food: 8,
				economy: 3
			}

		},
		"barracks": {
			cost: {
				wood: 100,
				food: 250
			},
			requirements: {
				knowledge: 40,
				culture: 40
			},
			buildTime: 120000
		},
		"blacksmith": {
			cost: {
				wood: 100,
				food: 100
			},
			requirements: {

			},
			buildTime: 240000,
			generates: {
				wood: 10,
				metal: 10,
				stone: 10,
				safety: 5,
				peace: 5
			}

		},
		"tower": {
			cost: {
				stone: 25,
				metal: 25,
				food: 40
			},
			requirements: {
				knowledge: 25,
				culture: 25
			},
			buildTime: 120000,
			generates: {
				stone: 15,
				knowledge: 5,
				safety: 2
			}

		},
		"civic": {
			cost: {
				stone: 1,
				metal: 1,
				food: 2
			},
			requirements: {
				knowledge: 4,
				culture: 4
			},
			buildTime: 30000,
			generates: {
				knowledge: 1,
				culture: 1,
				peace: 1
			}

		},
		"fortress": {
			cost: {
				stone: 500,
				metal: 200,
				food: 1000
			},
			requirements: {
				knowledge: 500,
				culture: 500
			},
			buildTime: 300000,
			generates: {
				culture: 35,
				knowledge: 35,
				safety: 5,
				peace: 5,
				diplomacy: 5
			}

		},
		"temple": {
			cost: {
				stone: 500,
				food: 5000
			},
			requirements: {
				knowledge: 250,
				culture: 250
			},
			buildTime: 600000,
			generates: {
				culture: 35,
				spirituality: 15
			}

		}
	},

	/** Strings */
	resources: {
		wood: { name: "Wood", iconCss: "wood"},
		food: { name: "Food", iconCss: "food"},
		stone: { name: "Stone", iconCss: "stone"},
		metal: { name: "Metal", iconCss: "metal"},
		time: { name: "Time", iconCss: "time"},
		safety: { name: "Safety", iconCss: "safety"},
		health: { name: "Health", iconCss: "health"},
		knowledge: { name: "Knowledge", iconCss: "knowledge"},
		culture: { name: "Culture", iconCss: "culture"},
		economy: { name: "Economy", iconCss: "economy"},
		peace: { name: "Peace", iconCss: "peace"},
		diplomacy: { name: "Diplomacy", iconCss: "diplomacy"},
		spirituality: { name: "Spirituality", iconCss: "spirituality"}
	}
};

var topbarData = {
	resources: [{
		resourceId: 'citizens',
		name: 'Idle citizens',
		iconCss: 'citizens',
		formatter: function(val) { return $.format('{0} idle citizens', val); }
	}, {
		resourceId: 'wood',
		name: 'Wood',
		iconCss: 'wood',
		formatter: function(val) { return Math.floor(val); }
	}, {
		resourceId: 'stone',
		name: 'Stone',
		iconCss: 'stone',
		formatter: function(val) { return Math.floor(val); }
	}, {
		resourceId: 'metal',
		name: 'Metal',
		iconCss: 'metal',
		formatter: function(val) { return Math.floor(val); }
	}, {
		resourceId: 'food',
		name: 'Food',
		iconCss: 'food',
		formatter: function(val) { return Math.floor(val); }
	}]
};

function initGui() {
	"use strict";

	var menu = new Menu(menuData);
	menu.init();

	var topbar = new Topbar(topbarData);
	topbar.init();

	// Example use:
	menu.addEventListener(Menu.structureSelected, function(e){
		// Clicked on the same structure again means disable placement mode
		if(e.structure == null) {
			togglePlacementMode();
		}
		else {
			if(enoughResources(menuData.structureTypes[e.structure.structureType])) {
				currentModel = loadedModels[e.structure.structureId];

				if(rollOverMesh) {
					refreshRollover();
				}
				if(rollOverMesh == undefined)
					togglePlacementMode();
			}
			else {																		//if not enough resources, deselect building.
				$("#structures li").removeClass("selected");
				menu.selectedStructureId = null;
			}
		}

	});

	// Set values directly (the property names have to correspond those you used in topbarData ctr)
	topbar.setResourceValues({
		wood: 25,
		food: 200
	});

	// Incrementing example (client side)
	var res = {
		wood: 0,
		stone: 0,
		metal: 0,
		food: 0,
		citizens: 0
	}
	setInterval(function(){
		res.wood += .75;
		res.stone += .5;
		res.metal += .25;
		res.food += 1;
		res.citizens = Math.floor(Math.random() * 25);
		topbar.setResourceValues(res);

		menu.setResourceValues(res);
	}, 500)

	var enoughResources = function (structureType) {
		if(structureType.cost.wood) {
			if(res.wood < structureType.cost.wood)
				return false;
		}
		if(structureType.cost.stone) {
			if(res.stone < structureType.cost.stone)
				return false;
		}
		if(structureType.cost.food) {
			if(res.food < structureType.cost.food)
				return false;
		}
		if(structureType.cost.metal) {
			if(res.metal < structureType.cost.metal)
				return false;
		}
		if(structureType.requirements.knowledge) {
			if(res.knowledge < structureType.requirements.knowledge)
				return false;
		}
		if(structureType.requirements.culture) {
			if(res.culture < structureType.requirements.culture)
				return false;
		}
		return true;
	}

	/** Leaderboard*/
	var getRndInt = function(max){
		return Math.floor(Math.random() * max);
	}

	var getRndIcons = function() {
		return {
			bronze1: Math.random() < .5,
			bronze2: Math.random() < .5,
			bronze3: Math.random() < .5,
			silver1: Math.random() < .5,
			silver2: Math.random() < .5,
			silver3: Math.random() < .5,
			gold1: Math.random() < .5,
			gold2: Math.random() < .5,
			gold3: Math.random() < .5
		};
	}

	var data = [
		[ "Han Solo", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000), getRndIcons() ],
		[ "Luke Skywalker", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000), getRndIcons() ],
		[ "Leia Organa", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000), getRndIcons() ],
		[ "Boba Fett", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000), getRndIcons() ],
		[ "Darth Vader", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000), getRndIcons() ],
		[ "Yoda", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000), getRndIcons() ],
		[ "Chewbacca", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000), getRndIcons() ],
		[ "Obi Wan Kenobi", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000), getRndIcons() ],
		[ "Jabba the Hut", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000), getRndIcons() ],
		[ "Lando Calrissian", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000), getRndIcons() ]
	];

	/** Initiates a leaderboard with parent and given inital data */
	var leaderboard = new Leaderboard($("body"), data);

	/** Test / demo function */
	setInterval(function(){
		for(var i = 0; i < data.length; i++){
			data[i][1] += Math.floor(Math.random() * 10);
			data[i][2] += Math.floor(Math.random() * 10);
			data[i][3] += Math.floor(Math.random() * 10);
			data[i][4] += Math.floor(Math.random() * 10);
		}
		leaderboard.update(data);
	}, 1500);


	$( "body" ).keypress(function( event ) {
		switch(event.which){

			case "l".charCodeAt(0):
				leaderboard.toggle();
				break;
		}
	});
}

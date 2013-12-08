var menuData = {
	empires: [{
		name: "Hellenes",
		tabCss: "tab_helle",
		structures: [{
			name: "House",
			structureId: "hele_house",
			iconCss: "hele_house"
		},{
			name: "Farm",
			structureId: "hele_farm",
			iconCss: "hele_farm"
//				},{
//					name: "Corral",
//					structureId: "hele_corral",
//					iconCss: "hele_corral"
		},{
			name: "Storehouse",
			structureId: "hele_storehouse",
			iconCss: "hele_storehouse"
//				},{
//					name: "Barracks",
//					structureId: "hele_barracks",
//					iconCss: "hele_barracks"
		},{
			name: "Blacksmith",
			structureId: "hele_blacksmith",
			iconCss: "hele_blacksmith"
//				},{
//					name: "Civic center",
//					structureId: "hele_civic",
//					iconCss: "hele_civic"
		},{
			name: "Tower",
			structureId: "hele_tower",
			iconCss: "hele_tower"
		},{
			name: "Fortress",
			structureId: "hele_fortress",
			iconCss: "hele_fortress"
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
			iconCss: "rome_house"
		},{
			name: "Farm",
			structureId: "rome_farm",
			iconCss: "rome_farm"
		},{
			name: "Corral",
			structureId: "rome_corral",
			iconCss: "rome_corral"
		},{
			name: "Storehouse",
			structureId: "rome_storehouse",
			iconCss: "rome_storehouse"
		},{
			name: "Barracks",
			structureId: "rome_barracks",
			iconCss: "rome_barracks"
		},{
			name: "Blacksmith",
			structureId: "rome_blacksmith",
			iconCss: "rome_blacksmith"
//				},{
//					name: "Civic center",
//					structureId: "rome_civic",
//					iconCss: "rome_civic"
		},{
			name: "Tower",
			structureId: "rome_tower",
			iconCss: "rome_tower"
		},{
			name: "Fortress",
			structureId: "rome_fortress",
			iconCss: "rome_fortress"
		},{
			name: "Temple",
			structureId: "rome_temple",
			iconCss: "rome_temple"
		}]
	}, {
		name: "Carthaginians",
		tabCss: "tab_kart",
		structures: [{
			name: "House",
			structureId: "kart_house",
			iconCss: "kart_house"
//				},{
//					name: "Farm",
//					structureId: "kart_farm",
//					iconCss: "kart_farm"
		},{
			name: "Corral",
			structureId: "kart_corral",
			iconCss: "kart_corral"
		},{
			name: "Storehouse",
			structureId: "kart_storehouse",
			iconCss: "kart_storehouse"
		},{
			name: "Barracks",
			structureId: "kart_barracks",
			iconCss: "kart_barracks"
		},{
			name: "Blacksmith",
			structureId: "kart_blacksmith",
			iconCss: "kart_blacksmith"
		},{
			name: "Civic center",
			structureId: "kart_civic",
			iconCss: "kart_civic"
		},{
			name: "Tower",
			structureId: "kart_tower",
			iconCss: "kart_tower"
		},{
			name: "Fortress",
			structureId: "kart_fortress",
			iconCss: "kart_fortress"
		},{
			name: "Temple",
			structureId: "kart_temple",
			iconCss: "kart_temple"
		}]
	}, {
		name: "Iberians",
		tabCss: "tab_iber",
		structures: [{
			name: "House",
			structureId: "iber_house_a",
			iconCss: "iber_house"
		},{
			name: "Farm",
			structureId: "iber_farmstead",
			iconCss: "iber_farm"
		},{
			name: "Corral",
			structureId: "iber_corral",
			iconCss: "iber_corral"
		},{
			name: "Storehouse",
			structureId: "iber_storehouse",
			iconCss: "iber_storehouse"
		},{
			name: "Barracks",
			structureId: "iber_barracks",
			iconCss: "iber_barracks"
		},{
			name: "Blacksmith",
			structureId: "iber_blacksmith_struct",
			iconCss: "iber_blacksmith"
		},{
			name: "Civic center",
			structureId: "iber_civic_centre",
			iconCss: "iber_civic"
		},{
			name: "Tower",
			structureId: "iber_scout_tower",
			iconCss: "iber_tower"
		},{
			name: "Fortress",
			structureId: "iber_fortress",
			iconCss: "iber_fortress"
		},{
			name: "Temple",
			structureId: "iber_temple",
			iconCss: "iber_temple"
		}]
	}, {
		name: "Persians",
		tabCss: "tab_pers",
		structures: [{
			name: "House",
			structureId: "pers_house",
			iconCss: "pers_house"
		},{
			name: "Farm",
			structureId: "pers_farm",
			iconCss: "pers_farm"
		},{
			name: "Corral",
			structureId: "pers_corral",
			iconCss: "pers_corral"
		},{
			name: "Storehouse",
			structureId: "pers_storehouse",
			iconCss: "pers_storehouse"
		},{
			name: "Barracks",
			structureId: "pers_barracks",
			iconCss: "pers_barracks"
		},{
			name: "Blacksmith",
			structureId: "pers_blacksmith",
			iconCss: "pers_blacksmith"
		},{
			name: "Civic center",
			structureId: "pers_civic",
			iconCss: "pers_civic"
		},{
			name: "Tower",
			structureId: "pers_tower",
			iconCss: "pers_tower"
		},{
			name: "Fortress",
			structureId: "pers_fortress",
			iconCss: "pers_fortress"
		},{
			name: "Temple",
			structureId: "pers_temple",
			iconCss: "pers_temple"
		}]
	}, {
		name: "Mauryans",
		tabCss: "tab_maur"
	}]
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
		console.log("You clicked on " + e.structure.structureId + "");
		console.log(loadedModels);
		currentModel = loadedModels[e.structure.structureId];
		console.log(currentModel);
		console.log(rollOverMesh);
		if(rollOverMesh) {
			refreshRollover();
		}
		if(rollOverMesh == undefined)
			togglePlacementMode();
		
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
	}, 500)



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

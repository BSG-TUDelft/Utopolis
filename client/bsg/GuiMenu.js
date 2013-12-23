"use strict";
// DEFAULT GUI
var Gui = {

	// PROPERTIES
	structurePopup: null,
	resources: {},				// Current players' resources
	topbar: null,				// Top bar menu element
	buildMenu: null,			// Build menu on the left
	contextMenu: null,			// Context menu on the right
	console: null,				// Console to display text
	timeLastPoll: $.now(),		// Time of last poll
	pollInterval: 2000,			// Interval of polling (in ms)

	// METHODS
	initGui: function (menuData, topbarData){
		this.menuData = menuData;

		// Initialize console, has to be done first so other stuff can overlay
		Gui.console = new Console($("body"));
		Gui.console.printText("Initializing ...", null);

		// Initialize build menu on the left
		Gui.buildMenu = new BuildMenu($("#left_menu"), menuData);
		Gui.buildMenu.init();

		// Add event listener to build menu
		Gui.buildMenu.addEventListener(BuildMenu.structureSelected, function(e){
			// Clicked on the same structure again means disable placement mode
			if(e.structure == null) {
				togglePlacementMode();
			}
			else if(e.structure.structureId == "flag" && flag_placed == false){
				currentModel = new ModelWrapper(initFlag(15, 'images/flag/flag.jpg'));

				if(rollOverMesh) {
					refreshRollover();
				}
				if(rollOverMesh == undefined)
					togglePlacementMode();
			}
			else if(e.structure.structureId == "flag" && flag_placed == true){
				return;
			}
			else {
				if(Gui.enoughResources(Gui.resources, menuData.structureTypes[e.structure.structureType])) {
					currentModel = loadedModels[e.structure.structureId];

					if(rollOverMesh) {
						refreshRollover();
					}
					if(rollOverMesh == undefined)
						togglePlacementMode();
				}
				else {																		//if not enough resources, deselect building.
					$("#structures").find("li").removeClass("selected");
					Gui.buildMenu.selectedStructureId = null;
				}
			}

		});

		// Initialize topbar menu element
		Gui.topbar = new Topbar(topbarData);
		Gui.topbar.init();

		// Initialize right context menu
		Gui.contextMenu = new ContextMenu($("#right_menu"), menuData);
		Gui.contextMenu.el.addClass("");
		Gui.contextMenu.hide();

		Gui.contextMenu.addEventListener(BuildMenu.structureSelected, function(e){

			var request = $.ajax({
				url: host + 'structure/' + e.structure.id + '/citizens/' + e.citizens,
				type: 'GET'
			});

			request.done(function (response, textStatus, jqXHR){
				console.log("SERVER RESPONSE: updated citizens");
			});

			request.fail(function (jqXHR, textStatus, errorThrown){
				console.error(
					"The following error occured: " +
						textStatus, errorThrown
				);
			});
		});
	},

	/** GUIs update loop, gets called from the game loop */
	update: function(){
		var getNumIdleCitizens = function(city) {
			var sum = city.numCitizens;
			city.structures.forEach(function (structure) {
				sum -= structure.numCitizens;
			});
			return sum;
		}

		// See if we have to issue a poll request
		if(Gui.timeLastPoll + Gui.pollInterval < $.now()){
			Gui.timeLastPoll = $.now();

			// POLL THAT MOFO !

			//res.wood += .75;
			//res.stone += .5;
			//res.metal += .25;
			//res.food += 1;

			// This should come from the poll
			Gui.resources.citizens = getNumIdleCitizens(city);

		}


		Gui.updatePlayerResources(Gui.resources);
	},

	/** Gets called from Main whenever a structure in the 3d world is selected
	 * @param structure {Structure} that was selected  */
	structureSelected: function (structure) {
		var structureInfo = Gui.getStructureInfoByTypeId(structure.name);
		if(structureInfo.structureType === "tree")
			return;

		Gui.contextMenu.show(structure);
	},

	/** Gets called from Main whenever a structure in the 3d world is deselected */
	structureUnselected: function () {
		Gui.contextMenu.hide();
	},

	/** Gets called from Main whenever a structure is just constructed */
	structureConstructed: function(structure){
		// Undo 'selected state' of icon in menu
		Gui.buildMenu.unselectStructure();

		var structureInfo = Gui.getStructureInfoByTypeId(structure.name);
		if(structureInfo.structureType === "tree")
			return;

		var structureTypeInfo = this.menuData.structureTypes[structureInfo.structureType];
		var eta = new Date($.now() + structureTypeInfo.buildTime );
		Gui.console.printText("You have started constructing a " + structureInfo.name +
			". Construction will be done on " + $.formatDateTime('mm/dd/y g:ii', eta), null);
		
	},

	/** Gets called whenever the current players resources change. Will update all appropriate Gui elements
	 * @param resources {Object} nameless object containing key-value pairs of resources eg: { wood: 12, metal: 10 }	 */
	updatePlayerResources: function(resources){
		Gui.topbar.setResourceValues(resources);
		Gui.buildMenu.setResourceValues(resources);
	},

	/** Returns true if the structure described by structureType can be afforded, based on resources in param playerResources
	 * @param playerResources {Object} nameless object containing key-value pairs of resources eg: { wood: 12, metal: 10 }
	 * @param structureType {Object} nameless object containing: cost, requirements, buildTime etc
	 * @returns {boolean}	 */
	enoughResources: function (playerResources, structureType) {
		//var cost = ["wood", "stone", "food", "metal"],
		//	reqs = ["knowledge", ""]
		if(!structureType.cost)
			return true;

		if(structureType.cost.wood) {
			if(playerResources.wood < structureType.cost.wood)
				return false;
		}
		if(structureType.cost.stone) {
			if(playerResources.stone < structureType.cost.stone)
				return false;
		}
		if(structureType.cost.food) {
			if(playerResources.food < structureType.cost.food)
				return false;
		}
		if(structureType.cost.metal) {
			if(playerResources.metal < structureType.cost.metal)
				return false;
		}
		if(structureType.requirements.knowledge) {
			if(playerResources.knowledge < structureType.requirements.knowledge)
				return false;
		}
		if(structureType.requirements.culture) {
			if(playerResources.culture < structureType.requirements.culture)
				return false;
		}
		return true;
	},

	/** Returns structure info based on structure type id *
	 * @param id {String} Structure type id, eg: "hele_house"
	 * @returns {Object}	 */
	getStructureInfoByTypeId: function(id){
		for(var e in this.menuData.empires){
			if(!this.menuData.empires.hasOwnProperty(e)) continue;
			for(var s in this.menuData.empires[e].structures){
				if(this.menuData.empires[e].structures[s].structureId == id)
					return this.menuData.empires[e].structures[s];
			}
		}
		return null;
	}
};



function initGui() {
	"use strict";

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
			},{
				name: "Corral",
				structureId: "hele_corral",
				iconCss: "hele_corral",
				structureType: "corral"
			},{
				name: "Market",
				structureId: "hele_market",
				iconCss: "hele_market",
				structureType: "market"
			},{
				name: "Storehouse",
				structureId: "hele_storehouse",
				iconCss: "hele_storehouse",
				structureType: "storehouse"
			},{
				name: "Barracks",
				structureId: "hele_barracks",
				iconCss: "hele_barracks",
				structureType: "barracks"
			},{
				name: "Blacksmith",
				structureId: "hele_blacksmith",
				iconCss: "hele_blacksmith",
				structureType: "blacksmith"
			},{
				name: "Civic center",
				structureId: "hele_civic",
				iconCss: "hele_civic",
				structureType: "civic"
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
			},{
				name: "Temple",
				structureId: "hele_temple",
				iconCss: "hele_temple",
				structureType: "temple"
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
				name: "Market",
				structureId: "rome_market",
				iconCss: "rome_market",
				structureType: "market"
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
			},{
				name: "Civic center",
				structureId: "rome_civic",
				iconCss: "rome_civic",
				structureType: "civic"
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
			},{
				name: "Farm",
				structureId: "kart_farm",
				iconCss: "kart_farm",
				structureType: "house"
			},{
				name: "Corral",
				structureId: "kart_corral",
				iconCss: "kart_corral",
				structureType: "corral"
			},{
				name: "Market",
				structureId: "kart_market",
				iconCss: "kart_market",
				structureType: "market"
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
				structureId: "iber_house",
				iconCss: "iber_house",
				structureType: "house"
			},{
				name: "Farm",
				structureId: "iber_farm",
				iconCss: "iber_farm",
				structureType: "farm"
			},{
				name: "Corral",
				structureId: "iber_corral",
				iconCss: "iber_corral",
				structureType: "corral"
			},{
				name: "Market",
				structureId: "iber_market",
				iconCss: "iber_market",
				structureType: "market"
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
				structureId: "iber_blacksmith",
				iconCss: "iber_blacksmith",
				structureType: "blacksmith"
			},{
				name: "Civic center",
				structureId: "iber_civic",
				iconCss: "iber_civic",
				structureType: "civic"
			},{
				name: "Tower",
				structureId: "iber_tower",
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
				name: "Market",
				structureId: "pers_market",
				iconCss: "pers_market",
				structureType: "market"
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
			tabCss: "tab_gaia",
			structures: [{
				name: "Flag",
				structureId: "flag",
				iconCss: "flag",
				structureType: "flag"
			},{
				name: "Aleppo Pine",
				structureId: "gaia_aleppo_pine",
				iconCss: "gaia_aleppo_pine",
				structureType: "tree"
			}]
		}],

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
				},
				citizenCap: 4
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
				},
				citizenCap: 6
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
				},
				citizenCap: 6
			},
			"market": {
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
				},
				citizenCap: 6
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
				},
				citizenCap: 8
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
				buildTime: 120000,
				citizenCap: 10
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
				},
				citizenCap: 8
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
				},
				citizenCap: 10
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
				},
				citizenCap: 20
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
				},
				citizenCap: 25
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
				},
				citizenCap: 30
			},
			"flag": {
				cost: {
					stone: 0,
					food: 0
				},
				requirements: {
					knowledge: 0,
					culture: 0
				},
				buildTime: 100000
			},
			"tree": {}
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

	Gui.initGui(menuData, topbarData);


	/** Leaderboard*/
	var getRndInt = function(max){
		return Math.floor(Math.random() * max);
	};

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
	};

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
	var leaderboard = new Leaderboard($("body"), data, { animation: "slow"});

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

	var login = new Popup($("body"), { modal: true, noClose: true, noDrag: true });
	login.el.addClass("login");
	login.el.append("<h1>Login</h1>" +
		"<div style='padding: 20px'>" +
			"<label>Username</label><input type='text' id='username'/>" +
		"</div>" +
		"<div style='padding: 20px'>" +
			"<label>Password</label><input type='password' id='password'/>" +
		"</div>" +
		"<div class='button-big' id='login-submit' style='width: 100px; float: right; margin: 30px 20px'><div class='inner'>login</div></div>"
	);

	// Listen to click and ENTER
	$("#login-submit").click(function(){
		submitLogin();
	});
	login.el.keypress(function( event ) {
		if ( event.which == 13 ) { submitLogin(); }
	});

	function submitLogin(){
		var params = {
			name: $("#username").val(),
			password: $("#password").val()
		};
		/*$.post("INSERT_URL_HERE", params)
			.done(function( data ) {
				// if login successful
				login.hide();
		});*/

		// THIS LINE (AND THE LINE UNDER IT)
		login.hide();

	}

	login.center();
	login.show();
	$("#username").focus();
}


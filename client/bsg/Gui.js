"use strict";
// DEFAULT GUI
var Gui = {

	// PROPERTIES
	structurePopup: null,
	resources: {},				// Current players' resources
	topbar: null,				// Top bar menu element
	buildMenu: null,			// Build menu on the left
	contextMenu: null,			// Context menu on the right
	craftingScreen: null,		// Crafting screen popup
	leaderboard: null,			// Leaderboard popup
	questOverview: null,		// Quest overview popup
	console: null,				// Console to display text
	timeLastPoll: $.now(),		// Time of last poll
	pollInterval: 10000,			// Interval of polling (in ms)

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
				currentModel = new ModelWrapper(initFlag(scene, 15, 'images/flag/flag.jpg'));

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
		Gui.topbar = new Topbar($("#topbar"), topbarData);
		Gui.topbar.addEventListener(Topbar.buttonClicked, function(e){
			// Event handler for top buttons
			switch(e.buttonId){
				case 'leaderboard':
					openLeaderboard();
					break;
				case 'help':
					alert("Utopolis [BETA] v0.1\n\n\n" +
						"* Georgi Khomeriki (Computer Science TU Delft)\n" +
						"* Tiago Mota (Computer Science TU Delft)\n" +
						"* Rashmi Narayan (Technology, Policy and Management TU Delft)\n" +
						"* Anika Rose (Technology, Policy and Management TU Delft)\n" +
						"* Wouter van den Heuvel (Media Technology Leiden University)\n" +
						"* Mircea Voda (Computer Science TU Delft)\n" +
						"\n\n" +
						"Teacher: Rafael Bidarra\n" +
						"Commisioned for: Martijn Koops\n" +
						"\n\n\n" +
						"Additional credits \n\n" +
						"* 3d models, textures, music: 0AD wildfire games (CC-BY 3.0)\n" +
						"* skybox image: Spiney CC-BY 3.0"

					);
					break;
				case 'quests':
					Gui.questOverview.toggle();
					break;
				case 'crafting':
					Gui.craftingScreen.toggle();
					break;
                case 'messages':
                    openMessages();
                    break;
				default:
					alert("Not implemented - Sorry");
					break;
			}
		});


		// Initialize right context menu
		Gui.contextMenu = new ContextMenu($("#right_menu"), menuData);
		Gui.contextMenu.el.addClass("");
		Gui.contextMenu.hide();

		Gui.contextMenu.addEventListener(ContextMenu.citizensChanged, function(e){
            if(!clientOnlyMode){
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
			}
        });


		var productData = {
			barley : {
				name: "barley",
				description: "A hardy cereal with coarse bristles, cultivated especially for use in bread and brewing",
				iconCss: "product_barley",
				productionTime: 60000 // 1 minute
			},
			bread: {
				name: "bread",
				description: "A staple food prepared by baking a dough of flour and water. One of the world's oldest foods.",
				iconCss: "product_bread",
				productionTime: 120000, // 2 minutes
				ingredients: [ "flour" ],
				workshop: "farm"
			},
			bronze: {
				name: "bronze",
				description: "Bronze is an alloy consisting primarily of copper, usually with tin as the main additive. It is hard and tough, and it was so significant in antiquity that the Bronze Age was named after the metal.",
				iconCss: "product_bronze",
				productionTime: 300000, // 5 minutes
				ingredients: [ "copper", "copper", "copper", "tin" ],
				workshop: "blacksmith"
			},
			bronze_statue: {
				name: "bronze statue",
				description: "A statue cast in bronze, a mould is made using clay and wax",
				iconCss: "product_bronze_statue",
				productionTime: 900000, // 15 minutes
				ingredients: [ "bronze", "clay", "wax" ],
				workshop: "civic"
			},
			candles: {
				name: "candles",
				description: "A solid block of wax with an embedded wick, which is ignited to provide light and was used as a method of keeping time.",
				iconCss: "product_candles",
				productionTime: 300000, // 5 minutes
				ingredients: [  "wax" ],
				workshop: "civic"
			},
			clay: {
				name: "clay",
				description: "Stiff, sticky fine-grained earth that can be moulded when wet, and is dried and baked to make bricks, pottery, and ceramics.",
				iconCss: "product_clay"
			},
			copper: {
				name: "copper",
				description: "This metal and its alloys have been used for thousands of years. Copper was principally mined on Cyprus, hence the origin of the name of the metal as ?yprium (metal of Cyprus), later shortened to ?uprum",
				iconCss: "product_copper"
			},
			flour: {
				name: "flour",
				description: "Powder obtained by grinding grain, typically wheat, and used to make bread, cakes, and pastry.",
				iconCss: "product_flour",
				productionTime: 10000, // 10 seconds
				ingredients: [ "barley" ],
				workshop: "farm"
			},
			tin: {
				name: "tin",
				description: "This silvery, malleable poor metal is not easily oxidized in air and is used to coat other metals to prevent corrosion.",
				iconCss: "product_tin"
			},
			vase: {
				name: "vase",
				description: "Decorated vase",
				iconCss: "product_vase",
				productionTime: 120000, // 2 minutes
				ingredients: [  "clay", "clay", "wood" ],
				workshop: "civic"
			},
			wax: {
				name: "wax",
				description: "A natural wax produced in the bee hive of honey bees. ",
				iconCss: "product_wax"
			},
			wax_tablet: {
				name: "Wax tablet",
				description: "A tablet made of wood and covered with a layer of wax, used as a reusable writing surface. The phrase 'tabula rasa' (clean slate) originates from erasing wax tablets by heating them",
				iconCss: "product_wax_tablet",
				productionTime: 120000, // 2 minutes
				ingredients: [  "wax", "wood" ],
				workshop: "civic"
			},
			wood: {
				name: "wood",
				description: "Has been used for thousands of years for both fuel and as a construction material.",
				iconCss: "product_wood"
			}
		};
		var craftingData = {
			availableProducts: [
				"flour",
				"bread",
				"bronze",
				"bronze_statue",
				"candles",
				"vase",
				"wax_tablet"
			],
			productData: productData
		};
		Gui.craftingScreen = new CraftingScreen($("body"), craftingData, { animation: "slow"});
		Gui.craftingScreen.addEventListener(CraftingScreen.productCrafted, function(e){
			Gui.console.printText("You just crafted " + e.productInfo.name, null);


			var iconPopup = $('<div class="toaster-icon ' + e.productInfo.iconCss + '"></div>');
			$("body").append(iconPopup);
			iconPopup.css({ bottom: 50, left: 300});
			iconPopup.animate({
				bottom: "-150px"
			}, 500, null, function(){
				$(this).remove();
			} );
		});

        // Message overview
		Gui.messageOverview = new MessageOverview($("body"), []);
		Gui.messageOverview.addEventListener(MessageOverview.sendClicked, function(e){
			sendMessage({ to: e.to, subject: e.subject, message: e.message});
		});
		Gui.messageOverview.addEventListener(MessageOverview.deleteClicked, function(e){
			deleteMessage(e.messageId);
		});



        // Quests
		var questDescriptions = [{
			id: 0,
			title: "Foundation",
			text: "Welcome to Utopolis! As you are now in charge of new city within Utopolis, your citizens need a place to live. \n\n" +
				"Thus, your first quest: Build the first village in your city. A village contains at least 3 houses, a civic center and a farm."
		}, {
			id: 1,
			title: "Boundaries",
			text: "Your second quest is a group quest. This means each city in your province must complete this quest before you can go onto the next quest. \n\n" +
				"Your citizens have started to notice other cities. They feel they need to define their home clearly. Your second quest is to set the boundaries of your “downtown”. This means you will need to build at least 4 wall towers. "
		}, {
			id: 2,
			title: "Nourishment",
			text: "Your citizens are not getting enough food. They are hungry! Give your citizens nourishment. Build at least 3 farms and 2 corrals."
		}, {
			id: 3,
			title: "Rainy Day",
			text: "As your citizens are becoming richer, they are thinking further in the future. They are worried they will not have enough food in the future. Provide your citizens with at least 2 food stores in case of a rainy day (build 2 storehouses)."
		}, {
			id: 4,
			title: "Trading",
			text: "Your citizens are happy in the city, but are starting to hope to see the world. Open the trade routes between your city and the rest of the province. Build at least 2 markets. Give at least one gift to someone else. "
		}];
		Gui.questOverview = new QuestOverview($("body"), {
			description: questDescriptions
		});
		Gui.questOverview.addEventListener(QuestOverview.newQuestCompleted, function(e){
			setTimeout(function(){
				sounds.questCompleted.play();
				Gui.console.printText("You have completed the quest " + e.questDescription.title + "!!", null);
			}, 1500);
		});

		var questStatus = [{
			id: 0,
			completed: true
		}, {
			id: 1,
			completed: true
		}, {
			id: 2,
			completed: false
		}, {
			id: 3,
			completed: false
		}, {
			id: 4,
			completed: false
		}/*, {
			id: 5,
			completed: false
		}, {
			id: 6,
			completed: false
		}*/];
		Gui.questOverview.update(questStatus);

		/** Initiates a leaderboard with parent and given inital data */
		var medalDescriptions = {
			bronze1: "This medal is awarded for completing quest " + questDescriptions[0].title + ".",
			bronze2: "This medal is awarded for completing quest " + questDescriptions[1].title + ".",
			bronze3: "This medal is awarded for completing quest " + questDescriptions[2].title + ".",
			silver1: "This medal is awarded for completing quest " + questDescriptions[3].title + ".",
			silver2: "This medal is awarded for completing quest " + questDescriptions[4].title + "."
		};
		Gui.leaderboard = new Leaderboard($("body"), medalDescriptions, { animation: "slow"});


		// Private functions
		function openLeaderboard(){
			if(!clientOnlyMode){
				if(!Main.city) // global city
					return alert("Something went horribly wrong! :( Please reload the game.");

				// Fire a request to retreive the latest scores
				Gui.leaderboard.ajaxSpinner.show();

				var request = $.ajax({
					url: host + 'province/list',
					type: 'GET'
				});

				request.done(function (response, textStatus, jqXHR){
					var citiesData = [],
						provinceData = [];

					for(var i = 0; i < response.provinces.length; i++){
						var province = response.provinces[i];

						if(province.id == Main.city.provinceId){
							// This city belongs to the same province as the current player
							$.each(province.cities, function(index, city){
								citiesData.push([
									city.name + " (" + city.player.name + ")",
									city.kpi.foreignRelations,
									city.kpi.happiness,
									city.kpi.population,
									city.kpi.technology,
									city.kpi.wealth,
									getMedals(city.medals)
								]);
							});
						}
						provinceData.push([
							province.name + ((province.id == Main.city.provinceId) ? " (your province)" : ""),
							calculateAverage(province.cities, "foreignRelations"),
							calculateAverage(province.cities, "happiness"),
							calculateAverage(province.cities, "population"),
							calculateAverage(province.cities, "technology"),
							calculateAverage(province.cities, "wealth")
						]);
					}

					function calculateAverage(cities, kpi){
						var sum = 0;
						$.each(cities, function(index, city){
							sum += city.kpi[kpi];
						});
						return Math.round(sum / cities.length * 10000) / 10000;
					}

					function getMedals(medals) {
						return {
							bronze1: medals.quest0Completed,
							bronze2: medals.quest1Completed,
							bronze3: medals.quest2Completed,
							silver1: medals.quest3Completed,
							silver2: medals.quest4Completed,
							silver3: medals.quest5Completed/*,
							gold1: medals.quest6Completed,
							gold2: medals.quest7Completed,
							gold3: medals.quest8Completed*/
						};
					};

					Gui.leaderboard.ajaxSpinner.hide();
					Gui.leaderboard.update(citiesData, provinceData);
				});

				request.fail(function (jqXHR, textStatus, errorThrown){
					console.error(
						"The following error occured: " +
							textStatus, errorThrown
					);
				});
			}

			// Already show it, update with new data when it comes back from the server
			Gui.leaderboard.show();
		}

        function openMessages(){
            if(!clientOnlyMode){
				if(!Main.city) // global city
					return alert("Something went horribly wrong! :( Please reload the game.");

				var getInboxData = function(){
					return $.ajax({
						url: host + "message/" + Main.city.player.id + "/list",
						type: 'GET'
					});
				};
				var getPlayerData = function () {
					return $.ajax({
						url: host + "player/list",
						type: 'GET'
					});
				};

				// Send off two requests, one to get the inbox data, the other to get player data
				$.when(getInboxData(), getPlayerData()).done(function(inboxResult, playerResult){
					// Parse inbox data into array that the datatable can read
					var inboxData = [];
					for(var i = 0; i < inboxResult[0].messages.length; i++){
						var msg = inboxResult[0].messages[i];
						inboxData.push([
							(msg.sender || "Unknown sender"),
							(msg.subject || "Empty subject"),
							new Date(msg.entryDate ),
							(null),
							(msg.message || "Empty message"),
							msg.id
							//msg.player.id
						]);
					}

					// Pass player data, used in the send message dialog
					var playerData = [];
					for(var j = 0; j < playerResult[0].players.length; j++){
						var plyr = playerResult[0].players[j];
						// Do not add yourself (duh)
						if(plyr.id == Main.city.player.id) continue;
						playerData.push({
							label: plyr.nick,
							value: plyr.id
						});
					}

					Gui.messageOverview.update(inboxData, playerData);

				});
            }
            Gui.messageOverview.show();
        }

		function sendMessage(msgInfo){
			// Does not validate
			if(msgInfo.to == "")
				return;

			var message = {
				entryDate: new Date(),
				message: msgInfo.message,
				playerId: msgInfo.to.id,
				assignNum: 0,
				subject: msgInfo.subject,
				sender: Main.city.player.nick
			};

			var request = $.ajax({
				url: host + 'message',
				type: 'PUT',
				contentType: 'application/json',
				data: JSON.stringify(message),
				context: message
			});

			request.done(function(response, textStatus, jqXHR){
				Gui.console.printText("Your message is sent to " + msgInfo.to.nick, null);
				Gui.messageOverview.input.el.hide();
				sounds.mailSent.play();

				console.log("SERVER RESPONSE: message sent!");
			});

			request.fail(function ( jqXHR, textStatus, errorThrown ){
				console.error(
					"The following error occured: " +
						textStatus, errorThrown
				);
			});
		}

		/** Deletes message on the server */
		function deleteMessage(messageId){
			var request = $.ajax({
				url: host + 'message/' + messageId,
				type: 'DELETE',
				contentType: 'application/json'
			});

			request.done(function(response, textStatus, jqXHR){
				Gui.console.printText("Message deleted", null);
				sounds.mailSent.play();
			});
		}
	},

	/** GUIs update loop, gets called from the game loop */
	update: function(){
		var getNumIdleCitizens = function() {
			var sum = Main.city.numCitizens;
			structureCollection.forEach(function (structure) {
				sum -= structure.citizens;
			});
			return sum;
		};

		// See if we have to issue a poll request
		if(Gui.timeLastPoll + Gui.pollInterval < $.now()){
			Gui.timeLastPoll = $.now();

			var request = $.ajax({
				url: host + 'poll',
				type: 'PUT',
				contentType: 'application/json',
				data: JSON.stringify(Main.city)
			});

			request.done(function(response, textStatus, jqXHR){
				Main.city = response;
				Gui.updatePlayerResources ( Main.city.resources);

			});

			request.fail(function (jqXHR, textStatus, errorThrown){
				console.error( "****** The following error occured: " +
		        	textStatus, errorThrown
		        );
   		    });

			// This should come from the poll
			Gui.resources.citizens = getNumIdleCitizens();

		}


		Gui.updatePlayerResources(Gui.resources);

		//Gui.questOverview.update();
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

		// test
		var questStatus = [{
			id: 0,
			completed: true
		}, {
			id: 1,
			completed: true
		}, {
			id: 2,
			completed: true
		}, {
			id: 3,
			completed: false
		}, {
			id: 4,
			completed: false
		}];
		Gui.questOverview.update(questStatus);


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
				if(!this.menuData.empires[e].structures.hasOwnProperty(s)) continue;
				if(this.menuData.empires[e].structures[s].structureId == id)
					return this.menuData.empires[e].structures[s];
			}
		}
		return null;
	},

	/** Gets called when all models and graphical assets have been loaded into memory */
	modelsLoaded: function(){
		$("#login-submit").show();
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
		}, {
			name: "Ptolemies",
			tabCss: "tab_ptol",
			structures: [{
				name: "House",
				structureId: "ptol_house",
				iconCss: "ptol_house",
				structureType: "house"
			},{
				name: "Farm",
				structureId: "ptol_farm",
				iconCss: "ptol_farm",
				structureType: "farm"
			},{
				name: "Corral",
				structureId: "ptol_corral",
				iconCss: "ptol_corral",
				structureType: "corral"
			},{
				name: "Market",
				structureId: "ptol_market",
				iconCss: "ptol_market",
				structureType: "market"
			},{
				name: "Storehouse",
				structureId: "ptol_storehouse",
				iconCss: "ptol_storehouse",
				structureType: "storehouse"
			},{
				name: "Barracks",
				structureId: "ptol_barracks",
				iconCss: "ptol_barracks",
				structureType: "barracks"
			},{
				name: "Blacksmith",
				structureId: "ptol_blacksmith",
				iconCss: "ptol_blacksmith",
				structureType: "blacksmith"
			},{
				name: "Civic center",
				structureId: "ptol_civic",
				iconCss: "ptol_civic",
				structureType: "civic"
			},{
				name: "Tower",
				structureId: "ptol_tower",
				iconCss: "ptol_tower",
				structureType: "tower"
			},{
				name: "Fortress",
				structureId: "ptol_fortress",
				iconCss: "ptol_fortress",
				structureType: "fortress"
			},{
				name: "Temple",
				structureId: "ptol_temple",
				iconCss: "ptol_temple",
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
			},{
				name: "European Beech",
				structureId: "gaia_european_beech",
				iconCss: "gaia_european_beech",
				structureType: "tree"
			},{
				name: "Mediterranean Cypress",
				structureId: "gaia_mediterranean_cypress",
				iconCss: "gaia_mediterranean_cypress",
				structureType: "tree"
			},{
				name: "Pine",
				structureId: "gaia_pine",
				iconCss: "gaia_pine",
				structureType: "tree"
			},{
				name: "Poplar",
				structureId: "gaia_poplar",
				iconCss: "gaia_poplar",
				structureType: "tree"
			}]
		}],

		/** Contains definitions for structure types. Note that keys under
		 * 'cost' and 'requirements' refer to keys in the resources collection */
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
					health: 1,
					economy: 1,
					trade: 1
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
					health: 1,
					diplomacy: 1
				},
				citizenCap: 6
			},
			"market": {
				cost: {
					metal: 100,
					stone: 100,
					wood: 1000,
					food: 5000
				},
				requirements: {
					knowledge: 100,
					culture: 250
				},
				buildTime: 30000,
				generates: {
					stone: 8,
					metal: 8,
					wood: 8,
					food: 16,
					knowledge: 10,
					culture: 10,
					diplomacy: 5,
					trade: 5,
					peace: 5
				},
				citizenCap: 6
			},
			"storehouse": {
				cost: {
					wood: 50,
					stone: 50,
					metal: 50,
					food: 100
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
					food: 200
				},
				requirements: {
					knowledge: 40,
					culture: 40
				},
				buildTime: 120000,
				generates: {
					wood: 10,
					metal: 10,
					stone: 10,
					safety: 5,
					peace: 5
				},
				citizenCap: 10
			},
			"blacksmith": {
				cost: {
					wood: 50,
					food: 100,
					metal: 25,
					stone: 25
				},
				requirements: {

				},
				buildTime: 240000,
				generates: {
					knowledge: 5,
					stone: 5,
					safety: 1,
					diplomacy: 1
				},
				citizenCap: 8
			},
			"tower": {
				cost: {
					stone: 25,
					metal: 25,
					food: 50
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
			trade: { name: "Trade", iconCss: "trade"},
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
			name: 'Homeless citizens',
			iconCss: 'citizens',
			formatter: function(val) { return $.format('{0} homeless citizens', val); }
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

	var login = new Popup($("body"), { modal: true, noClose: true, noDrag: true });
	login.el.addClass("login");
	login.el.append("<h1>Login</h1>" +
		"<div style='padding: 20px'>" +
			"<label>Username</label><input type='text' id='username'/>" +
		"</div>" +
		"<div style='padding: 20px'>" +
			"<label>Password</label><input type='password' id='password'/>" +
		"</div>" +
		"<div class='button-big' id='login-submit' style='width: 100px; float: right; margin: 30px 20px' tabindex='0'><div class='inner'>login</div></div>"
	);

	// Show login button when assets have been loaded
	$("#login-submit").hide();
	// Listen to click and ENTER
	$("#login-submit").click(function(){
		submitLogin();
	});
	login.el.keypress(function( event ) {
		if ( event.which == 13 ) { submitLogin(); }
	});

	function submitLogin(){
		var params = {
			nick: $("#username").val(),
			password: $("#password").val()
		};

		var request = $.ajax({
			url: host + 'player/login',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(params)
		});

		request.done(function(response, textStatus, jqXHR){
			if(response == "WRONG_PASSWORD"){
				Gui.console.printText("Wrong username or password!", null);
				sounds.error.play();
			}
			else {
				Gui.console.printText("Login successful! Now entering " + response.name + "...", null);
				Main.city = response;
				Main.startGame();
				login.hide();
			}
		});
		request.fail(function (jqXHR, textStatus, errorThrown){
			console.error(
				"Could not connect to " + host + ". The following error occured: " +
					textStatus, errorThrown
			);
			Main.clientOnlyMode = true;
			Gui.console.printText("Could not connect to server. Playing in client-only mode.", null);
			Main.city = {
				numCitizens: 100,
				structures: []
			}
			Main.startGame();
			login.hide();
		});

	}

	login.center();
	login.show();
	$("#username").focus();
}


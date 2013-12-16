"use strict";
/**
 * @param parent parent element to add popup to
 * @param options Options object, valid
 * 		options are:
 * 	* noDrag (Boolean)
 * 	* noClose (Boolean)
 * @constructor
 */
var ContextMenu = function(parent, data) {
	this.el = $("<div class='contextmenu'></div>");
	$(parent).append(this.el);
	this.data = data;
}

ContextMenu.prototype = {

	// Ctor
	constructor: ContextMenu,

	el: null,
	animation: 0,

	/** Shows this ContextMenu with structure info
	 * @param structure	(Structure) */
	show: function(structure) {
		function citizenFormatter(){
			return $.format('Citizens allocated: {0}', structure.citizens);
		}
		var structureInfo = this.getStructureInfo(structure.name);
		if(structureInfo === null)
			console.log("No structure info found with structureId " + structure.name);
		var structureTypeInfo = this.data.structureTypes[structureInfo.structureType];

		var html = "<h2>" + structureInfo.name + "</h2>" +
			"<div class='structureicon " + structureInfo.iconCss + "'></div>" +
			"<span id='citizencounter'>" + citizenFormatter() + "</span>" +
			"<div id='structureslider'></div>";

		this.el.html(html);

		$( "#structureslider" ).slider({
			value: structure.citizens,
			min: 0,
			max: structureTypeInfo.citizenCap,
			step: 1,
			slide: function( event, ui ) {
				structure.citizens = ui.value;
				$( "#citizencounter" ).html(citizenFormatter());
			}
		});
		this.el.show();
	},

	/** Hides this ContextMenu */
	hide: function(){
		this.el.hide();
	},

	/** Toggles visibility */
	toggle: function(){
		this.el.toggle();
	},

	/** Returns true if this ContextMenu is visible */
	isVisible: function(){
		return this.el.is(':visible');
	},

	/** Returns structure type info by structureId
 	 * @param structureId (String) for example: hele_house */
 	getStructureInfo: function(structureId){
		for(var e = 0; e < this.data.empires.length; e++){
			for(var s = 0; s < this.data.empires[e].structures.length; s++){
				if(this.data.empires[e].structures[s].structureId == structureId)
					return this.data.empires[e].structures[s];
			}
		}
	}
}


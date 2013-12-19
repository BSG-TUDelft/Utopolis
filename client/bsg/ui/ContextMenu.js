"use strict";
/**
 * @param parent parent element to add popup to
 * @param data
 * @constructor
 */
var ContextMenu = function (parent, data) {
	this.el = $("<div class='contextmenu'></div>");
	$(parent).append(this.el);
	this.data = data;
};

ContextMenu.prototype = {

	// Ctor
	constructor: ContextMenu,

	el: null,
	animation: 0,

	/** Shows this ContextMenu with structure info
	 * @param structure    {Structure} */
	show: function (structure) {
		function citizenFormatter() {
			return $.format('Citizens allocated: {0}/{1}', structure.citizens, structureTypeInfo.citizenCap);
		}

		var structureInfo = this.getStructureInfo(structure.name);
		if (structureInfo === null)
			console.log("No structure info found with structureId " + structure.name);
		var structureTypeInfo = this.data.structureTypes[structureInfo.structureType];

		// Play selected sound
		var sound = sounds.selected[structureInfo.structureType];
		if(sound) sound.play();

		var html = ["<h2>" + structureInfo.name + "</h2>",
			"<div class='structureicon " + structureInfo.iconCss + "'></div>",
			"<span id='citizencounter'>" + citizenFormatter() + "</span>",
			"<div id='structureslider'></div>",
			"<h3>Generates (every X time): </h3>",
			"<ul class='generates'>",
			"</div>",
			"</ul>"];

		this.el.html(html);
		this.updateRevenue(structureTypeInfo, structure);

		$("#structureslider").slider({
			value: structure.citizens,
			min: 0,
			max: structureTypeInfo.citizenCap,
			step: 1,
			slide: $.proxy(function (event, ui) {
				structure.citizens = ui.value;
				this.updateRevenue(structureTypeInfo, structure);
				$("#citizencounter").html(citizenFormatter());
			}, this)
		});
		this.el.show();
	},

	/** Hides this ContextMenu */
	hide: function () {
		this.el.hide();
	},

	/** Toggles visibility */
	toggle: function () {
		this.el.toggle();
	},

	/** Returns true if this ContextMenu is visible */
	isVisible: function () {
		return this.el.is(':visible');
	},

	/** Returns structure type info by structureId
	 * @param structureId (String) for example: hele_house */
	getStructureInfo: function (structureId) {
		for (var e = 0; e < this.data.empires.length; e++) {
			for (var s = 0; s < this.data.empires[e].structures.length; s++) {
				if (this.data.empires[e].structures[s].structureId == structureId)
					return this.data.empires[e].structures[s];
			}
		}
		return null;
	},

	/** Updates the list of expected revenue by the selected building */
	updateRevenue: function (structureType, structure) {
		// Add revenue
		var html = [];
		for (var i in structureType.generates) {
			if (!structureType.generates.hasOwnProperty(i)) continue;

			html.push("<li class='" + this.data.resources[i].iconCss + "' >",
				this.data.resources[i].name + ": <span>",
				structureType.generates[i] * structure.citizens,
				"</span></li>");
		}
		this.el.find(".generates").html(html.join(''));
	}
};


var Menu = function(menuData) {
	this.data = menuData;
}
Menu.prototype = {

	// Ctor
	constructor: Menu,

	data: {},
	popup: null,					// Info popup
	iconsUp: 0,						// Amount of icons we have scrolled up so far
	iconsCount: 0,					// Total number of icons
	minStructureIconVisible: 3, 	// Minimum amount of structure icons to be visible at all times (cannot scroll futher up than this)
	resources: {},					//
	currentInfo: null,				// Structure info defintion of structure that's currently examined

	// Public events
	structureSelected: "STRUCTURE_SELECTED",

	// Public methods
	/** Initiates the menu */
	init : function() {

		this.initTabStrip();
		this.initStructureIcons();
		this.initInfoPopup();
	},

	// Private
	/** Initiates tab strip with categories (empires) */
	initTabStrip : function (){
		for(var i in this.data.empires){
			var li = $("" +
				"<li class='" +  this.data.empires[i].tabCss + "'  title='" +  this.data.empires[i].name + "' >" +
				"<div class='top'></div>" +
				"<div class='middle'><div class='icon'></div></div>"+
				"<div class='bottom'></div>" +
				"</li>");

			li.click($.proxy(this.selectTab, this, i));

			$("#tabstrip").append(li);
		}

		this.selectTab(0);
	},

	initInfoPopup: function() {
		// Info popup
		this.popup = new Popup($("body"), { noClose: true, noDrag: true, animation: 0});
		this.popup.el.addClass("structure_infobox");
		this.popup.hide();
	},

	/** Selects a tab by its index */
	selectTab : function(tabIndex){
		// Display visual style of selected tab
		$("#tabstrip li").each(function(index, el){
			if(index == tabIndex)
				$(el).addClass("selected");
			else
				$(el).removeClass("selected");
		});

		var topOffset = 10;
		$(document).on('mousemove', $.proxy(function(e){
			if(!this.popup)
				return;
			if(e.pageY + this.popup.el.height() + topOffset * 4 < $(window).height()){
				// Lock tooltip in place if lower than threshold
				this.popup.el.css({
					left:  200,
					top: e.pageY + topOffset
				});
			}
			else {
				this.popup.el.css({
					left:  200,
					top:   $(window).height() - (this.popup.el.height() + topOffset * 4)
				});
			}
		}, this));


		// Show structure icons
		$("#structures").empty();
		for(var i in  this.data.empires[tabIndex].structures){
			var li = $("" +
				"<li>" +
				"<div title='" +  this.data.empires[tabIndex].structures[i].name + "' class='" +  this.data.empires[tabIndex].structures[i].iconCss + "'></div>" +
				"</li>");
			li.click($.proxy( this.structureClick, this, li, this.data.empires[tabIndex].structures[i]));

			$("#structures").append(li);
			li.mouseout($.proxy(hideInfo, this));
			li.mouseover($.proxy(showInfo, this, this.data.empires[tabIndex].structures[i]));
		}

		// Show info popup
		function showInfo(structureInfo){
			if(structureInfo.structureType == null)
				return;
			this.currentInfo = structureInfo;
			this.updatePopup(structureInfo);
			this.popup.show();
		}

		function hideInfo(){
			this.popup.hide();
		}
		this.currentInfo = null;

		// Scrolling
		this.iconsUp = 0;
		this.iconsUp = 0;
		if( this.data.empires[tabIndex].structures != null)
			this.iconsCount =  this.data.empires[tabIndex].structures.length;
		this.calculateStructuresScroll();

	},

	/** Initiates the scrollable structure icons region */
	initStructureIcons : function(){
		this.calculateStructuresScroll();

		// Event handlers
		$("#structures_scroll_up div.arrow").click($.proxy(function(){
			if(!this.onFirstStructurePage())
				this.iconsUp--;
			this.calculateStructuresScroll();
		}, this));
		$("#structures_scroll_down div.arrow").click($.proxy(function(){
			if(!this.onLastStructurePage())
				this.iconsUp++;
			this.calculateStructuresScroll();
		}, this));
	},

	/** Updates the players resources, used in the info popup */
	setResourceValues: function(data){
		this.resources = data;

		if(this.popup && this.currentInfo){
			this.updatePopup(this.currentInfo);
		}
	},

	/** Fires when the li element of a structure is clicked */
	structureClick: function(li, structure){
		$("#structures li").removeClass("selected");
		if(structure.structureId == this.selectedStructureId){
			this.selectedStructureId = null;
			this.dispatchEvent( { type: Menu.structureSelected, structure: null } );
		}
		else {
			li.addClass("selected");
			this.selectedStructureId = structure.structureId;
			this.dispatchEvent( { type: Menu.structureSelected, structure: structure } );
		}
	},

	/** Calculates scrolling for structures  */
	calculateStructuresScroll: function(){
		var topMargin = 10;	// soo ugly :(
		var iconSize = 125; // soo ugly :(
		var scroll = iconSize * this.iconsUp;

		$("#structures").css("top", -scroll + topMargin);

		// Hide arrows if necessary
		if( this.onFirstStructurePage())
			$("#structures_scroll_up").hide();
		else
			$("#structures_scroll_up").show();

		if( this.onLastStructurePage())
			$("#structures_scroll_down").hide();
		else
			$("#structures_scroll_down").show();
	},

	/** */
	updatePopup: function(structureInfo) {
		var structureType = this.data.structureTypes[structureInfo.structureType];
		var html = ["" +
			"<h2>" + structureInfo.name + "</h2>" +
			"<ul class='resources'>" +
			"<li class='time'>Time: <span>" + msToTime(structureType.buildTime) + "</span> </li>"];

		// Add costs
		for(var i in structureType.cost){
			var insufficient = (this.resources[i] && this.resources[i] < structureType.cost[i]) ? 'insufficient ' : '';
			html.push("<li class='" + insufficient + this.data.resources[i].iconCss + "'>" + this.data.resources[i].name + ": <span>" + structureType.cost[i] + "</span></li>")
		}
		html.push("</ul>" +
			"<ul class='requirements'>");

		// Add requirements
		for(var i in structureType.requirements){
			html.push("<li class='" + this.data.resources[i].iconCss + "'>" + this.data.resources[i].name + ": <span>" + structureType.requirements[i] + "</span></li>")
		}

		html.push("</ul>")
		this.popup.el.html(html.join(""));

		function msToTime(s) {
			var ms = s % 1000;
			s = (s - ms) / 1000;
			var secs = s % 60;
			s = (s - secs) / 60;
			var mins = s % 60;
			var hrs = (s - mins) / 60;

			var res = [];
			if(hrs >  0)
				res.push(hrs + " hrs");
			if(mins > 0)
				res.push(mins + " mins");
			if(secs > 0)
				res.push(secs + " secs");
			return res.join(",");
		}
	},

	/** True if we're on the first page of structures */
	onFirstStructurePage: function(){
		return this.iconsUp == 0;
	},

	/** True if we're on the last page of structures */
	onLastStructurePage: function(){
		return this.iconsCount == 0 || this.iconsUp == this.iconsCount - this.minStructureIconVisible;
	}
};
THREE.EventDispatcher.prototype.apply( Menu.prototype );

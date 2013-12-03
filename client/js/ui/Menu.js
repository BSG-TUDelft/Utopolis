var Menu = function(menuData) {
	this.data = menuData;
}
Menu.prototype = {

	// Ctor
	constructor: Menu,

	data: {},

	iconsUp: 0,						// Amount of icons we have scrolled up so far
	iconsCount: 0,					// Total number of icons
	minStructureIconVisible: 3, 	// Minimum amount of structure icons to be visible at all times (cannot scroll futher up than this)

	// Public events
	structureSelected: "STRUCTURE_SELECTED",

	// Public methods
	/** Initiates the menu */
	init : function() {

		this.initTabStrip();
		this.initStructureIcons();

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

			li.click(jQuery.proxy(this.selectTab, this, i));

			$("#tabstrip").append(li);
		}

		this.selectTab(0);
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

		// Show structure icons
		$("#structures").empty();
		for(var i in  this.data.empires[tabIndex].structures){
			var li = $("" +
				"<li>" +
				"<div title='" +  this.data.empires[tabIndex].structures[i].name + "' class='" +  this.data.empires[tabIndex].structures[i].iconCss + "'></div>" +
				"</li>");
			li.click($.proxy( this.structureClick, this,  this.data.empires[tabIndex].structures[i]));
			$("#structures").append(li);
		}

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

	/** Fires when the li element of a structure is clicked */
	structureClick: function(structure){
		this.dispatchEvent( { type: Menu.structureSelected, structure: structure } );
	},

	/** Calculates scrolling for structures  */
	calculateStructuresScroll: function(){
		var topMargin = 10;	// soo ugly :(
		var iconSize = 125; // soo ugly :(
		var scroll = iconSize * this.iconsUp;

		$("#structures").css("margin-top", -scroll + topMargin);

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

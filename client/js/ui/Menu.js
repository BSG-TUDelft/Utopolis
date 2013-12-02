var Menu = function(menuData) {
	var data = menuData;
	var iconsUp = 0;					// Amount of icons we have scrolled up so far
	var iconsCount = 0;					// Total number of icons
	var minStructureIconVisible = 3 ;	// Minimum amount of structure icons to be visible at all times (cannot scroll futher up than this)

	// Public
	/** Initiates the menu */
	this.init = function() {

		initTabStrip();
		initStructureIcons();

	};

	// Private
	/** Initiates tab strip with categories (empires) */
	function initTabStrip(){
		for(var i in data.empires){
			var li = $("" +
				"<li class='" + data.empires[i].tabCss + "'  title='" + data.empires[i].name + "' >" +
				"<div class='top'></div>" +
				"<div class='middle'><div class='icon'></div></div>"+
				"<div class='bottom'></div>" +
				"</li>");
			li.click(function(index) {
				return function() {
					selectTab(index); }
			}(i)

			);
			$("#tabstrip").append(li);
		}

		selectTab(0);
	}

	/** Selects a tab by its index */
	function selectTab(tabIndex){
		// Display visual style of selected tab
		$("#tabstrip li").each(function(index, el){
			if(index == tabIndex)
				$(el).addClass("selected");
			else
				$(el).removeClass("selected");
		});

		// Show structure icons
		$("#structures").empty();
		for(var i in data.empires[tabIndex].structures){
			var li = $("" +
				"<li>" +
				"<div title='" + data.empires[tabIndex].structures[i].name + "' class='" + data.empires[tabIndex].structures[i].iconCss + "'></div>" +
				"</li>");
			$("#structures").append(li);
		}

		// Scrolling
		iconsUp = 0;
		if(data.empires[tabIndex].structures != null)
			iconsCount = data.empires[tabIndex].structures.length;
		calculateStructuresScroll();

	}

	/** Initiates the scrollable structure icons region */
	function initStructureIcons(){
		calculateStructuresScroll();

		// Event handlers
		$("#structures_scroll_up div.arrow").click(function(){
			if(!onFirstStructurePage())
				iconsUp--;
			calculateStructuresScroll();
		});
		$("#structures_scroll_down div.arrow").click(function(){
			if(!onLastStructurePage())
				iconsUp++;
			calculateStructuresScroll();
		});
	}

	/** Calculates scrolling for structures  */
	function calculateStructuresScroll(){
		var topMargin = 10;	// soo ugly :(
		var iconSize = 125; // soo ugly :(
		var scroll = iconSize * iconsUp;

		$("#structures").css("margin-top", -scroll + topMargin);

		// Hide arrows if necessary
		if(onFirstStructurePage())
			$("#structures_scroll_up").hide();
		else
			$("#structures_scroll_up").show();

		if(onLastStructurePage())
			$("#structures_scroll_down").hide();
		else
			$("#structures_scroll_down").show();
	}

	/** True if we're on the first page of structures */
	function onFirstStructurePage(){
		return iconsUp == 0;
	}

	/** True if we're on the last page of structures */
	function onLastStructurePage(){
		return iconsCount == 0 || iconsUp == iconsCount - minStructureIconVisible;
	}
};
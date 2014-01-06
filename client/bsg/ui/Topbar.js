"use strict";

/** Gui element at the top */
var Topbar = function (parent, topbarData) {
	this.data = topbarData;

	this.el = $("" +
		"<div class='inner'>" +
			"<ul class='menu-buttons'></ul>" +
			"<ul class='resources'></ul>" +
		"</div>");

	this.el.find(".menu-buttons").append("<li button-id='settings' class='disabled'>[Settings]</li>");
	this.el.find(".menu-buttons").append("<li button-id='quests'>[Quests]</li>");
	this.el.find(".menu-buttons").append("<li button-id='crafting' class='disabled'>[Crafting]</li>");
	this.el.find(".menu-buttons").append("<li button-id='auctionhouse' class='disabled'>[Auction House]</li>");
	this.el.find(".menu-buttons").append("<li button-id='leaderboard'>[Leaderboard]</li>");
	this.el.find(".menu-buttons").append("<li button-id='messages' class='disabled'>[Messages]</li>");
	this.el.find(".menu-buttons").append("<li button-id='help'>[Help]</li>");

	this.el.find("li").click($.proxy(onButtonClick, this));

	$(parent).append(this.el);

	// Private
	/** Fires when the user clicked on a button, propagates Topbar.buttonClicked with argument buttonId*/
	function onButtonClick(event){
		var buttonId = event.target.attributes["button-id"].value;
		this.dispatchEvent( { type: Topbar.buttonClicked, buttonId: buttonId } );
	}

	this.initResources();

};

// Static
Topbar.buttonClicked = "BUTTON_CLICKED";

Topbar.prototype = {

	// Ctor
	constructor: Topbar,

	data: {},
	resources: {},
	el: null,

	// Public methods
	/** Updates the resource indication area
	 * @param resources	 object containing key-value pairs. The keys should correspond to resourceId property of resources object in topbarData constructor param */
	setResourceValues: function(resources){
		for(var i in resources){
			if(!resources.hasOwnProperty(i)) continue;
			if(this.resources[i] != null){
				this.resources[i].value = resources[i];
			}
		}
		this.update();
	},


	// Private methods

	/** Initializes resource indication area */
	initResources: function(){
		for(var i in this.data.resources){
			if(!this.data.resources.hasOwnProperty(i)) continue;

			var li = $("" +
				"<li class='" +  this.data.resources[i].iconCss + "' >" +
				"</li>");

			this.resources[this.data.resources[i].resourceId] = {
				name:  this.data.resources[i].name,
				elem: li,
				value: 0,
				formatter: this.data.resources[i].formatter
			};

			this.el.find(".resources").append(li);
		}
		this.update();

	},

	/** Visually updates the resources */
	update: function(){
		for(var i in this.resources){
			if(!this.resources.hasOwnProperty(i)) continue;

			// If formatter value is present, execute it to retrieve the formatted value
			var displayValue = typeof(this.resources[i].formatter == 'function') ? this.resources[i].formatter(this.resources[i].value) : this.resources[i].value;

			// Update value
			this.resources[i].elem.html(displayValue);

			// Update tooltips
			this.resources[i].elem.prop('title', this.resources[i].name + ": " + Math.floor(this.resources[i].value));
		}
	}
};
THREE.EventDispatcher.prototype.apply( Topbar.prototype );

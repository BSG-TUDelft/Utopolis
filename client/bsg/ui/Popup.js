"use strict";
/**
 * @param parent parent element to add popup to
 * @param config Options object, valid
 * 		options are:
 * 	* noDrag {Boolean}
 * 	* noClose {Boolean}
 * 	* modal {Boolean}
 * @constructor
 */
var Popup = function (parent, config) {
	this.el = $("<div class='popup'></div>");
	this.parent = parent;
	$(parent).append(this.el);

	this.config = config || {};

	if(this.config.animation != null){
		this.animation = this.config.animation;
	}

	if(this.config.noDrag !== true){
		this.el.draggable({ containment: "window" });
	}

	if(this.config.noClose !== true){
		var closeButton = $("<div class='close_button'></div>");
		closeButton.click($.proxy(this.hide, this));
		this.el.append(closeButton);
	}

	if(this.config.arrowLeft === true){
		this.arrowLeft = $("<div class='arrow_left'></div>");
		this.el.append(this.arrowLeft);
	}

	if(this.config.modal === true){
		this.modalBlock = $("<div class='modalBlock'></div>");
		this.modalBlock.insertBefore(this.el);
	}

	if(this.config.tabs && this.config.tabs instanceof Array){
		this.tabstrip = $('<ul class="strip"></ul>"');
		this.tabcontent = $('<div></div>');
		for(var i = 0; i < this.config.tabs.length; i++){
			var li = $('<li><div class="text">' + this.config.tabs[i].text + '</div></li>');

			if(i == this.activeTabIndex){
				li.addClass("active");
				this.config.tabs[i].content.show();
			}
			else
				this.config.tabs[i].content.hide();


			li.click($.proxy(tabClick, this, i));
			this.tabstrip.append(li);
		}
		var wrapper = $('<div class="horizontal_tabstrip"></div>)');
		wrapper.append(this.tabstrip);

		this.el.append(this.tabcontent);
		this.el.append(wrapper);
	}

	// Private
	function tabClick(index, event){
		this.setActiveTab(index);
	}
}

Popup.prototype = {

	// Ctor
	constructor: Popup,

	el: null,
	animation: 0,
	tabstrip: null,
	activeTabIndex: 0,

	/** Positions this popup in the center of the window (viewport) */
	center: function () {
		this.el.position({ my: "center center", of: $(window)});
	},

	/** Shows this popup */
	show: function () {
		this.el.show();
		if(this.config.modal === true){
			this.modalBlock.show();
		}
	},

	/** Hides this popup */
	hide: function () {
		this.el.hide(this.animation);
		if(this.config.modal === true){
			this.modalBlock.fadeOut(this.animation);
		}
	},

	/** Toggles visibility */
	toggle: function () {
		this.bringToFront();
		this.el.toggle(this.animation);
	},

	/** Returns true if this popup is visible */
	isVisible: function () {
		return this.el.is(':visible');
	},

	/** Makes this popup the last element in it's container (i.e bring visually to front) */
	bringToFront: function(){
		$(this.parent).append(this.el);
	},

	/** Sets the active tab to be that of tabIndex
	 * @param tabIndex	{Number} index of tab to be the new active tab */
	setActiveTab: function(tabIndex){
		this.activeTabIndex = tabIndex;

		this.dispatchEvent( { type: Popup.tabChanged, tabIndex: tabIndex } );

		// Adjust tab appearance
		this.tabstrip.find("li").each(function(index, el){
			if(index == tabIndex)
				$(el).addClass("active");
			else
				$(el).removeClass("active");
		});

		// Set content
		for(var i = 0; i < this.config.tabs.length; i++){
			if(i == this.activeTabIndex){
				this.config.tabs[i].content.show();
			}
			else {
				this.config.tabs[i].content.hide();
			}

		}

	}
};
Popup.tabChanged = "TAB_CHANGED";
THREE.EventDispatcher.prototype.apply( Popup.prototype );



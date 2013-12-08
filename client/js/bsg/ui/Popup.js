var Popup = function(parent) {
	this.el = $("<div class='popup'></div>");
	$(parent).append(this.el);
	this.el.draggable({ containment: "window" });
	this.el.resizable();



	var closeButton = $("<div class='close_button'></div>");
	closeButton.click($.proxy(this.hide, this));
	this.el.append(closeButton);
}

Popup.prototype = {

	// Ctor
	constructor: Popup,

	el: null,

	/** Positions this popup in the center of the window (viewport) */
	center: function(){
		this.el.position({ my: "center center", of: $(window)});
	},

	/** Shows this popup */
	show: function() {
		this.center();
		this.el.show();
	},

	/** Hides this popup */
	hide: function(){
		this.el.hide("slow");
	},

	/** Toggles visibility */
	toggle: function(){
		this.el.toggle( "slow" );
	},

	/** Returns true if this popup is visible */
	isVisible: function(){
		return this.el.is(':visible');
	}
}


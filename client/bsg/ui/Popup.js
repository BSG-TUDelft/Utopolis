/**
 * @param parent parent element to add popup to
 * @param options Options object, valid
 * 		options are:
 * 	* noDrag {Boolean}
 * 	* noClose {Boolean}
 * 	* modal {Boolean}
 * @constructor
 */
var Popup = function(parent, options) {
	this.el = $("<div class='popup'></div>");
	$(parent).append(this.el);

	this.options = options || {};

	if(this.options.animation != null){
		this.animation = this.options.animation;
	}

	if(this.options.noDrag !== true){
		this.el.draggable({ containment: "window" });
	}

	if(this.options.noClose !== true){
		var closeButton = $("<div class='close_button'></div>");
		closeButton.click($.proxy(this.hide, this));
		this.el.append(closeButton);
	}

	if(this.options.arrowLeft === true){
		this.arrowLeft = $("<div class='arrow_left'></div>");
		this.el.append(this.arrowLeft);
	}

	if(this.options.modal === true){
		this.modalBlock = $("<div class='modalBlock'></div>");
		this.modalBlock.insertBefore(this.el);
	}


}

Popup.prototype = {

	// Ctor
	constructor: Popup,

	el: null,
	animation: "slow",

	/** Positions this popup in the center of the window (viewport) */
	center: function(){
		this.el.position({ my: "center center", of: $(window)});
	},

	/** Shows this popup */
	show: function() {
		this.el.show();
	},

	/** Hides this popup */
	hide: function(){
		this.el.hide(this.animation);
		if(this.options.modal === true){
			this.modalBlock.fadeOut(this.animation);
		}
	},

	/** Toggles visibility */
	toggle: function(){
		this.el.toggle(this.animation);
	},

	/** Returns true if this popup is visible */
	isVisible: function(){
		return this.el.is(':visible');
	}
}


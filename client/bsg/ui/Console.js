"use strict";

/** Output only console */
var Console = function (parent) {
	this.el = $("<div class='console'><ul class='output'></ul></div>");
	$(parent).append(this.el);
};

Console.prototype = {

	// Ctor
	constructor: Console,


	/** Prints a line of text in the console
	 * @param text {String} To display in the console
	 * @param timeOut {Number} Optional timeout time in ms. Defaults to 10000. Negative value means no fading (not recommended)
	 * @returns {element} of the newly created text
	 */
	printText: function(text, timeOut){
		timeOut = timeOut || 5000;
		var li = $("<li>" + text+  "</li>");

		this.el.find(".output").append(li);

		function fadeOut(){} {
			li
		}

		if(timeOut > 0){
			li.delay(timeOut).fadeOut({duration: 5000, complete: function() {
				li.remove();
				li = null;	// garbage collection, not sure if needed
			}});
		}

		return li;
	}
};

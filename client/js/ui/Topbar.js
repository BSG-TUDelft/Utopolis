var Topbar = function(topbarData) {
	this.data = topbarData;
}
Topbar.prototype = {

	// Ctor
	constructor: Topbar,

	data: {},
	resources: {},

	// Public methods
	/** Initializes the toolbar */
	init : function() {

		this.initResources();
	},


	/** Updates the resource indication area
	 * @param resources	 object containing key-value pairs. The keys should correspond to resourceId property of resources object in topbarData constructor param */
	setResourceValues: function(newResources){
		for(var i in newResources){
			if(this.resources[i] != null){
				this.resources[i].value = newResources[i];
			}
		}
		this.update();
	},


	// Private methods

	/** Initializes resource indication area */
	initResources: function(){
		for(var i in this.data.resources){
			var li = $("" +
				"<li class='" +  this.data.resources[i].iconCss + "' >" +
				"</li>");

			this.resources[this.data.resources[i].resourceId] = {
				name:  this.data.resources[i].name,
				elem: li,
				value: 0
			};
			$("#resources").append(li);
		}
		this.update();
	},

	/** Visually updates */
	update: function(){
		for(var i in this.resources){
			// Update value (round down)
			this.resources[i].elem.html(Math.floor(this.resources[i].value));
			// Update tooltips
			this.resources[i].elem.prop('title', this.resources[i].name + ": " + Math.floor(this.resources[i].value));
		}
	}


}

ModelArray = function () {
	this.objects = []; 
}

ModelArray.prototype = {

	constructor: ModelArray,
	
	add: function ( object ) {
		this.objects.push(object);
	},

	get: function(index){
		return this.objects[index];
	}
}



ModelArray = function () {
	this.objects = []; 
}

ModelArray.prototype = {

	constructor: ModelArray,
	
	add: function ( object ) {
		this.objects.push(object);
	}
}


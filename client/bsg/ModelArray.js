
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
	},

	/** Iterator implementation
	 * @param fn {Function} function to execute for each element. Will be called with
	 * 	value {any} current iteratation value
	 * 	i {int} index
	 * 	objects {Array} entire array
	 * @param context (optional) Context in which the function was called */
	forEach: function(fn, context){
		for (var i = 0; i < this.objects.length; i++) {
			fn.call(context, this.objects[i], i, this.objects);
		}
	},

	/** Finds a structure by it's world model
	 * @param mesh {THREE.Mesh} model
	 * @returns {Structure} whose model property corresponds to given mesh	 */
	findByMesh: function(mesh){
		for(var i = 0; i < this.objects.length; i++){
			if(this.objects[i].model === mesh)
				return this.objects[i];
		}
	}
}


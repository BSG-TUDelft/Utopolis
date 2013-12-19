
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


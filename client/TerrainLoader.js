TerrainLoader = function () {
}

TerrainLoader.prototype.loader = new THREE.ColladaLoader();
TerrainLoader.prototype.loader.options.convertUpAxis = true;

TerrainLoader.prototype.load = function () {
	this.loader.load( './art/textures/terrain/types/terrain-grass.dae', function ( collada ) {  	
		
		dae = collada.scene;
  		removeLights(dae);
   		dae.scale.x = dae.scale.y = dae.scale.z = 10;
   		dae.updateMatrix();
   		floor = new ModelWrapper(dae);
		var floorSize = floor.getBoundingBox().size();
		floor.geometry = floor.getMesh().geometry;
		floor.geometry.width = floorSize.x;
		floor.geometry.height = floorSize.z;
		scene.add(floor);
	});
}
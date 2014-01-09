TerrainLoader = function () {
}

TerrainLoader.prototype.loader = new THREE.ColladaLoader();
TerrainLoader.prototype.loader.options.convertUpAxis = true;

TerrainLoader.prototype.load = function () {
	this.loader.load( "./art/meshes/gaia/terrain-grass.dae", function ( collada ) {
		
		var dae = collada.scene;
  		removeLights(dae);
   		dae.scale.x = dae.scale.y = dae.scale.z = 10;
   		dae.updateMatrix();
   		floor = new ModelWrapper(dae);

		var texture = THREE.ImageUtils.loadTexture('./art/textures/terrain/types/grass1.png');
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		var material = new THREE.MeshBasicMaterial({map: texture});

		setMaterial(dae, material);
		removeLights(dae);

		var floorSize = floor.getBoundingBox().size();
		floor.geometry = floor.getMesh().geometry;
		floor.geometry.width = floorSize.x;
		floor.geometry.height = floorSize.z;
		onTerrainLoad();

		/** Recursively set material on children */
		function setMaterial(node, material) {
			node.material = material;
			if (node.children) {
				for (var i = 0; i < node.children.length; i++) {
					setMaterial(node.children[i], material);
				}
			}
		}

		/** If the mesh contains instances of THREE.Light, remove them */
		function removeLights(mesh) {
			if (mesh.children) {
				for (var j = 0; j < mesh.children.length; j++) {
					var child = mesh.children[j];
					if (child instanceof THREE.Light) {
						mesh.children.splice(j, 1);
					}
				}
			}
		}
	});
}
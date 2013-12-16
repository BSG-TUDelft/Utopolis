"use strict";
var Skybox = {

	get: function(urls) {
		var cubemap = THREE.ImageUtils.loadTextureCube(urls);
		 // load textures
		cubemap.format = THREE.RGBFormat;

		var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
		shader.uniforms['tCube'].value = cubemap; // apply textures to shader

		// create shader material
		var skyBoxMaterial = new THREE.ShaderMaterial( {
			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: shader.uniforms,
			depthWrite: false,
			side: THREE.BackSide
		});

		// create skybox mesh
		var skybox = new THREE.Mesh(
			new THREE.CubeGeometry(1000, 1000, 1000),
			skyBoxMaterial
		);

		return skybox;
	}
}
var base_height = 1;
var _size;
var scale_v;
var group;

function initFlag(size, texture_uri) {
	_size = size;
	scale_v = (size*(3/2)) / 13;

	/*material*/
	var cloth_material = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture(texture_uri), morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, side: THREE.DoubleSide});
	var material = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture("images/flag/wood.jpg")});
	/*base*/

	var base = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, base_height, 50, 50, false), material);

	/*pole*/
	var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, size, 50, 50, false), material);


	//Pole construction
	base.position.y = 0;
	pole.position.y = base_height + size/2 + base.position.y ;
	group = new THREE.Object3D();
	group.add(base);
	group.add(pole);
	/*scene.add(base);
	scene.add(pole);*/
	

	/*cloth*/
	var loader = new THREE.JSONLoader();

	loader.load( "bsg/flag_model.js", function( geometry ) {
	
		geometry.computeMorphNormals();

		var meshAnim = new THREE.MorphAnimMesh( geometry, cloth_material );

		meshAnim.duration = 300;
		//meshAnim.scale.set( 0.008, 0.008, 0.008 );

		var flag = meshAnim;
		var pos = base_height + Math.floor(size * 0.90) + base.position.y;
		flag.position.y = pos;
		flag.position.z = pole.position.z-(1.7 * scale_v);
		flag.scale.set(scale_v, scale_v, scale_v);
		group.add(flag);
		//group.position.set(2,5,2);
		//scene.add( group );
		
	} );
	flag_placed = true;
	handling_flag = true;
	return group;
}

function updateFlag(delta){
	if(group)
		if(group.children[2]){
			group.children[2].updateAnimation( 50 * delta );
		}
}

function getFlag(){
	if(group)
		return group.children[2];
	else
		return null;
}
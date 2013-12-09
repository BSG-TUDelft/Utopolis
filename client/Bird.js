var Bird = function(object, position){
	this.obj = object;

	if(position == null)
		this.position = this.generatePos();
	else
		this.position = position;
	this.obj.position = this.position;
}

Bird.prototype = {
	constructor: Bird,


	position: new THREE.Vector3( 0, 15, 0),
	tweenM: null,
	tweenR: null,
	target: null,

	getRotation: function(){
		var positionVector = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
		var targetVector = new THREE.Vector3(this.target.x, this.target.y, this.target.z);
		var directionVector = targetVector.clone().sub(positionVector);
		var rotation = directionVector.angleTo(new THREE.Vector3(0, 0, 1));

		if(directionVector.x < 0)
			rotation = - rotation;

		return rotation - this.obj.rotation.y;
	},

	spin: function() {
		var angle = this.getRotation();
		var initial = this.obj.rotation.y;
		var me = this;

		this.tweenR = new TWEEN.Tween( { y: this.obj.rotation.y } )
			.to( { y: angle }, 500)
			.delay(200)
			.onUpdate(function() {
				me.obj.rotation.y = initial + this.y;
			}).start();
	},

	tweenMove: function(){
		function getMovementTime(d){
			return d * 370; //1 second per pixel
		}
		var d = this.lineDistance(this.obj.position, this.target)
		this.tweenM = new TWEEN.Tween(this.position)
			.to(this.target, getMovementTime(d))
			.delay(100)
			.onUpdate($.proxy(function(){//console.log(this.position)
				this.obj.position.x = this.position.x;
				this.obj.position.z = this.position.z;
			}, this))
			.onComplete($.proxy(function(){
				this.target = this.generatePos();
				this.spin();
				this.tweenMove();
			},this)).start();
	},

	generatePos: function(){
		var pos = {
			x:  Math.round( - floor.geometry.width/2 + Math.random() * floor.geometry.width),
			y: Math.round(Math.random() * 5) + 10,
			z: Math.round( - floor.geometry.height/2 + Math.random() * floor.geometry.height)};

		return pos;
	},

	lineDistance: function ( point1, point2 ){
		var xs = point2.x - point1.x;
		xs = xs * xs;

		var zs = point2.z - point1.z;
		zs = zs * zs;

		return Math.sqrt( xs + zs );
	}
};

var birds = [];


function initBirds(scene) {
	var loader = new THREE.JSONLoader();

	loader.load( "flamingo.js", function( geometry ) {

		function morphColorsToFaceColors( geometry ) {
			if ( geometry.morphColors && geometry.morphColors.length ) {
				var colorMap = geometry.morphColors[ 0 ];
				for ( var i = 0; i < colorMap.colors.length; i ++ ) {
					geometry.faces[ i ].color = colorMap.colors[ i ];
					geometry.faces[ i ].color.offsetHSL( 0, 0.3, 0 );
				}
			}
		}

		morphColorsToFaceColors( geometry );
		geometry.computeMorphNormals();

		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 20, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, shading: THREE.SmoothShading } );
		var meshAnim = new THREE.MorphAnimMesh( geometry, material );

		meshAnim.duration = 4000;
		meshAnim.scale.set( 0.008, 0.008, 0.008 );

		for(var i = 0; i < 25; i++){
			var mesh = meshAnim.clone();
			var bird = new Bird(mesh, null);

			bird.target = bird.generatePos();
			bird.spin();
			bird.tweenMove();

			scene.add( bird.obj );

			birds.push(bird)
		}
	} );

}



function showPoint(vector3) {
		var pointGeometry = new THREE.CubeGeometry( 0.1, 0.1, 0.1);
		var pointMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000} );
        var pointMesh = new THREE.Mesh(pointGeometry, pointMaterial );
        pointMesh.position.x = vector3.x;
        pointMesh.position.y = vector3.y;
        pointMesh.position.z = vector3.z;
        scene.add(pointMesh);
}



function updateBirds(delta){
	for(var i = 0; i < birds.length; i++){
		birds[i].obj.updateAnimation( 1000 * delta );
	}
}








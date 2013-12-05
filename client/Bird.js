function Bird(object){
	this.obj = object;	
}

var bird;
var morphs = [];
var tweenM, tweenR;
var position = { x : 0, y: 15, z: 0 };
var target = { x : 15, y: 15, z: 0 };

function initBirds(scene) {
	var loader = new THREE.JSONLoader();

	loader.load( "flamingo.js", function( geometry ) {

		morphColorsToFaceColors( geometry );
		geometry.computeMorphNormals();

		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 20, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, shading: THREE.SmoothShading } );
		var meshAnim = new THREE.MorphAnimMesh( geometry, material );

		meshAnim.duration = 4000;

		meshAnim.scale.set( 0.008, 0.008, 0.008 );
		bird = new Bird(meshAnim);
		bird.obj.position = position;
		
		target = generatePos();
		spinBird(getRotation());

		tweenMoveBird(lineDistance(position, target));
		scene.add( bird.obj );
		morphs.push( bird.obj );
	} );

}

function morphColorsToFaceColors( geometry ) {
	if ( geometry.morphColors && geometry.morphColors.length ) {
		var colorMap = geometry.morphColors[ 0 ];
		for ( var i = 0; i < colorMap.colors.length; i ++ ) {
			geometry.faces[ i ].color = colorMap.colors[ i ];
			geometry.faces[ i ].color.offsetHSL( 0, 0.3, 0 );
		}
	}
}

function tweenMoveBird(d){ 
	tweenM = new TWEEN.Tween(position)
		.to(target, getMovementTime(d))
		.delay(100)
		.onUpdate(function(){
		    bird.obj.position.x = position.x;
		    bird.obj.position.z = position.z;
		})
		.onComplete(function(){
			target = generatePos();
			//bird.obj.rotation.y = 0; 										//reset rotation.y value
			spinBird(getRotation());
			tweenMoveBird(lineDistance(target, position));
		}).start();
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

function getRotation() {
	var positionVector = new THREE.Vector3(position.x, position.y, position.z);
	var targetVector = new THREE.Vector3(target.x, target.y, target.z);
	var directionVector = targetVector.clone().sub(positionVector);
	var rotation = directionVector.angleTo(new THREE.Vector3(0, 0, 1));
	
	if(directionVector.x < 0)
		rotation = - rotation;

	return rotation - bird.obj.rotation.y;
}

function spinBird(angle) {
  initial = bird.obj.rotation.y;

  tweenR = new TWEEN.Tween( { y: bird.obj.rotation.y } )
      .to( { y: angle }, 500)
      .delay(200)
      .onUpdate( function () {
          bird.obj.rotation.y = initial + this.y;
      }).start();
}

function updateBirds(delta){
	if(bird){	
		for ( var i = 0; i < morphs.length; i ++ ) {
			morph = morphs[ i ];
			morph.updateAnimation( 1000 * delta );
		}
	}
}

function generatePos(bird){
    var pos = {x: 5, y: 15, z: 7};
	pos.x = Math.round( - floor.geometry.width/2 + Math.random() * floor.geometry.width);
	pos.y = 15;
	pos.z = Math.round( - floor.geometry.height/2 + Math.random() * floor.geometry.height);
	//showPoint(pos);
	return pos;
}
    
function lineDistance( point1, point2 )
{
    var xs = 0;
    var zs = 0;
     
    xs = point2.x - point1.x;
    xs = xs * xs;
     
    zs = point2.z - point1.z;
    zs = zs * zs;
     
    return Math.sqrt( xs + zs );
}

function getMovementTime(d){
	return d * 370; //1 second per pixel
}






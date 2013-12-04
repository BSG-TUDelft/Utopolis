function Bird(object){
	this.obj = object;	
}

var bird;
var morphs = [];
var tweenM, tweenR;
var position = { x : 0, y: 15, z: 0 };
var target = { x : 15, y: 15, z: 0 };
var currentRotation = Math.PI/2;


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
		//bird.obj.rotateY(Math.PI/2);
		
		console.log(bird.obj);
		//target = generatePos();
		//console.log("Initial rotation: " + bird.obj.rotation.y);
		//console.log("target: " + target.x + "/" + target.z);
		
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
			console.log("current pos: " + position.x + "/" + position.z);
			console.log("new target: " + target.x + "/" + target.z);
			//spinBird(0); 
			bird.obj.rotation.y = 0; //reset rotation.y value
			spinBird(getRotation());
			tweenMoveBird(lineDistance(target, position));
		}).start();
}

function getRotation(){
	var dz = target.z - position.z;
	var dx = target.x - position.x;
	var theta = Math.atan2(dz, dx);
	
	//console.log(position);
	var positionVector = new THREE.Vector3(position.x, position.y, position.z);
	var targetVector = new THREE.Vector3(target.x, target.y, target.z);
	//console.log(positionVector);
	//console.log(targetVector);
	var directionVector = targetVector.clone().sub(positionVector);
	console.log(directionVector);
	var rotation = directionVector.angleTo(new THREE.Vector3(1, 0, 0));
	console.log(rotation * 180/Math.PI);
	currentRotation += rotation;
	//console.log(targetVector.angleTo(new THREE.Vector3(0, 0, 0)));

	var rot;
	if(target.z > position.z && target.x > position.x){
		rot = theta;
		//console.log("z2 > z1 | x2 > x1");
	}	
	else if(target.z < position.z && target.x < position.x){
		rot = Math.PI + theta;
		//console.log("z2 < z1 | x2 < x1");
	}	
	else if(target.z > position.z && target.x < position.x){
		rot = - theta;
		//console.log("z2 > z1 | x2 < x1");
	}
	else if(target.z < position.z && target.x > position.x){
		rot = Math.PI - theta;
		//console.log("z2 < z1 | x2 > x1");
	}
	//console.log("theta: " + theta);
	//console.log("rot: " + rot);
	return currentRotation;
}

function spinBird(angle) {
  console.log(angle);

  tweenR = new TWEEN.Tween( { y: bird.obj.rotation.y } )
      .to( { y: angle }, 500)
      .delay(200)
      .onUpdate( function () {
          bird.obj.rotation.y = this.y;
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
    var pos = {x: 0, y: 0, z: 0};
	pos.x = Math.round(-20 + Math.random()*40);
	pos.y = 15;
	pos.z = Math.round(-20 + Math.random()*40);
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
	return d * 1000; //1 second per pixel
}






/**
 * Created with JetBrains WebStorm.
 * User: wouter
 * Date: 17-12-13
 * Time: 23:09
 * To change this template use File | Settings | File Templates.
 */

/*var Sound = function ( sources, radius, position ) {

	var audio = document.createElement( 'audio' );
	for ( var i = 0; i < sources.length; i ++ ) {

		var source = document.createElement( 'source' );
		source.src = sources[ i ];

		audio.appendChild( source );

	}

	this.position = position;

	this.play = function () {

		audio.play();

	}

	this.update = function ( camera ) {

		var distance = this.position.distanceTo( camera.position );

		if ( distance <= radius ) {

			audio.volume = volume * ( 1 - distance / radius );

		} else {

			audio.volume = 0;

		}

	}

}*/
/**
 * Created with JetBrains WebStorm.
 * User: wouter
 * Date: 17-12-13
 * Time: 23:06
 * To change this template use File | Settings | File Templates.
 */


/** Creates a new sound object that can be played in the browser
 * @param sources {Array} Specify path to one or more audio sources.
 * @param config {Object} possible config:
 * 		playMode {Sound.playMode} wether to play sequential or random (only applies when more sources have been provided)
 *		audio {Object} Key-value object that will be mixed in with the audio element (see http://www.w3schools.com/tags/ref_av_dom.asp for possible values)
 *		loop {Boolean} Plays automatically next file in queue when current is done playing
 *		verbose {Boolean} Verbose output (to console)
 * @constructor
 */
var Sound = function ( sources, config ) {
	this.sources = sources;

	var audio = document.createElement('audio');
	var source = document.createElement('source');
	audio.appendChild( source );
	audio.addEventListener('ended', $.proxy(onEnd, this));
	audio.addEventListener('error', $.proxy(onError, this));

	var currentIndex = 0;
	var paused = false;
	var loop = config.loop || true;
	var playMode = config.playMode || Sound.playMode.sequential;
	var verbose = config.verbose || false;

	if(config.audio != null){
		$.extend(audio, config.audio);
	}

	// PRIVATE METHODS
	function load(){
		switch(playMode){
			case Sound.playMode.random:
				currentIndex = parseInt(Math.random() * this.sources.length, 10);
				break;
			case Sound.playMode.sequential:
				currentIndex = ++currentIndex % this.sources.length ;
				break;
		}
		source.src = this.sources[currentIndex];
		audio.load();
	}

	function onEnd(e){
		if(loop){	//todo: loop should actually loop the playleast instead of the track
			this.play();
		}
	}

	function onError(e){
		console.log("Sound Error: " + e);
	}

	// PUBLIC METHODS
	this.play = function () {
		load.call(this);
		if(verbose)
			console.log("Sound.play: playing " + source.src)
		paused = false;
		audio.play();
	};

	this.pause = function () {
		paused = true;
		audio.pause();
	};

	/** Toggles play / pause */
	this.toggle = function() {
		if(paused)
			this.play();
		else
			this.pause();
	}

	/** Indicates whether the audio is currently paused
	 * @returns {boolean} True if paused, false if otherwise	 */
	this.isPaused = function() {
		return paused;
	}
}

Sound.playMode = {
	sequential: "SEQUENTIAL",
	random: "RANDOM"
}
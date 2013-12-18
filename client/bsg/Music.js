/**
 * Created with JetBrains WebStorm.
 * User: wouter
 * Date: 17-12-13
 * Time: 23:18
 * To change this template use File | Settings | File Templates.
 * 'audio/game/error.mp3',this.music = new Sound([
 'audio/music/An_old_Warhorse_goes_to_Pasture.ogg'
 'audio/game/wrong_placement.ogg'], {

 */
var Music = {
	initMusic: function() {
		this.music = new Sound([
			'audio/music/An_old_Warhorse_goes_to_Pasture.ogg',
			'audio/music/Cisalpine_Gaul.ogg',
			'audio/music/Dried_Tears.ogg',
			'audio/music/Eastern_Dreams.ogg',
			'audio/music/Elysian_Fields.ogg',
			'audio/music/Forging_a_City-State.ogg',
			'audio/music/Harsh_Lands_Rugged_People.ogg',
			'audio/music/Harvest_Festival.ogg',
			'audio/music/Helen_Leaves_Sparta.ogg',
			'audio/music/Highland_Mist.ogg',
			'audio/music/Honor_Bound.ogg',
			'audio/music/In_the_Shadow_of_Olympus.ogg',
			'audio/music/Juno_Protect_You.ogg',
			'audio/music/Karmic Confluence.ogg',
			'audio/music/Land_between_the_two_Seas.ogg',
			'audio/music/Mediterranean_Waves.ogg',
			'audio/music/Peaks_of_Atlas.ogg',
			'audio/music/Rise_of_Macedon.ogg',
			'audio/music/Sands_of_Time.ogg',
			'audio/music/Taiko_1.ogg',
			'audio/music/Taiko_2.ogg',
			'audio/music/Tavern_in_the_Mist.ogg',
			'audio/music/The_Hellespont.ogg',
			'audio/music/The_Road_Ahead.ogg',
			'audio/music/Valley_of_the_Nile.ogg',
			'audio/music/Calm_Before_the_Storm.ogg'], {
			loop: true,
			playMode: Sound.playMode.random,
			verbose: true,
			volume: .3
		});
		this.music.play();
	},

	toggle : function(){
		this.music.toggle();
	}
}
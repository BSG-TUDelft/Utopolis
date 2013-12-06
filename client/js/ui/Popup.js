var Popup = function(parent) {
	this.el = $("<div class='popup'></div>");
	$(parent).append(this.el);
	this.el.draggable({ containment: "window" });
	this.el.resizable();

	var getRndInt = function(max){
		return Math.floor(Math.random() * max);
	}

	var getRndIcons = function() {
		return {
			bronze1: Math.random() < .5,
			bronze2: Math.random() < .5,
			bronze3: Math.random() < .5,
			silver1: Math.random() < .5,
			silver2: Math.random() < .5,
			silver3: Math.random() < .5,
			gold1: Math.random() < .5,
			gold2: Math.random() < .5,
			gold3: Math.random() < .5
		};
	}

	var parseIcons = function(icons){
		var res = "<div class='medals'>";
		var css = {
			bronze1: "medal_bronze1",
			bronze2: "medal_bronze2",
			bronze3: "medal_bronze3",
			silver1: "medal_silver1",
			silver2: "medal_silver2",
			silver3: "medal_silver3",
			gold1: "medal_gold1",
			gold2: "medal_gold2",
			gold3:  "medal_gold3"
		}
		for(var i in icons){
			if(icons[i]){
				res += "<div class='" + css[i] + "'></div>";
			}
		}
		return res + "</div>";
	}

	this.el.html( '<table cellpadding="0" cellspacing="0" border="0" class="leaderboard" id="example"></table>' );
	$('#example').dataTable( {
		"aaData": [
			/* Reduced data set */
			[ "Han Solo", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000) ],
			[ "Luke Skywalker", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000) ],
			[ "Leia Organa", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000) ],
			[ "Boba Fett", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000) ],
			[ "Darth Vader", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000) ],
			[ "Yoda", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000) ],
			[ "Chewbacca", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000) ],
			[ "Obi Wan Kenobi", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000) ],
			[ "Jabba the Hut", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000) ],
			[ "Lando Calrissian", getRndInt(40), getRndInt(2000), getRndInt(2000), getRndInt(2000) ]
		],
		"aoColumns": [
			{ sTitle: "Name", mRender: function ( data, type, full ) {
					return data + '' + parseIcons(getRndIcons());
				}
			},
			{ "sTitle": "Citizens", sClass: "rightAlign", sWidth: "80px" },
			{ "sTitle": "Culture", sClass: "rightAlign", sWidth: "80px" },
			{ "sTitle": "Economy", sClass: "rightAlign", sWidth: "80px" },
			{ "sTitle": "Knowledge", sClass: "rightAlign", sWidth: "80px" }
		],
		bLengthChange: false,
		bInfo: false,
		bPaginate: false,
		bFilter: false
	} );

	var closeButton = $("<div class='close_button'></div>");
	closeButton.click($.proxy(this.hide, this));
	this.el.append(closeButton);
	this.show();
}

Popup.prototype = {

	// Ctor
	constructor: Popup,

	el: null,

	/** Positions this popup in the center of the window (viewport) */
	center: function(){
		this.el.position({ my: "center center", of: $(window)});
	},

	/** */
	show: function() {
		this.center();
		this.el.show();
	},

	hide: function(){
		this.el.hide();
	}
}


var Quests = function(parent, data, config){
	// Call parent constructor
	Popup.prototype.constructor.call(this, parent, config);

	this.el.append( '' +
		'<div class="leaderboard"> ' +
		'<h1>Leaderboard</h1>' +
		'<table cellpadding="0" cellspacing="0" border="0" id="leaderboard"></table>' +
		'</div>' );
	// Used in column renderer
	var parseIcons = function (icons) {
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
			gold3: "medal_gold3"
		};
		for (var i in icons) {
			if (!icons.hasOwnProperty(i)) continue;
			if (icons[i]) {
				res += "<div title='" + i + "' class='" + css[i] + "'></div>";
			}
		}
		return res + "</div>";
	};

	$('#leaderboard').dataTable( {
		"aaData": data,
		"aoColumns": [{
			sTitle: "Name", mRender: function ( data, type, full ) {
				return data + '' + parseIcons(full[5]);
			}
		},
			{ "sTitle": "Citizens", sClass: "right_align", sWidth: "100px" },
			{ "sTitle": "Culture", sClass: "right_align", sWidth: "100px" },
			{ "sTitle": "Economy", sClass: "right_align", sWidth: "100px" },
			{ "sTitle": "Knowledge", sClass: "right_align", sWidth: "110px" }
		],
		bLengthChange: false,
		bInfo: false,
		bPaginate: false,
		bFilter: false
	});
	$('#leaderboard').find('th').append('<div></div>');
	$(window).bind('resize', function () {
		$('#leaderboard').css('width', '100%');
	} );

	this.el.hide();
};
Leaderboard.prototype = new Popup();

/** Updates data, provide data in nested array */
Leaderboard.prototype.update = function (data) {
	// Prevent updating if not needed to improve performance. Also Chrome doesnt like it
	if (!this.isVisible()) return false;

	for (var i = 0; i < data.length; i++) {
		$('#leaderboard').dataTable().fnUpdate(data[i], i);
	}
};

Leaderboard.prototype.show = function(){
	Popup.prototype.show.call(this);
	this.center();
};


Leaderboard.prototype.constructor = Leaderboard;
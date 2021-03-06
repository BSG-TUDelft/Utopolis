"use strict";
var Leaderboard = function(parent, medalDescriptions, config){

	this.config = config || {};
	this.citiesData = [];
	this.provinceData = [];
	var provinceContainer = $('<h1>Leaderboard - cities in your province</h1>');
	var allProvincesContainer = $('<h1>Leaderboard - global province ranking</h1>');
	this.config.tabs = [{
		text: "Cities in my province",
		content: provinceContainer
	},{
		text: "All provinces",
		content: allProvincesContainer
	}];

	// Call parent constructor
	Popup.prototype.constructor.call(this, parent, config);

	this.medalDescriptions = medalDescriptions;
	this.el.append( '' +
		'<div class="leaderboard"> ' +
			'<div class="loader"></div>' +
			'<table cellpadding="0" cellspacing="0" border="0" class="table"></table>' +
		'</div>' );
	this.el.find(".leaderboard").before(provinceContainer, allProvincesContainer);
	this.ajaxSpinner = this.el.find('.leaderboard .loader').spin('large', '#000');

	$(window).bind('resize', function () {
		$('#leaderboard').css('width', '100%');
	} );

	this.addEventListener(Popup.tabChanged, $.proxy(tabChanged, this));

	function tabChanged(e){
		$.proxy(renderTable, this)();
	}

	this.el.hide();


	/** Updates data, provide data in nested array */
	this.update = function (citiesData, provinceData) {
		// Prevent updating if not needed to improve performance. Also Chrome doesnt like it
		if (!this.isVisible()) return false;

		this.citiesData = citiesData;
		this.provinceData = provinceData;

		$.proxy(renderTable, this)();
	};

	// Private

	/** Renders the table */
	function renderTable(){

		//data = $.proxy(processData, this)(data);
		var data;
		switch(this.activeTabIndex){
			case 0:	// cities in province
				data = this.citiesData;
				break;
			case 1: // all provinces
				data = this.provinceData;
				break;
		}

		// Used in column renderer
		var parseIcons = function (icons, medalDescriptions) {
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
					var title = medalDescriptions[i];
					res += "<div title='" + title + "' class='" + css[i] + "'></div>";
				}
			}
			return res + "</div>";
		};

		var table = this.el.find('.table').first();
		if(table.hasClass("dataTable")){
			// Its already a datatable, so update data
			for (var i = 0; i < data.length; i++) {
				table.dataTable().fnUpdate(data[i], i);
			}
		}
		else {
			// Create datatable
			table.dataTable( {
				"aaData": data,
				"aoColumns": [{
					sTitle: "Name", mRender: $.proxy(function ( data, type, full ) {
						return data + '' + parseIcons(full[full.length -1], this.medalDescriptions);
					}, this)
				},
					{ "sTitle": "F. relations", sClass: "right_align", sWidth: "110px" },
					{ "sTitle": "Happiness", sClass: "right_align", sWidth: "110px" },
					{ "sTitle": "Population", sClass: "right_align", sWidth: "110px" },
					{ "sTitle": "Technology", sClass: "right_align", sWidth: "110px" },
					{ "sTitle": "Wealth", sClass: "right_align", sWidth: "80px" }
				],
				fnServerData: function() { },
				bLengthChange: false,
				bInfo: false,
				bPaginate: false,
				bFilter: false
			});
			table.find('th').append('<div></div>');
		}
	}

	/** */
	function processData(originalData){
		var data = [];

	}
};
Leaderboard.prototype = new Popup();



Leaderboard.prototype.show = function(){
	Popup.prototype.show.call(this);
	this.center();
};

Leaderboard.prototype.toggle = function(){
	Popup.prototype.show.call(this);
};


Leaderboard.prototype.constructor = Leaderboard;
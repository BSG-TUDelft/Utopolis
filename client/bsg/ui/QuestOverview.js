"use strict";
var QuestOverview = function(parent, data, config){
	this.config = config || {};
	this.activeQuestContainer = $('<div></div>');
	this.inActiveQuestContainer = $('<div></div>');

	this.config.tabs = [{
		text: "Active quests",
		content: this.activeQuestContainer
	},{
		text: "Completed quests",
		content: this.inActiveQuestContainer
	}];

	// Call parent constructor
	Popup.prototype.constructor.call(this, parent, this.config);

	// Listen to tabChanged event of superclass Popup
	this.addEventListener(Popup.tabChanged, $.proxy(onTabChanged, this));

	this.el.addClass('questoverview');
	this.el.append('' +
		'<h1>Quest overview</h1>' +
		'<div class="questlog"> ' +
		'</div>' );
	this.el.find(".questlog").append(this.activeQuestContainer,	this.inActiveQuestContainer);


	this.update = function(data){
		if (!this.isVisible()) return false;

		//var questlog = this.el.find(".questlog");
		for(var i = 0; i < data.length; i++){
			//var css = data[i].completed ? "completed" : "incomplete";
			//var status = data[i].completed ? "Completed!" : "Active";

			var container = data[i].completed ? this.inActiveQuestContainer : this.activeQuestContainer;
			container.append('' +
				'<div quest-id="' + data[i].id + '" quest-completed="' + data[i].completed + '">' +
					'<h2>Quest: ' + data[i].title + '</h2>' +
					'<span class="status">' + status + '</span>' +
					data[i].text +
				'</div>'
			);
		}
	};

	// Private
	function onTabChanged(e){
		/*this.el.find(".questlog div").each(function(index, el){
			if(e.tabIndex == el.attributes[data[i].completed])
				$(el).show();
			else
				$(el).hide();
		});*/

		console.log(e.tabIndex);
	}

	this.update(data);
	this.el.hide();

};
QuestOverview.prototype = new Popup();

/** Updates data, provide data in nested array */
QuestOverview.prototype.update2 = function (data) {
	// Prevent updating if not needed to improve performance. Also Chrome doesnt like it
	if (!this.isVisible()) return false;

	this.questData = data;
};

QuestOverview.prototype.show = function(){
	Popup.prototype.show.call(this);
	this.center();
};

// Reset constructor
QuestOverview.prototype.constructor = QuestOverview;
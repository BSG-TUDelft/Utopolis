"use strict";
var QuestOverview = function(parent, data, config){
	var scope = this;
	this.config = config || {};
	this.activeQuestContainer = $('<div></div>');
	this.inActiveQuestContainer = $('<div></div>');
	this.questDescriptions = data.description;
	this.data = null;

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

	// Add initial data
	var up = [];
	for(var i in data.description){
		up.push({
			id: data.description[i].id,
			completed: !!data.description[i].completed
		});
	}
	update(up, true);


	function update(data, silent){
		if(!silent)
			checkQuestsCompleted(data);
		scope.data = data;

		if (!scope.isVisible()) return;
		scope.inActiveQuestContainer.empty();
		scope.activeQuestContainer.empty();
		for(var i = 0; i < data.length; i++){
			var questDescription = getQuestDescriptionById(data[i].id);
			var container = data[i].completed ? scope.inActiveQuestContainer : scope.activeQuestContainer;
			container.append('' +
				'<div data-quest_id="' + data[i].id + '" data-quest_completed="' + data[i].completed + '" class="quest">' +
					'<h2>Quest: ' + questDescription.title + '</h2>' +
					'<div class="banner ' + questDescription.bannerCss + '"></div>' +
					questDescription.text +
				'</div>'
			);
		}
	}
	// Private
	function onTabChanged(e){
		//console.log(e.tabIndex);
	}

	/** Gets quest description by quest id */
	function getQuestDescriptionById(id){
		for(var i = 0; i < scope.questDescriptions.length; i++){
			if(scope.questDescriptions[i].id == id)
				return scope.questDescriptions[i];
		}
		return null;
	}

	/** */
	function checkQuestsCompleted(newQuestData){
		if(!scope.data) return;
		for(var i = 0; i < newQuestData.length; i++){
			if(newQuestData[i].completed && !scope.data[i].completed){
				var questDescription = getQuestDescriptionById(newQuestData[i].id);
				scope.dispatchEvent( { type: QuestOverview.newQuestCompleted, questDescription: questDescription } );
			}
		}
	}

	scope.el.hide();
	scope.update = update;
};
QuestOverview.prototype = new Popup();

QuestOverview.prototype.show = function(){
	Popup.prototype.show.call(this);
	this.center();
	this.update(this.data);
};

QuestOverview.prototype.toggle = function(){
	Popup.prototype.toggle.call(this);
	this.update(this.data);
};

// Reset constructor
QuestOverview.prototype.constructor = QuestOverview;
QuestOverview.newQuestCompleted = "NEW_QUEST_COMPLETED";
THREE.EventDispatcher.prototype.apply( QuestOverview.prototype );

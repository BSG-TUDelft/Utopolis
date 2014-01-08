"use strict";
var QuestOverview = function(parent, data, config){
	var me = this;
	this.config = config || {};
	this.activeQuestContainer = $('<div></div>');
	this.inActiveQuestContainer = $('<div></div>');
	this.questDescriptions = data.description;

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


	function update(data){
		checkQuestsCompleted(data);
		me.data = data;

		if (!me.isVisible()) return;
		me.inActiveQuestContainer.empty();
		me.activeQuestContainer.empty();
		for(var i = 0; i < data.length; i++){
			//var css = data[i].completed ? "completed" : "incomplete";
			//var status = data[i].completed ? "Completed!" : "Active";
			var questDescription = getQuestDescriptionById(data[i].id);
			var container = data[i].completed ? me.inActiveQuestContainer : me.activeQuestContainer;
			container.append('' +
				'<div data-quest_id="' + data[i].id + '" data-quest_completed="' + data[i].completed + '">' +
					'<h2>Quest: ' + questDescription.title + '</h2>' +
					//'<span class="status">' + status + '</span>' +
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
		for(var i = 0; i < me.questDescriptions.length; i++){
			if(me.questDescriptions[i].id == id)
				return me.questDescriptions[i];
		}
		return null;
	}

	/** */
	function checkQuestsCompleted(newQuestData){
		if(!me.data) return;
		for(var i = 0; i < newQuestData.length; i++){
			if(newQuestData[i].completed && !me.data[i].completed){
				var questDescription = getQuestDescriptionById(newQuestData[i].id);
				me.dispatchEvent( { type: QuestOverview.newQuestCompleted, questDescription: questDescription } );
			}
		}
	}

	me.el.hide();
	me.update = update;
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

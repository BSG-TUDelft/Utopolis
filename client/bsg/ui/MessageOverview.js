/**
 * Created by wouter on 11-1-14.
 */
"use strict";
var MessageOverview = function(parent, data, config){
    var me = this;
    var FROM = 0,
        SUBJECT = 1,
        DATE_SEND = 2,
        DATE_READ = 3,
        MESSAGE_TEXT = 4,
        ID = 5;

    this.config = config || {};

    // Call parent constructor
    Popup.prototype.constructor.call(this, parent, this.config);

    // Create input popup
    this.input = new Popup($("body"), null);
    this.input.el.addClass("message_input");
    this.input.el.append('' +
        '<label>To:</label><select type="text" class="to"/>' +
        '<label>Subject:</label><input type="text" class="subject"/>' +
        '<textarea class="message-text"/>' +
        '<div class="button-medium send" style="width: 100px; float: right; margin-right: -2px;" tabindex="0"><div class="inner">send</div></div>'
    );
	this.input.el.find(".send").click($.proxy(function(e){
		// Fires MessageOverview.sendClicked when send button is clicked
		var to = { id: this.input.el.find(".to").val(), nick: this.input.el.find(".to option:selected").text()};
		var subject = this.input.el.find(".subject").val();
		var message = this.input.el.find(".message-text").val();
		this.dispatchEvent( { type: MessageOverview.sendClicked, to: to, subject: subject, message: message } );
	}, this));

    this.input.el.hide();
    this.hide();

    this.el.addClass('messageoverview');
    this.el.append('' +
        '<h1>Message overview</h1>' +
        ' <div class="compose button">[compose]</div> ' +
        '<table cellpadding="0" cellspacing="0" border="0" class="table"></table>' +
    '');

    this.inboxData = data;
    this.el.on('click', ".compose", function(e){
        me.input.show();
        me.input.el.find(".to").val("");
        me.input.el.find(".subject").val("");
        me.input.el.find(".message-text").val("");
    });
    this.el.on('click', '.table .button', $.proxy(function(e){
        var index = e.target.attributes["data-index"].nodeValue;
        var row = me.inboxData[index];

        switch(e.target.attributes["data-button_type"].nodeValue){
            case "delete":
            	var record = this.inboxData.splice(index, 1)[0];
                this.update(this.inboxData, null);

				this.dispatchEvent( { type: MessageOverview.deleteClicked, messageId: record[ID] } );
                break;
            case "reply":
                this.input.show();
                this.input.el.find(".to").focus();
				this.input.el.find(".to option:contains('" + row[FROM]+ "')").attr('selected', true);
                this.input.el.find(".subject").val("Re: " + row[SUBJECT]);
                this.input.el.find(".message-text").val("\n\n> " + row[MESSAGE_TEXT].split("\n").join("\n> "));
                this.input.el.find(".message-text").focus();
                break;
        }
    }, this));

    this.initData = function(){
        var table = this.el.find(".table").first();
        table.dataTable( {
            "aaData": this.inboxData,
            "aoColumns": [
                { sTitle: "From", sWidth: "30%"},
                { sTitle: "Subject", sWidth: "60%" },
                { sTitle: "Date", sWidth: "10%", mRender: $.proxy(function ( data, type, full ) {
                    return ((data instanceof Date) ? $.formatDateTime('mm/dd/y g:ii', data) : data);
                }, this) }
            ],
            fnServerData: function() { },
            fnRowCallback: function( row, data, index ) {
                /* Append the grade to the default row class name */
                $(row).attr("data-message_index", index);

                if (data[3] == null ){
                    $(row).addClass("unread");
                }
                return row;
            },
            oLanguage: {
                sEmptyTable: "No messages ..."
            },
            bLengthChange: false,
            bInfo: false,
            bPaginate: false,
            bFilter: false,
            bAutoWidth:false
        });

        table.find("tbody tr").click(function () {
            if ( table.fnIsOpen(this) ) {
                table.fnClose( this );
            } else {
                var index = $(this).attr("data-message_index");
                var row = me.inboxData[index];
                if(!row) return;
                var text = row[MESSAGE_TEXT].replace(/\n/g, '<br />');
                if(row[DATE_READ] == null){
                    row[DATE_READ] = new Date();
                    $(this).removeClass("unread");
                }
                // Todo: send update to server
                text += '' +
                    '<div class="delete button" data-button_type="delete" data-index="' + index + '">[delete]</div>' +
                    '<div class="reply button"  data-button_type="reply" data-index="' + index + '">[reply]</div>';

                    table.fnOpen( this, text, "");
                $(this).next().addClass("info_row");
            }
        } );

		// Autocomplete
		var to = me.input.el.find(".to");
		to.empty();
		if(this.playerData){
			$.each(this.playerData, function() {
				to.append($("<option />").val(this.value).text(this.label));
			});
		}
		/*me.input.el.find(".to").autocomplete({
			minLength: 0,
			source: this.playerData,
			focus: function( event, ui ) {
				me.input.el.find(".to").val( ui.item.label );
				return false;
			},
			select: function( event, ui ) {
				me.input.el.find(".to").val( ui.item.label );

				return false;
			}
		})
		.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
			return $( "<li>" )
				.append( "<a>" + item.label + "<br></a>" )
				.appendTo( ul );
		};*/
    };
    this.initData();
};
MessageOverview.prototype = new Popup();


MessageOverview.prototype.show = function(){
    Popup.prototype.show.call(this);
    this.center();
    //this.update(this.data);
};

MessageOverview.prototype.toggle = function(){
    Popup.prototype.toggle.call(this);
    //this.update(this.data);
};

MessageOverview.prototype.update = function(inboxData, playerData){
    var dataTable = this.el.find(".table").first().dataTable();
    dataTable.fnDestroy();
    dataTable.html("");
	if(inboxData != null)
	    this.inboxData = inboxData;
	if(playerData != null)
		this.playerData = playerData;

    this.initData();


    // for (var i = 0; i < data.length; i++) {
    //var i = 0;
    //dataTable.fnUpdate(data[i], i);
    //}
};
// Reset constructor
MessageOverview.prototype.constructor = MessageOverview;
MessageOverview.sendClicked = "SEND_CLICKED";
MessageOverview.deleteClicked = "DELETE_CLICKED";
THREE.EventDispatcher.prototype.apply( MessageOverview.prototype );

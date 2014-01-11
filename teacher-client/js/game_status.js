var host = "http://localhost:8080/api/";

function requestHistory(){
	 var request = $.ajax({
        url: host + 'message/list',
        type: 'GET'
    });

    request.done(function ( response, textStatus, jqXHR ){
        console.log("SERVER RESPONSE: history retrieved successfully");
        results = response; 
        var i = 0;
        while( i != results.messages.length-1 )      
        {
        	$("#itens-area").append("<div class='row'>"
        		+ makeItem( results.messages[i] )
        		+ makeItem( results.messages[i+1] )
        		+ "</div>");

          	i+=2;
        }
    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });
}

function makeItem( message ){
	var date = message.entryDate.split("T");

	return "<div id='item'><div><h4>To: "
	   	+ message.player.name 
	   	+ "</h4></div><div class='item-content'><section class='a'>"
	   	+ message.message + "</section></div><h5>"
		+ date[1] + " " + date[0] + " || Citizens assigned: " 
	   	+ message.assignNum + "</h5></div>";
}
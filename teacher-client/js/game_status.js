var host = "http://localhost:8080/api/";

function requestHistory(){
	 var request = $.ajax({
        url: host + 'player/list',
        type: 'GET'
    });

    request.done(function ( response, textStatus, jqXHR ){
        console.log("SERVER RESPONSE: history retrieved successfully");
        results = response.players; 
        $("#itens-area").empty();
        for(var i=0; i<results.length; i++) {
        	for(var j=0; j<results[i].messages.length; j++) {
        		if(results[i].messages[j].sender == "Teacher") {
        			$("#itens-area").append( makeItem( results[i], j ) );
        		}
        	}
        }
    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });
}

function makeItem( player, pos ){
	if(player.messages[pos] != null) {
		var date = player.messages[pos].entryDate.split("T");

		return "<div id='item'><div><h4>To: "
		   	+ player.name 
		   	+ "</h4></div><div class='item-content'>"
		   	+ "<section class='a b'> Subject: " + player.messages[pos].subject + "</section>"
		   	+ "<section class='a'>"
		   	+ player.messages[pos].message + "</section></div><h5>"
			+ date[1] + " " + date[0] + " || Citizens assigned: " 
		   	+ player.messages[pos].assignNum + "</h5></div>";
   }
   return "";
}
var host = "http://localhost:8080/api/";
function requestPlayers() {
    var request = $.ajax({
        url: host + 'player/list',
        type: 'GET'
    });

    request.done(function ( response, textStatus, jqXHR ){
        console.log("SERVER RESPONSE: players retrieved successfully");
        results = response;
        $(".status-content").empty();       
        for (var i=0;i<results.players.length;i++)
        {
           $(".status-content").append('<div class="row"><div id="student"><a id="'+i+'" value="'
                + results.players[i].nick + '">'
                + results.players[i].name +'</a></div><div id="assignment">'
                + '<input id="numCitizens-input'+i+'" class="numCitizens-input" type="textarea" required="required" name="n_citizens" placeholder="Number"/></div>'
                + '<div id="priv-message">' 
                + '<input id="priv-message-input'+i+'" class="priv-message-input" type="textarea" required="required" name="private_message" placeholder="Type a personal message to '
                + results.players[i].name +'..."/></div>' 
                + '<div id="submitAssignment"><span class="tab-icon">'
                + '<i id="button" class="fa fa-check-circle fa-2x" onclick="updateCityCitizens('+i+')"></i></span></div></div>');
        }

    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });
}


function updateCityCitizens( pos ){

    var nick = $('#'+pos).attr("value");
    var numCitizens = $("#numCitizens-input"+pos).val();
    if( isNaN(numCitizens) ){
        numCitizens = 0;
        alert("You need to provide a number of citizens to assign!");
    }else {
        if(numCitizens > 0){
            var msgText = $("#priv-message-input"+pos).val();

            var request = $.ajax({
                url: host + "player/" + nick,
                type: 'GET'
            });

            request.done(function (response, textStatus, jqXHR){
                player = response;
                assignCitizens( player, numCitizens );
                saveMessage( player, numCitizens, msgText );
            });

            request.fail(function (jqXHR, textStatus, errorThrown){
                console.error(
                    "The following error occured: " +
                    textStatus, errorThrown
                );
                console.log("Couldn't find the player.");
            });
        }
    }
}

function assignCitizens( player, number ){
    var req = $.ajax({
        url: host + 'city/' + player.id + '/citizens/' + number,
        type: 'POST'
    });

     req.done(function ( response, textStatus, jqXHR ){
        results = response;       
        alert(number + " citizens were successfully assigned to player: " + player.name + "!");
    });

    req.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
        alert("Citizens not assigned!");
    });
}

function saveMessage( player, numCitizens, msgText ) {
    
   
    var message = new Message(new Date(), msgText, player, numCitizens);
    
    var struct = {
        entryDate: message.date,
        message: message.msg,
        player: message.player,
        assignNum: message.assignNum,
        subject: message.subject,
        sender: message.sender
    };

    var request = $.ajax({
        url: host + 'message',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(struct),
        context: message
    });

    request.done(function(response, textStatus, jqXHR){
        console.log("SERVER RESPONSE: message sent!");
    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });

}
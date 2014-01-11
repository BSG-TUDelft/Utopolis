var host = "http://localhost:8080/api/";
function requestPlayers() {
    var request = $.ajax({
        url: host + 'player/list',
        type: 'GET'
    });

    request.done(function ( response, textStatus, jqXHR ){
        console.log("SERVER RESPONSE: players retrieved successfully");
        results = response;       
        for (var i=0;i<results.players.length;i++)
        {
           $("#students").append("<option value='"+results.players[i].nick+"'>"+results.players[i].name+"</option>");
        }

    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });
}

function updateCityCitizens(){
    var nick = $('#students').find("option:selected").text();

    var numCitizens = $("#numCitizens-input").val();

    var request = $.ajax({
        url: host + "player/" + nick,
        type: 'GET'
    });

    request.done(function (response, textStatus, jqXHR){
        player = response;
        assignCitizens( player, numCitizens );
        saveMessage( player, numCitizens );
    });

    request.fail(function (jqXHR, textStatus, errorThrown){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
        console.log("Couldn't find the player.");
    });
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

function saveMessage( player, numCitizens ) {
    
    var msgText = $("#priv-message-input").val();
    var message = new Message(new Date(), msgText, player, numCitizens);
    console.log(message.msg);
    var struct = {
        entryDate: message.date,
        message: message.msg,
        player: message.player,
        assignNum: message.assignNum
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
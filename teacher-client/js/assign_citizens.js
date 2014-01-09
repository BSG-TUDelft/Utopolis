var host = "http://localhost:8080/api/";

function requestPlayers() {
    var request = $.ajax({
        url: host + 'player/JD',
        type: 'GET'
    });

    request.done(function (response, textStatus, jqXHR){
        console.log("SERVER RESPONSE: cities retrieved successfully");
        players = response;
        console.log(players);

        //TODO add cities data to form.
        $("#students").append("<option value='"+1+"'>"+players.name+"</option>");
        /*for (var i=0;i<cities.length;i++)
        {
            $('#cities').appendChild("<option value='"+i+"'>"+cities+"</option>");
        }*/
    });

    request.fail(function (jqXHR, textStatus, errorThrown){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });
}
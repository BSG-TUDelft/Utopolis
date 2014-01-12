var host = "http://localhost:8080/api/";

function createProvince(){
	var n = $("#prvn").val();
	var cityList = [];
	
	var province = new Province(n, cityList);
	
	var struct = {
        cities: cityList,
        name: n
    };

    var request = $.ajax({
        url: host + 'province',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(struct),
        context: province
    });

    request.done(function(response, textStatus, jqXHR){
        console.log("SERVER RESPONSE: province created!");
    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.log(n);
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
        alert("Something went wrong creating Province! Try again.");
    });
}

function createPlayer(){

	var name = $("#pn").val();
	var login = $("#pl").val();
	var pw = $("#ppw").val();


	var player = new Player(name, login, pw);
	
	var struct = {
        nick: login,
        name: name,
        password: pw
    };

    var request = $.ajax({
        url: host + 'player',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(struct),
        context: player
    });

    request.done(function(response, textStatus, jqXHR){
        console.log("SERVER RESPONSE: player created!");
    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
        alert("Something went wrong creating Player! Try again.");
    });


}

function createCity(){

	var name = $("#cn").val();
	var player = null;
	var structures = [];
	var numCitizens = 0;	
	var color = "#0xFF0000";
	var race = 0;

	var city = new City(name, player, structures, numCitizens, color, race);

	var struct = {
        name: name,
        player: player,
        structures: structures,
        numCitizens: numCitizens,
        color: color,
        race: race
    };

    var request = $.ajax({
        url: host + 'city',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(struct),
        context: city
    });

    request.done(function(response, textStatus, jqXHR){
        console.log("SERVER RESPONSE: city created!");
    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
        alert("Something went wrong creating City! Try again.");
    });
}
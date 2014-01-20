

var provinces_data = [];
var cities = [];
var players = [];
var all_cities = [];
var all_players = [];

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
        getProvinces();
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
        getPlayers();
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
        populateWithCitiesNoProvince();

    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
        alert("Something went wrong creating City! Try again.");
    });	
}

function getProvinces(){
    var request = $.ajax({
        url: host + 'province/list',
        type: 'GET'
    });

    request.done(function ( response, textStatus, jqXHR ){
        console.log("SERVER RESPONSE: Provinces retrieved successfully");
        results = response;
        provinces_data = results.provinces;
        populateWithProvinces();
    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });  
}

function populateWithProvinces(){
    $("#provinces-list").empty();       
    for (var i=0;i<provinces_data.length;i++)
    {
       $("#provinces-list").append("<option value='" + provinces_data[i].name + "'>" + provinces_data[i].name + "</option>");
    }
	selectProvince();
}

function selectProvince(){
     populateWithCitiesFromProvince();
     populateWithCitiesNoProvince();
}

function populateWithCitiesFromProvince(){
	if(provinces_data.length > 0){

		var province = $('#provinces-list').find(":selected").text();
		var cities = [];

		for(var j=0; j<provinces_data.length; j++){
			if(provinces_data[j].name == province){
				cities = provinces_data[j].cities;
			}
		}
		$("#province-cities-list").empty();
		for(var i=0; i<cities.length; i++){
			$("#province-cities-list").append("<div id='city-province" + i + "' class='city-drag-item' draggable='true' ondragstart='drag(event)'>"
				+ "<span class='tab-icon'><h4>" + cities[i].name + "</h4></span></div>");
		}
	}
}

function testProvinceCities( city ){

    var add = true;
    for(var z=0; z<provinces_data.length; z++){
        for(var j=0; j<provinces_data[z].cities.length; j++) {
            if(city.name == provinces_data[z].cities[j].name){
                add = false;
                break;
            }  
        }
    }
    if(add)
        cities.push(city);
}

function populateWithCitiesNoProvince(){
    if(provinces_data.length > 0){

        cities = [];
        
        for(var j=0; j<all_cities.length; j++){
            testProvinceCities(all_cities[j]);
        }
        $("#cities-without-province").empty();
        populateWithCities();
        if(cities.length > 0){
            for(var i=0; i<cities.length; i++){
                $("#cities-without-province").append("<div id='city-no-province" + i + "' class='city-drag-item' draggable='true' ondragstart='drag(event)' value='" + cities[i].name + "''>"
                    + "<span class='tab-icon'><h4>" + cities[i].name + "</h4></span></div>");
            }
        }
    }
}

function getCities(){
    var request = $.ajax({
        url: host + 'city/list',
        type: 'GET'
    });

    request.done(function ( response, textStatus, jqXHR ){
        console.log("SERVER RESPONSE: cities retrieved successfully");
        results = response;
        all_cities = results.cities;
       
    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });  
}



function updateProvince() {
    if(provinces_data.length > 0){

        var p = $('#provinces-list').find(":selected").text();
        var province;
        for(var z=0; z<provinces_data.length; z++){
            if(provinces_data[z].name == p){
                province = provinces_data[z];
            }
        }
        
        for(var i=0; i<$('#province-cities-list').length; i++){
            if($('#province-cities-list').children('#city-no-province'+i)){
                var city = $('#province-cities-list').children('#city-no-province'+i).text();
                for(var j=0; j<cities.length; j++){
                    if(city == cities[j].name){
                        province.cities.push(cities[j]);
                    }
                } 
            }
        }

    var request = $.ajax({
        url: host + 'province',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(province),
    });

    request.done(function(response, textStatus, jqXHR){
        console.log("SERVER RESPONSE: province updated!");
    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.log(n);
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
        alert("Something went wrong updating Province! Try again.");
    });

    }
}

function populateWithCities(){
	
    $("#cities-list").empty();
    console.log(cities.length);
    if(cities.length > 0) {       
	    for (var i=0;i<cities.length;i++)
	    {
             $("#cities-list").append('<div class="flex"><div id="city"><a id="'+i+'" value="'
                + cities[i].name + '">'
                + cities[i].name +'</a></div>'
                + '<div id="players_list"><select id="p-list'+i+'"></select></div>'
                + '</div>');
        }
        getPlayers();
        
        $("#cities-list").append('<div id="submit-cities-to-players"><span class="tab-icon">'
                + '<i id="button" class="fa fa-check-circle fa-2x" onclick=""></i></span></div>');
    }   
}

function testPlayerNoCity( player ){
    var add = true;
    for(var a=0; a<all_cities.length; a++){
        if(all_cities[a].player){
            if(player.name == all_cities[a].player.name){
                console.log(player.name + " | " + all_cities[a].player.name);
                add = false;
                break;
            }
        }
    }
    if(add)
        players.push(player);
}


function getPlayers(){
    all_players = [];

    var request = $.ajax({
        url: host + 'player/list',
        type: 'GET'
    });

    request.done(function ( response, textStatus, jqXHR ){
        console.log("SERVER RESPONSE: players retrieved successfully");
        console.log(response.players.length);
        all_players = response.players;
        populateWithPlayersNoCity();
    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });  

  
}

function populateWithPlayersNoCity() {
    players = [];
    for(var j=0; j<cities.length; j++){
        $("#p-list"+j).empty();
        if(all_players.length > 0) {       
            for (var i=0;i<all_players.length;i++){
                testPlayerNoCity(all_players[i]);
            }
            if(players.length > 0){
                for(var z=0; z<players.length; z++){
                    $("#p-list"+j).append("<option value='" + players[z].name + "'>" + players[z].name + "</option>");
                }
            }
        }  
        
    }
}
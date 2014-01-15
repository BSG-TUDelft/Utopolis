var host = "http://localhost:8080/api/";

var provinces_data = [];
var cities = [];

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
        populateWithProvinces();
        populateWithCities();
    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
        alert("Something went wrong creating City! Try again.");
    });	
}

function populateWithProvinces(){
	var request = $.ajax({
        url: host + 'province/list',
        type: 'GET'
    });

    request.done(function ( response, textStatus, jqXHR ){
        console.log("SERVER RESPONSE: Provinces retrieved successfully");
        results = response;
        $("#provinces-list").empty();       
        for (var i=0;i<results.provinces.length;i++)
        {
           $("#provinces-list").append("<option value='" + results.provinces[i].name + "'>" + results.provinces[i].name + "</option>");
        }
        provinces_data = results.provinces;
        populateWithCitiesFromProvince();
        populateWithCitiesNoProvince(); 
    });

    request.fail(function ( jqXHR, textStatus, errorThrown ){
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });  
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

function testProvinceCities( all_cities, province_cities ){
	var temp = [];

	for(var j=0; j<all_cities.length; j++) {
		var add = true;
		for(var z=0; z<province_cities.length; z++){
			if(all_cities[j].name == province_cities[z].name){
				add = false;
				break;
			}
		}
		if(add){
			cities.push(all_cities[j]);
		}
	}
}

function populateWithCitiesNoProvince(){
	if(provinces_data.length > 0){

		var all_cities = [];
		cities = [];
		var request = $.ajax({
	        url: host + 'city/list',
	        type: 'GET'
	    });

	    request.done(function ( response, textStatus, jqXHR ){
	        console.log("SERVER RESPONSE: cities retrieved successfully");
	        results = response;
	     	all_cities = results.cities;
	     	for(var j=0; j<provinces_data.length; j++){
		    	testProvinceCities(all_cities, provinces_data[j].cities);
		    }
		    $("#cities-without-province").empty();
		    
		    if(cities.length > 0){
			    for(var i=0; i<cities.length; i++){
					$("#cities-without-province").append("<div id='city-no-province" + i + "' class='city-drag-item' draggable='true' ondragstart='drag(event)'>"
						+ "<span class='tab-icon'><h4>" + cities[i].name + "</h4></span></div>");
				}
				populateWithCities();
			}
	    });

	    request.fail(function ( jqXHR, textStatus, errorThrown ){
	        console.error(
	            "The following error occured: " +
	            textStatus, errorThrown
	        );
	    });  
	}
}

function populateWithCities(){
	
    $("#cities-list").empty();
    console.log(cities.length);
    if(cities.length > 0) {       
	    for (var i=0;i<cities.length;i++)
	    {
	       $("#cities-list").append("<option value='" + cities[i].name + "'>" + cities[i].name + "</option>");
	    }
    }   
}
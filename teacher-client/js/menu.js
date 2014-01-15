$(document).ready( function() {
	$("#assign-page").hide();
	$("#set-up-page").hide();
	$("#god-page").hide();
    start();

    $("#assign").click(function() {
        $("#assign-page").show();
        $("#status-page").hide();
		$("#set-up-page").hide();
		$("#god-page").hide();
    });

    $("#set-up").click(function() {
        $("#assign-page").hide();
        $("#status-page").hide();
		$("#set-up-page").show();
		$("#god-page").hide();
    });

    $("#god").click(function() {
        $("#assign-page").hide();
        $("#status-page").hide();
		$("#set-up-page").hide();
		$("#god-page").show();
    });

    $("#status").click(function() {
        $("#assign-page").hide();
        $("#status-page").show();
		$("#set-up-page").hide();
		$("#god-page").hide();
    });

});
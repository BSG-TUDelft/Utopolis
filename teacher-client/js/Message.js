Message = function(date, msg, player, assignNum){
	this.date = date;
	this.msg = msg;
	this.player = player;
	this.assignNum = assignNum;
    this.subject = "You have received " + assignNum + " citizens!";
    this.from = "Teacher";
}
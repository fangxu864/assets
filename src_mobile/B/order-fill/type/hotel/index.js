

var tpl = require("./index.xtpl");

var Calendar = require("../../calendar/index.js");

module.exports = function(parent,aid,pid){


	var container = $(tpl).appendTo(parent);
	
	var Hotel = PFT.Util.Class({
		container : container,
		EVENTS : {
			"click .inHotel" : "showCalendar1",
			"click .outHotel" : "showCalendar2"			
		},
		init : function(){
			this.aid = aid;
			this.pid = pid;

			var dateGroup = this.getNowDate();	
			var nowDate = dateGroup.nowDate + "-" +dateGroup.day; //有天数的

			this.calendar1 = new Calendar(nowDate,aid,pid);
			this.calendar2 = new Calendar(nowDate,aid,pid);

		},


		showCalendar1 : function(){

			if(this.calendar1){
				this.calendar1.show();
			}

		},
		showCalendar2 : function(){

			if(this.calendar2){
				this.calendar2.show();
			}

		},

		getNowDate : function(){

			var date=new Date;
			var year=date.getFullYear(); 
			var month=date.getMonth()+1;
			// month =(month<10 ? "0"+month:month); 
			var day = date.getDate(); 

			var dateGroup = {
				year : year,
				month : month,
				day : day,
				nowDate : (year.toString()+'-'+month.toString())
			}

			return dateGroup;

		}



	});


	return new Hotel;

}



















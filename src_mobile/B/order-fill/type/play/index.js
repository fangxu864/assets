

require("./index.scss");	

var tpl = require("./index.xtpl");

var Calendar = require("../../calendar/index.js");

module.exports = function(parent,aid,pid){


	var container = $(tpl).appendTo(parent);
	
	var Play = PFT.Util.Class({
		container : container,
		EVENTS : {
			"click #showDateInput":"showCalendar"
		},
		init : function(){
			var that = this;

			var dateGroup = this.getNowDate();	
			var nowDate = dateGroup.nowDate + "-" +dateGroup.day; //有天数的

			this.calendar = new Calendar(nowDate,aid,pid);
			//初始化日期
			$("#showDateInput").val("*演出日期 "+nowDate);
			this.calendar.selectedDay = nowDate;
		},

		showCalendar : function(){

			if(this.calendar){
				this.calendar.show();
			}else{
				console.log("日历未初始化");
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


	return new Play;

}



















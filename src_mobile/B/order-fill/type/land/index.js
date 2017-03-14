

var tpl = require("./index.xtpl");

var Calendar = require("../../calendar/index.js");

// var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");  //列表弹窗

// var GetCalendarPrice = require("../../service/getCalendarPrice.js");

module.exports = function(parent,aid,pid,ddays){


	var container = $(tpl).appendTo(parent);

	var Land = PFT.Util.Class({
		container : container,
		EVENTS : {
			"click #playDate":"showCalendar"
		},
		init : function(){

			var that = this;

			var dateGroup = this.getNowDate();	
			if(parseInt(ddays) > 0){
				ddays = parseInt(ddays) + 1;
			}else{
				ddays = parseInt(ddays);
			}
			dateGroup.day = dateGroup.day + ddays;
			var nowDate = dateGroup.nowDate + "-" +dateGroup.day; //有天数的

			this.calendar = new Calendar(nowDate,aid,pid);
			//初始化日期
			$("#playDate").val("*游玩日期 "+nowDate);
			this.calendar.selectedDay = nowDate;

		},

		showCalendar : function(){


			//日历分离测试//暂时无法完全分离

			if(this.calendar){
				this.calendar.show();
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


	return new Land;

}
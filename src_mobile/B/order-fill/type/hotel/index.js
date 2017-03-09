

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

			console.log("123");
			console.log(this.calendar1.getPrice);
			
			this.setDate();//初始化时间
		},

		setDate : function(){

			var that = this;

			var date = this.getNowDate();
			//有天数的
			var dateDay = date.nowDate + "-" +date.day;

			var list1 = that.calendar1.getNowMonthList();
			var list2 = that.calendar2.getNowMonthList();
			console.log(list1);
			console.log(list2);

			//初始化日期以供外部
			this.calendar1.selectedDay = dateDay;
			this.calendar2.selectedDay = dateDay;

			var dateSelectText = date.month + "月" + date.day + "日";
			$(".inHotel .dateSelectDay").text(dateSelectText);
			$(".inHotel .dateSelectDay").attr("data-year",date.year).attr("data-month",date.month).attr("data-day",date.day);
			$(".outHotel .dateSelectDay").text(dateSelectText);
			$(".outHotel .dateSelectDay").attr("data-year",date.year).attr("data-month",date.month).attr("data-day",date.day);

			var day = (parseInt(date.day)<10 ? "0"+date.day:date.day);

			var con = this.calendar1.CalendarBox.container;
			var columns = con.find(".calConItem.column");

			for( var i = 0;i<columns.length;i++){
				var col = columns.eq(i).find(".day").text();
				if(col == day){
					var nowSelectWeek = parseInt(columns.eq(i).attr("data-week"));
				}
			}
			var weekText = "";
			if(nowSelectWeek == 0){
				weekText = "日";
			}else if(nowSelectWeek == 1){
				weekText = "一";				
			}else if(nowSelectWeek== 2){
				weekText = "二";				
			}else if(nowSelectWeek== 3){
				weekText = "三";				
			}else if(nowSelectWeek== 4){
				weekText = "四";				
			}else if(nowSelectWeek == 5){
				weekText = "五";				
			}else if(nowSelectWeek== 6){
				weekText = "六";				
			}
			var tpl = '<span class="dateSelectWeek">周'+ weekText +'</span>';
			$(".inHotel .dateSelectDay").append(tpl);
			$(".outHotel .dateSelectDay").append(tpl);
			
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



















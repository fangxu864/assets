

var tpl = require("./index.xtpl");

var Calendar = require("../../calendar/index.js");

module.exports = function(parent,aid,pid,ddays){

	var container = $(tpl).appendTo(parent);
	
	var Hotel = PFT.Util.Class({
		container : container,
		EVENTS : {
			"click .inHotel" : "showCalendar1",
			"click .outHotel" : "showCalendar2"			
		},
		init : function(){

			var that = this;
			this.aid = aid;
			this.pid = pid;

			var dateGroup = this.getNowDate();	
			ddays = parseInt(ddays);
			dateGroup.day = dateGroup.day + ddays;
			var nowDate = dateGroup.nowDate + "-" +dateGroup.day; //有天数的

			this.calendar1 = new Calendar(nowDate,aid,pid);
			that.calendar2 = new Calendar(nowDate,aid,pid);

			this.calendar1.on("done",function(){
				
				that.calendar2.on("done",function(){
					that.setDate();//初始化时间
				});	

			});


		},

		setDate : function(){

			var that = this;

			// var date = this.getNowDate();
			//有天数的
			// var dateDay = date.nowDate + "-" +date.day;

			var list1 = that.calendar1.getNowMonthList();
			var list2 = that.calendar2.getNowMonthList();
			console.log(list1);
			console.log(list2);

			var solidDate1 = list1.eq(0);
			var solidDate2 = list2.eq(0);
			
			var allList1 = that.calendar1.container.find(".calConItem.column");
			allList1.each(function(i,item){
				$(item).removeClass("select");
			});
			solidDate1.addClass("select");
			var allList2 = that.calendar2.container.find(".calConItem.column");
			allList2.each(function(i,item){
				$(item).removeClass("select");
			});
			solidDate2.addClass("select");

			var dateDay1 = solidDate1.attr("data-date");
			var dateDay2 = solidDate2.attr("data-date");

			var date1 = (function(){
				var date = dateDay1.split("-");
				return {
					year : date[0],
					month : date[1],
					day : date[2]
				}
			})();

			var date2 = (function(){
				var date = dateDay2.split("-");
				return {
					year : date[0],
					month : date[1],
					day : date[2]
				}
			})();
			
			//初始化日期以供外部
			this.calendar1.selectedDay = dateDay1;
			this.calendar2.selectedDay = dateDay2;

			date1.month = parseInt(date1.month);
			date2.month = parseInt(date2.month);

			var dateSelectText1 = date1.month + "月" + date1.day + "日";
			var dateSelectText2 = date2.month + "月" + date2.day + "日";
			$(".inHotel .dateSelectDay").text(dateSelectText1);
			$(".inHotel .dateSelectDay").attr("data-year",date1.year).attr("data-month",date1.month).attr("data-day",date1.day);
			$(".outHotel .dateSelectDay").text(dateSelectText2);
			$(".outHotel .dateSelectDay").attr("data-year",date2.year).attr("data-month",date2.month).attr("data-day",date2.day);

			// var day = (parseInt(date.day)<10 ? "0"+date.day:date.day);

			var weekText1 = this.getWeek(1,date1.day);
			var weekText2 = this.getWeek(2,date2.day);

			var tpl1 = '<span class="dateSelectWeek">周'+ weekText1 +'</span>';
			var tpl2 = '<span class="dateSelectWeek">周'+ weekText2 +'</span>';
			$(".inHotel .dateSelectDay").append(tpl1);
			$(".outHotel .dateSelectDay").append(tpl2);
			
		},


		getWeek : function(select,day){

			if( select == 1){

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

			}else{

				var con = this.calendar2.CalendarBox.container;
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


			}
			
			return weekText

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



















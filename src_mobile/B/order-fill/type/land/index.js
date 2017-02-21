

var tpl = require("./index.xtpl");

var Calendar = require("../../calendar/index.js");

// var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");  //列表弹窗

// var GetCalendarPrice = require("../../service/getCalendarPrice.js");

module.exports = function(parent,aid,pid){


	var container = $(tpl).appendTo(parent);

	var Land = PFT.Util.Class({
		container : container,
		EVENTS : {
			"click #playDate":"showCalendar"
		},
		init : function(){

			var that = this;

			var dateGroup = this.getNowDate();	
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

		},















// 这之后的代码没有运行**********************************************************************************************************************************************










		// getCalPrice : function(change){

		// 	var that = this;

		// 	if(change == "change"){   

		// 		var dateGroup = {};
		// 		console.log("change");

		// 		dateGroup.year = this.nowYearFlag;
		// 		dateGroup.month = this.nowMonthFlag;
		// 		dateGroup.day = 0;

		// 		var date = dateGroup.year + "-" + dateGroup.month;

		// 		var params = {
		// 			token : PFT.Util.getToken(),
		// 			aid : this.aid,
		// 			pid : this.pid,
		// 			date : date
		// 		};

		// 		console.log(dateGroup.year);
		// 		console.log(dateGroup.month);
		// 		console.log(dateGroup.day);


		// 	}else{

		// 		var dateGroup = this.getNowDate();
		// 		var day = dateGroup.day; 
		// 		var month = dateGroup.month; 
		// 		var year = dateGroup.year; 
		// 		var date = year.toString() + "-" + month.toString() + "-" + day.toString();
		// 		var params = {
		// 			token : PFT.Util.getToken(),
		// 			aid : this.aid,
		// 			pid : this.pid,
		// 			date : date
		// 		};
					

		// 	}


		// 	GetCalendarPrice(params,{
		// 		loading:function () {},
		// 		success:function (res) {

		// 			that.handleCalPrice(res,dateGroup);

		// 		},
		// 		complete:function () {}
		// 	});	
			

		// },

		// handleCalPrice : function(res,dateGroup){

		// 	var PG = $("span.price");
		// 	for( var i in res){
		// 		for(var j = 0;j<PG.length;j++){
		// 			var data_day = PG.eq(j).attr("data-day");
		// 			dateGroup.month = parseInt(dateGroup.month);
		// 			dateGroup.month =(dateGroup.month<10 ? "0"+dateGroup.month:dateGroup.month);
		// 			var data_date = dateGroup.year+ "-" +dateGroup.month+ "-" +data_day;
		// 			if(data_date == i){
		// 				PG.eq(j).find("em").text(res[i]);
		// 			}
		// 		}
		// 	}		

		// 	var items = $(".calConItem.column"); 

		// 	for(var j = 0;j<items.length;j++){

		// 		if(items.eq(j).find('em').text() == ""){
		// 			items.eq(j).find('.yen').text("");
		// 			items.eq(j).addClass('disable');
		// 		}

		// 	}

			



		// 	var today = (dateGroup.day < 10&&dateGroup.day != 0 ? "0" + dateGroup.day : dateGroup.day); 	
		// 	var days = $(".calConItem.column .day");

		// 	if( dateGroup.day == 0 ){//日历改变月份
				
		// 		for( var n = 0 ; n<days.length ; n++){
		// 			var t = days.eq(n).text(); 
		// 			if( t == "01"){
		// 				var pItem = days.eq(n).parent();
		// 				pItem.addClass('select');
		// 			}
		// 		}	
					
		// 	}else{

		// 		for( var n = 0 ; n<days.length ; n++){
		// 			var t = days.eq(n).text(); 
		// 			if( t == today){
		// 				var pItem = days.eq(n).parent();
		// 				pItem.addClass('select');
		// 			}
		// 		}	

		// 	}

		// },

		// calDaySelect : function(e){
		// 	var target = $(e.target);
		// 	var tagName = target.attr("tagName");
		// 	if(tagName != "DIV"){
		// 		target = target.parent();
		// 		tagName = target.attr("tagName");
		// 		if(tagName != "DIV"){
		// 			target = target.parent();
		// 		}
		// 	}

		// 	if(target[0].className.indexOf("disable")>0){
		// 		return "disable"
		// 	}

		// 	target.addClass("select");
		// 	var nowTargetDate = target.find('.day').text();
		// 	var list = $(".calConItem.column");
		// 	for( var i = 0;i<list.length;i++){
		// 		var className = list[i].className;
		// 		if( className.indexOf("disable") < 0 ){//除去disable
					
		// 			var t = list.eq(i).find('.day').text();
		// 			if(t != nowTargetDate ){
		// 				list.eq(i).removeClass('select');
		// 			}
		// 		}
		// 	}

		// 	return nowTargetDate; //返回当前被选中的天数

		// },

		// changeCal : function(dir){

		// 	if(dir == "prev"){
		// 		if(this.nowMonthFlag > 1){
		// 			this.nowMonthFlag -= 1; 
		// 		}else{
		// 			this.nowMonthFlag = 12;
		// 			this.nowYearFlag -= 1;
		// 		}
		// 	}else if(dir == "next"){
		// 		if(this.nowMonthFlag < 12){
		// 			this.nowMonthFlag += 1; 
		// 		}else{
		// 			this.nowMonthFlag = 1;
		// 			this.nowYearFlag += 1;
		// 		}
		// 	}

		// 	var date = (this.nowYearFlag.toString()+'-'+this.nowMonthFlag.toString());

		// 	Calendar.change(date); //改变日历状态

		// 	this.getCalPrice("change");

		// }

	});


	return new Land;

}
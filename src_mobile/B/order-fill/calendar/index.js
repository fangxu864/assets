
require("./index.scss");

var CalendarCore = require("COMMON/js/calendarCore.js");

var tpl = require("./tpl/index.xtpl");
var listTpl = require("./tpl/list.xtpl");

var calendar = {

	init : function(nowDate){

		console.log(nowDate);

		var arr = CalendarCore.outputDate(nowDate);   

		console.log(arr);

		var data = {};
		data.list = arr;
		var date = {};
		date.nowDate = nowDate;

		//先写静态的
		this.Template = PFT.Util.ParseTemplate(tpl);
		this.listTemplate = PFT.Util.ParseTemplate(listTpl);

		var listHtml = this.listTemplate(data);
		var html = this.Template(date);

		return {
			html : html,
			listHtml : listHtml 
		} 

	},

	change : function(date){  //改变日历状态
		$(".calTopText").text(date);
		var arr = CalendarCore.outputDate(date); 
		var data = {};
		data.list = arr;  
		var listHtml = this.listTemplate(data);
		$(".calContentCon").html(listHtml);
	}

}



module.exports = calendar;

























/**
 * Author: huangzhiyang
 * Date: 2016/9/23 9:52
 * Description: ""
 */
require("./index.scss");
var Tpl = require("./index.xtpl");
var Head = PFT.Util.Class({
	EVENTS : {
		"click .navBtn" : "onNavBtnClick"
	},
	init : function(opt){
		this.CalendarCore = opt.CalendarCore;
		this.container.html(Tpl);
	},
	setYearmonth : function(yearmonth){
		this.__yearmonth = yearmonth ? yearmonth.substr(0,7) : this.CalendarCore.getnowYearMonth();
		this.container.find(".resultText").text(this.__yearmonth);
	},
	getYearmonth : function(){
		return this.__yearmonth;
	},
	onNavBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		var yearmonth = this.__yearmonth;
		var toYearmonth = "";
		var type = "";
		if(tarBtn.hasClass("next")){
			if(tarBtn.hasClass("monthBtn")){
				type = "nextMonth";
				toYearmonth = this.CalendarCore.nextMonth(yearmonth);
			}else{
				type = "nextYear";
				toYearmonth = this.CalendarCore.nextYear(yearmonth);
			}
		}else{
			if(tarBtn.hasClass("monthBtn")){
				type = "prevMonth";
				toYearmonth = this.CalendarCore.prevMonth(yearmonth);
			}else{
				type = "prevYear";
				toYearmonth = this.CalendarCore.prevYear(yearmonth);
			}
		}
		this.setYearmonth(toYearmonth);
		this.trigger("yearmonth.change",{
			type : type,
			from : yearmonth,
			to : toYearmonth,
			tarBtn : tarBtn
		})
	}
});
module.exports = Head;
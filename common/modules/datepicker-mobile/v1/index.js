/**
 * Author: huangzhiyang
 * Date: 2016/11/2 14:31
 * Description: ""
 */
var Defaults = {
	header : "",
	height : "auto",
	content : "",
	yesBtn : false,
	noBtn : false,
	zIndex : 1,
	EVENTS : {}
};
var SheetCore = require("COMMON/modules/sheet-core/v1");
var CalendarCore = require("COMMON/js/calendarCore");
var Tpl = {
	header : require("./tpl/header.xtpl")
};
var Datepicker = PFT.Util.Class({
	init : function(opt){
		var Sheet = this.Sheet = new SheetCore({
			header : Tpl.header
		})
	},
	calBoxCls : function(dateObj){
		var min = this.min;
		var max = this.max;
		var minMaxDisableCls = "";
		var date = dateObj.date;
		var dateStram = +new Date(date);
		var disableTodayBefore = this.disableTodaybefore;
		var cls = {
			empty : !dateObj.day,
			disable : typeof dateObj.price=="undefined",
			disableTodaybefore : (disableTodayBefore && dateObj.today=='before'),
			prevmonth : (dateObj.month!=='current' && dateObj.month < this.selected_month),
			nextmonth : (dateObj.month!=='current' && dateObj.month > this.selected_month),
			currentmonth : dateObj.month=='current',
			todaybefore : dateObj.today=='before',
			todayafter : dateObj.today=='after',
			today : dateObj.today=='today',
			selected : date==this.selected_date
		};
		if(min){
			min = +new Date(min);
			if(dateStram<=min) minMaxDisableCls = "minDisable";
		}
		if(max){
			max = +new Date(max);
			if(dateStram>=max) minMaxDisableCls = "maxDisable";
		}
		if(minMaxDisableCls) cls["minMaxDisable"] = true;
		if(minMaxDisableCls=="minDisable") cls["minDisable"] = true;
		if(minMaxDisableCls=="maxDisable") cls["maxDisable"] = true;

		return cls;

	},
	show : function(date,opt){
		if(typeof date!=="string") return false;
		var yearmonth = date.substring(0,7);
		var day = date.substring(8);
		console.log(yearmonth,day)
	},
	close : function(){

	}
});

module.exports = Datepicker;


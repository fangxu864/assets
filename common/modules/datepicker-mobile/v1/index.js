/**
 * Author: huangzhiyang
 * Date: 2016/11/2 14:31
 * Description: ""
 */
require("./index.scss");
var SheetCore = require("COMMON/modules/sheet-core/v1");
var CalendarCore = require("COMMON/js/calendarCore");
var Tpl = {
	header : require("./tpl/header.xtpl"),
	dates : require("./tpl/dates.xtpl")
};
var Datepicker = PFT.Util.Class({
	selected_year : "",
	selected_month : "",
	selected_day : "",
	option : {},
	init : function(){
		var Sheet = this.Sheet = new SheetCore({
			header : Tpl.header,
			noBtn : true
		})
	},
	template : PFT.Util.ParseTemplate(Tpl.dates),
	calBoxCls : function(dateObj){
		var min = this.option.min || "";
		var max = this.option.max || "";
		var selected_month = this.selected_month;
		var selected_day = this.selected_day || "";
		var disableTodayBefore = this.option.disableTodayBefore;

		var minMaxDisableCls = "";
		var date = dateObj.date;
		var day = dateObj.day;
		var dateStram = +new Date(date);

		var cls = {
			empty : !dateObj.day,
			disableTodaybefore : (disableTodayBefore && dateObj.today=='before'),
			prevmonth : (dateObj.month!=='current' && dateObj.month < selected_month),
			nextmonth : (dateObj.month!=='current' && dateObj.month > selected_month),
			currentmonth : dateObj.month=='current',
			todaybefore : dateObj.today=='before',
			todayafter : dateObj.today=='after',
			today : dateObj.today=='today',
			selected : day==selected_day
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


		var clsname = [];
		for(var i in cls) if(cls[i]) clsname.push(i);

		return clsname.join(" ");

	},
	renderDate : function(date,opt){
		var that = this;
		var yearmonth = date.substring(0,7);
		var day = date.substring(8);
		var dates = CalendarCore.outputDate(yearmonth);
		for(var i=0; i<dates.length; i++){
			var group = dates[i];
			for(var g=0; g<group.length; g++){
				var date = group[g];
				date["cls"] = that.calBoxCls(date);
			}
		}
		var html = this.template({data:{
			dates : dates,
			option : opt
		}});
		this.Sheet.setContent(html);
	},
	/**
	 * 主方法
	 * @param {string} date                    2016-10-10 || 2016-10
	 * @param {string} opt.min                 最小日期
	 * @param {string} opt.max                 最大日期
	 * @param {string} opt.disableTodayBefore  今天之前的日期是否都置为disable
	 * @returns {boolean}
	 */
	show : function(date,opt){
		if(typeof date!=="string") return false;
		var defaults = {
			min : "",
			max : "",
			disableTodayBefore : false
		};
		this.option = opt = $.extend(defaults,opt || {});
		var yearmonth = date.substring(0,7);
		this.selected_day = date.substring(8);
		this.selected_month = yearmonth.split("-")[1];
		this.renderDate(date,opt);
		this.Sheet.show();
	},
	close : function(){
		this.Sheet.close();
	}
});

module.exports = Datepicker;


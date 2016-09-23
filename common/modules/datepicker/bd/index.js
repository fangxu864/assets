/**
 * Author: huangzhiyang
 * Date: 2016/9/23 9:52
 * Description: ""
 */
require("./index.scss");
var Tpl = require("./index.xtpl");
var DateTpl = require("./date.xtpl");
var Bd = PFT.Util.Class({
	init : function(opt){
		this.CalendarCore = opt.CalendarCore;
		this.container.html(Tpl);
	},
	template : PFT.Util.ParseTemplate(DateTpl),
	render :function(date,opt){
		var yearmonth = date.substr(0,7);
		var dateList = this.CalendarCore.outputDate(yearmonth);
		var min = opt.min ? +new Date(opt.min) : "";
		var max = opt.max ? +new Date(opt.max) : "";
		var todayBeforeDisable = !!opt.todayBeforeDisable;
		var todayAfterDisable = !!opt.todayAfterDisable;
		var today = +new Date(this.CalendarCore.gettoday());
		if(todayBeforeDisable){
			if(!min){
				min = today;
			}else{
				if(min<=today) min = today;
			}
		}
		if(todayAfterDisable){
			if(!max){
				max = today;
			}else{
				if(max>=today) max = today;
			}
		}
		opt["min"] = min;
		opt["max"] = max;
		opt["default_day"] = opt["default_day"] ? (+new Date(opt.default_day)) : "";
		var html = this.template({data:{
			dates : dateList,
			option : opt
		}});
		this.container.find(".dateBodyContainer").html(html);
	}
});
module.exports = Bd;
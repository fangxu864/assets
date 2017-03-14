/**
 * Author: huangzhiyang
 * Date: 2016/9/22 18:35
 * Description: ""
 */
require("./index.scss");
var Help = require("./help");
var CalendarCore = require("COMMON/js/calendarCore");
var Head = require("./head");
var Bd = require("./bd");
var Foot = require("./foot");
var Timepicker = require("./timepicker");
var Datepicker = PFT.Util.Class({
	init : function(opt){
		var that = this;
		opt = opt || {};

		var container = this.container = this.initContainer(opt);

		this.head = this.initHead(container);
		this.head.on("yearmonth.change",function(data){
			var to = data.to;
			this.renderDate(to,this.__cacheOpt);
		},this)

		this.bd = this.initBd(container);

		this.timepicker = this.initTimepicker(container);

		this.ft = this.initFt(container);

		this.mask = this.initMask();

		this.on("switch",function(data){
			var picker = this.__cacheOpt.picker;
			var orignVal = picker.val();
			var timeLine = {
				hour : true,
				minu : true,
				second : true
			};
			container.find(".timeLine").each(function(){
				var item = $(this);
				if(item.hasClass("hour")) timeLine.hour = item.css("display")!=="none";
				if(item.hasClass("minu")) timeLine.minu = item.css("display")!=="none";
				if(item.hasClass("second")) timeLine.second = item.css("display")!=="none";
			});

			var result = "";
			var _data = data.data;
			result += _data.date;
			if(timeLine.hour) result += (" " + _data.hour);
			if(timeLine.minu) result += (":" + _data.minu);
			if(timeLine.second) result += (":" + _data.second);


			if(picker[0].tagName.toLocaleLowerCase()=="input"){
				picker.val(result);
			}else{
				picker.text(result);
			}
			var onAfter = this.__cacheOpt.onAfter;
			onAfter && onAfter(data.result,orignVal);
			this.__cacheOpt = {};
		},this)
	},
	initContainer : function(opt){
		var body = $("body");
		var uuid = Help.getUUID();
		var container = typeof opt.container==="string" ? $(opt.container) : opt.container;
		if(!container){
			container = $('<div id="pftui-datepicker-container-'+uuid+'" class="pftui-datepicker-container"></div>').appendTo(body);
		}
		return container;
	},
	initHead : function(container){
		var header_dom = $('<div class="pftui-datepicker-head"></div>').appendTo(container);
		return new Head({
			container : header_dom,
			CalendarCore : CalendarCore
		});
	},
	initBd : function(container){
		var bd_dom = $('<div class="pftui-datepicker-bd"></div>').appendTo(container);
		var bd = new Bd({
			container : bd_dom,
			CalendarCore : CalendarCore
		});
		bd.on("td.click",function(tarTd){
			if(!this.ft.isShow){
				this.close();
				this.trigger("switch",this.getActiveParams({tarTd:tarTd}));
			}
		},this)
		return bd;
	},
	initFt : function(container){
		var foot_dom = $('<div class="pftui-datepicker-foot"></div>').appendTo(container);
		var ft = new Foot({
			container : foot_dom
		});
		ft.on("current",function(){
			this.close();
			this.trigger("switch",this.getActiveParams());
		},this);
		ft.on("yes",function(){
			this.close();
			var tarTd = this.bd.getActiveTd();
			var time = this.timepicker.getTime();
			if(!tarTd.length) return;
			this.trigger("switch",this.getActiveParams({tarTd:tarTd,time:time}));
		},this);
		ft.on("cannel",function(){
			this.close()
		},this);
		return ft;
	},
	initTimepicker : function(container){
		var timepickerContainer_dom = $('<div class="pftui-timepicker-container"></div>').appendTo(container);
		return new Timepicker({container:timepickerContainer_dom});
	},
	initMask : function(){
		var that = this;
		var mask = $("#pftui-datepicker-mask");
		if(!mask.length){
			mask = $('<div id="pftui-datepicker-mask" class="pftui-datepicker-mask"></div>').appendTo($("body"));
			mask.on("click",function(e){
				that.close();
			})
		}
		return mask;
	},
	renderDate : function(date,opt){
		var _date = typeof date=="string" ? date : CalendarCore.getnowYearMonth();
		opt = opt || {};
		this.head.setYearmonth(_date);
		this.bd.render(_date,opt);
	},
	getActiveParams : function(opt){
		opt = opt || {};
		var result = {};
		var tarTd = opt.tarTd;
		var time = opt.time;
		if(tarTd && !time){
			result = {
				type : "date",
				result : tarTd.attr("data-date"),
				data : {
					tarTd : tarTd,
					id : tarTd.attr("id"),
					day : tarTd.attr("data-day"),
					date : tarTd.attr("data-date"),
					yearmonth : tarTd.attr("data-yearmonth"),
					week : tarTd.attr("data-week")
				}
			};
		}else if(tarTd && time){ //确定
			result = {
				type : "datetime",
				result : tarTd.attr("data-date") + " " + time,
				data : {
					tarTd : tarTd,
					id : tarTd.attr("id"),
					day : tarTd.attr("data-day"),
					date : tarTd.attr("data-date"),
					yearmonth : tarTd.attr("data-yearmonth"),
					week : tarTd.attr("data-week"),
					time : time,
					hour : time.split(":")[0],
					minu : time.split(":")[1],
					second : time.split(":")[2]
				}
			}
		}else{ //现在
			var nowDateTime = CalendarCore.getNowDateTime();
			var datetime = nowDateTime.split(" ");
			var date = datetime[0];
			var dateArr = date.split("-");
			var year = dateArr[0];
			var month = dateArr[1];
			var day = dateArr[2];
			var _time = datetime[1];
			var timeArr = _time.split(":");
			var hour = timeArr[0];
			var minu = timeArr[1];
			var second = timeArr[2];
			result = {
				type : "datetime",
				result : nowDateTime,
				data : {
					date : date,
					year :year,
					month : month,
					day : day,
					time : time,
					hour : hour,
					minu : minu,
					second : second
				}
			}
		}
		result["picker"] = this.__cacheOpt.picker;
		return result;
	},
	position : function(tarDom){
		if(!tarDom) return false;
		var offset = tarDom.offset();
		var top = this.__cacheOpt.top || 0;
		var left = this.__cacheOpt.left || 0;
		var height = tarDom.outerHeight();
		this.container.css({
			left : left + offset.left,
			top : top + offset.top + height
		})
	},
	//对外暴露的核心方法
	//date= "2016-09" | "2016-09-10" | "2016-09-10 10" | "2016-09-10 10:32" | "2016-09-10 10:32:48"
	open : function(date,opt){
		date = $.trim(date);
		opt = opt || {};
		opt["default_day"] = date.substr(8,2) ? date.substr(0,10) : "";
		opt["default_date"] = date;
		opt["init_date"] = date;
		var before = opt.onBefore || function(){};
		var after = opt.onAfter || function(){};
		var picker = opt.picker;
		var hour = date.substr(11,2) || "";
		var minu = date.substr(14,2) || "";
		var second = date.substr(17,2) || "";
		if(date.length<=10){
			this.timepicker.hide();
			this.ft.hide();
		}else{
			this.timepicker.show();
			this.timepicker.setTime(hour,minu,second);
			this.ft.show();
		}
		before();
		this.mask.show();
		this.__cacheOpt = opt;
		this.container.show();
		this.position(picker);
		this.renderDate(date,opt);
	},
	show : function(date,opt){
		this.open(date,opt);
	},
	close : function(){
		this.container.hide();
		this.mask.hide();
	},
	hide : function(){
		this.close();
	}
});

Datepicker.CalendarCore = CalendarCore;

module.exports = Datepicker;




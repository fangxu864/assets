/**
 * Author: huangzhiyang
 * Date: 2016/6/6 18:34
 * Description: ""
 */
require("./style.css");
var CalendarCore = require("../../js/CalendarCore.js");
var fn = new Function();
var Calendar = function(opt){
	this.selected = {};
	this.curYearmonth = "";
	this.__callback = {};
	this.init(opt);
};
Calendar.prototype = {
	init : function(opt){
		var that = this;
		var opt = opt || {};
		//显示的容器
		this.container = opt.container || $('<div id="calendar-pop-container" class="calendar-pop-contaienr"></div>').appendTo($("body"));
		this.containerID = this.container.attr("id");
		this.selected[this.containerID] = [];
		//是否支持多选日期 默认不支持
		this.mult = typeof opt.mult=="boolean" ? opt.mult : false;
		//模板
		this.tpl = opt.tpl || require("./calendar-tpl.html");

		this.template = _.template(this.tpl);

		this.maskID = this.containerID+"-mask";

		this.mask = $("#"+this.maskID);
		if(!this.mask.length){
			this.mask = $('<div id="'+this.maskID+'" class="calendar-mask"></div>');
			this.mask.appendTo($("body"));
		}

		this.bindEvents();
	},
	bindEvents : function(){
		var that = this;
		this.container.on("click",".calendar-td",function(e){
			that.onTdClick(that,e);
			return false;
		})
		this.container.on("click",".monthNavBtn",function(e){
			that.onMonthBtnClick(that,e);
			return false;
		})
		this.mask.on("click",function(e){
			that.close();
		})
	},
	showDate : function(yearmonth,opt){
		var that = this;
		var opt = opt || {};
		var containerID = this.containerID;
		var yearmonth = yearmonth || this.getYearMonth();
		var new_yearmonth = yearmonth.substring(0,7);
		var container = this.container;
		var onBefore = opt.onBefore || fn;
		var onAfter = opt.onAfter || fn;
		that.fire("showDate.before",yearmonth);
		onBefore();
		var html = this.render(new_yearmonth,opt);
		container.html(html);
		that.fire("showDate.after",yearmonth);
		onAfter();
		this.setCurYearmonth(new_yearmonth);
		setTimeout(function(){
			$("#"+containerID+"-calendar-td-"+yearmonth).addClass("selected");
		},10)
	},
	//点击选中某天
	onTdClick : function(that,e){
		var mult = that.mult;
		var tarTd = $(e.currentTarget);
		if(tarTd.hasClass("empty") || tarTd.hasClass("disable")) return false;
		var day = tarTd.attr("data-day");
		var date = tarTd.attr("data-date");
		var week = tarTd.attr("data-week");
		var yearmonth = tarTd.attr("data-yearmonth");
		tarTd.toggleClass("selected");
		var type = tarTd.hasClass("selected") ? "select" : "cancel";
		if(!mult){
			that.container.find(".calendar-td").removeClass("selected"); //单选模式下先清空所有日期的选中状态
			if(type=="select") tarTd.addClass("selected");
		}
		var params = {
			tarDom : tarTd,
			type : type,
			date : date,
			week : week,
			day : day,
			yearmonth : yearmonth
		}
		var selected = that.selected[that.containerID];
		if(type=="select"){ //选中
			if(!mult){ //如果只能单先，需先把上次选中的清理掉
				selected.splice(0,1);
			}
			selected.push(params);
		}else{ //取消选中
			for(var i in selected){
				var select = selected[i];
				var d = select.tarDom.attr("data-date");
				if(date==d){
					selected.splice(i,1);
					break;
				}
			}
		}
		that.setCurYearmonth(yearmonth+"-"+day);
		var picker = that.__onShowOptions.picker;
		if(picker){
			picker.val(params.date);
			that.close()
		}
		that.fire("click",params);
		that.fire("select",params);
	},
	onMonthBtnClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		var curYearMonth = that.getCurYearmonth();
		var toYearMonth = tarBtn.hasClass("next") ? CalendarCore.nextMonth(curYearMonth) : CalendarCore.prevMonth(curYearMonth);
		that.showDate(toYearMonth,that.__onShowOptions);
	},
	getYearMonth : function(date){
		var date = date ||  CalendarCore.gettoday();
		var yearmonth = date.length==10 ? date.substring(0,7) : date;
		return yearmonth;
	},
	render : function(yearmonth,opt){
		if(!yearmonth) return "";
		var containerID = this.containerID;
		var date = CalendarCore.outputDate(yearmonth);
		var min = opt.min; //最小日期
		var max = opt.max;
		var html = this.template({data:{
			containerID : containerID,
			yearmonth : yearmonth,
			dates : date,
			min : min,
			max : max
		}});
		return html;
	},
	//获取当前日历上显示的年月份
	getCurYearmonth : function(){
		return this.curYearmonth;
	},
	setCurYearmonth : function(yearmonth){
		this.curYearmonth = yearmonth;
		$("#"+this.containerID+"-top-calendar-date").text(this.curYearmonth);
	},
	position : function(data){
		var top = data.top;
		var left = data.left;
		this.container.css({
			top : top,
			left : left
		})
	},
	show : function(date,opt){
		opt = opt || {};
		var picker = opt.picker;
		var left = opt.left || 0;
		var top = opt.top || 0;
		this.__onShowOptions = opt;
		if(picker){
			var offset = picker.offset();
			var height = picker.outerHeight(true);
			this.position({
				left : offset.left+left,
				top : offset.top+height+top
			});
		}
		this.container.show();
		this.showDate(date,opt);
		this.mask.show();
	},
	close : function(){
		this.container.hide();
		this.mask.hide();
		this.__onShowOptions = {};
	},
	on : function(type,callback){
		if(typeof type!=="string") return false;
		var __callback = this.__callback;
		var cak = __callback[type] || (this.__callback[type]=[]);
		if(typeof callback==="function"){
			cak.push(callback);
		}
	},
	fire : function(type){
		var that = this;
		if(typeof type!=="string") return false;
		var arr = this.__callback[type];
		if(!arr) return false;
		var args = Array.prototype.slice.call(arguments,1);
		for(var i in arr){
			var callback = arr[i];
			callback.apply(that,args);
		}
	},
	trigger : function(type){
		this.fire(type);
	}
};
module.exports = Calendar;
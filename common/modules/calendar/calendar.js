/**
 * Created by Administrator on 16-2-18.
 * ##how to use

 #一个页面只能new一个Calendar
 var calendar = new Calendar();

 #当点击日历，选中某一日期时
 calendar.on("select",function(data){
    console.log(data)
})

 #主要方法
 calendar.show("2016-06-31",{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
    picker : $input,             //页面上点击某个picker弹出日历(请使用input[type=text])
    top : 0,                     //日历box偏移量
    left : 0,                    //日历box偏移量
    min : "2016-06-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
    max : "2016-07-10",          //2016-07-10往后的日期都不可选 会自动挂上disable类名
    onBefore : function(){},     //弹出日历前callback
    onAfter : function(){}       //弹出日历后callback
})
 */
require("./style.css");
var CalendarCore = require("../../js/CalendarCore.js");
var fn = new Function();
var Calendar = RichBase.extend({
	selected : {},
	curYearmonth : "",
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
		var html = this.render(new_yearmonth);
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
		if(tarTd.hasClass("empty")) return false;
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
		that.fire("click",params)
	},
	onMonthBtnClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		var curYearMonth = that.getCurYearmonth();
		var toYearMonth = tarBtn.hasClass("next") ? CalendarCore.nextMonth(curYearMonth) : CalendarCore.prevMonth(curYearMonth);
		that.showDate(toYearMonth);
	},
	getYearMonth : function(date){
		var date = date ||  CalendarCore.gettoday();
		var yearmonth = date.length==10 ? date.substring(0,7) : date;
		return yearmonth;
	},
	render : function(yearmonth){
		if(!yearmonth) return "";
		var containerID = this.containerID;
		var date = CalendarCore.outputDate(yearmonth);
		var html = this.template({data:{
			containerID : containerID,
			yearmonth : yearmonth,
			dates : date
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
		this.container.show();
		this.showDate(date,opt);
		this.mask.show();
	},
	close : function(){
		this.container.hide();
		this.mask.hide();
	}
});
module.exports = Calendar;
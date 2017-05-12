/**
 * Created by Administrator on 16-2-18.
 */
var fn = new Function();
var Calendar = RichBase.extend({
	selected : {},
	curYearmonth : "",
	init : function(opt){
		var that = this;
		var opt = opt || {};
		//显示的容器
		this.container = opt.container || $("#calendarWrap");
		this.containerID = this.container.attr("id");
		this.selected[this.containerID] = [];
		//是否支持多选日期 默认不支持
		this.mult = typeof opt.mult=="boolean" ? opt.mult : false;
		//模板
		this.tpl = opt.tpl || $("#tpl-calendar").html();

		this.template = _.template(this.tpl);

		this.bindEvents();
	},
	bindEvents : function(){
		var that = this;
		this.container.on("click",".calendar-td",function(e){
			that.onTdClick(that,e);
		})
		this.container.on("click",".monthNavBtn",function(e){
			that.onMonthBtnClick(that,e)
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
	},
	close : function(){
		this.container.hide();
	}
});
module.exports = Calendar;
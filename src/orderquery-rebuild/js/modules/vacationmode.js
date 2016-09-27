/**
 * Author: huangzhiyang
 * Date: 2016/9/26 18:37
 * Description: ""
 */
require("../../css/vacationmode.scss");
var Tip = {
	datePicker : function(){
		return "仅可查询30天数据，如有需要可在15:00至17:00之间查询更多数据";
	},
	report : function(){
		return '<p style="font-size:14px; font-weight:bold" class="tit">限时使用</p><p class="desc">为保障假日期间平台运行稳定，2016年10月1日至10月6日限时使用该功能，如有需要可在15:00至17:00之间登录使用，给您带来不便敬请谅解！</p>';
	}
};
var DatePicker = require("COMMON/modules/datepicker");
var Main = {
	init : function(){

		var useLimit = this.useLimit = $("#useLimitHidInp").val();
		var queryLimit = this.queryLimit = $("#queryLimitHidInp").val();
		var clickLoad = this.clickLoad = $("#clickLoadHidInp").val();
		var reportData = this.reportData = $("#reportDataHidInp").val();

		this.initDatepicker();

		if(useLimit==0) return false;

		if(queryLimit==1) this.initDateHover();
		if(reportData==1) this.initReportHover();

	},
	initDatepicker : function(){
		var that = this;
		var datepicker = this.datepicker = new DatePicker();
		$("#datetimepicker_begin").on("click",function(e){
			var tarInp = $("#btimeInp");
			var endInp = $("#etimeInp");
			var endtime = endInp.val();
			var date = tarInp.val();
			if(!date) date = DatePicker.CalendarCore.gettoday() + " 00:00:00";
			var max = endtime ? endtime.substr(0,10) : "";
			datepicker.open(date,{
				picker : tarInp,
				todayAfterDisable : true,
				max : max
			});
		})
		$("#datetimepicker_end").on("click",function(e){
			var tarInp = $("#etimeInp");
			var beginInp = $("#btimeInp");
			var beingTime = beginInp.val();
			var beginDate = beingTime.substr(0,10);
			var date = tarInp.val();
			if(!date) date = DatePicker.CalendarCore.gettoday() + " 23:59:59";
			var min = beingTime ? beingTime.substr(0,10) : "";
			datepicker.open(date,{
				picker : tarInp,
				todayAfterDisable : true,
				min : min,
				onBefore : function(){

				},
				onAfter : function(val,oldVal){
					var endDate = val.substr(0,10);
					if(endDate && beginDate && this.queryLimit==1){
						var begin_str = +new Date(beginDate);
						var end_str = +new Date(endDate);
						if(end_str-begin_str >= (30*24*60*60*1000)){
							alert("最多只能查询30天以内数据");
							tarInp.val(oldVal);
						}
					}
				}
			});
		})
	},
	initDateHover : function(){
		var that = this;
		$("#datetimepicker_begin").on("mouseenter",function(e){
			that.dateTimePickerHover(e);
		}).on("mouseleave",function(e){
			$("#tooltipContainer").hide();
		})
		$("#datetimepicker_end").on("mouseenter",function(e){
			that.dateTimePickerHover(e);
		}).on("mouseleave",function(e){
			$("#tooltipContainer").hide();
		})
	},
	initReportHover : function(){
		var that = this;
		$("#exportExeclBtn").off("click").addClass("disable").on("mouseenter",function(e){
			var tarDom = $(e.currentTarget);
			var text = Tip.report();
			that.hover(tarDom,text);
		}).on("mouseleave",function(e){
			$("#tooltipContainer").hide();
		})
	},
	dateTimePickerHover : function(e){
		var tarDom = $(e.currentTarget);
		var text = Tip.datePicker();
		this.hover(tarDom,text);
	},
	hover : function(tarDom,text){
		var offset = tarDom.offset();
		var left = offset.left;
		var top = offset.top;
		var tooltipContainer = $("#tooltipContainer");
		if(!tooltipContainer.length){
			tooltipContainer = $('<div id="tooltipContainer" class="tooltipContainer"><div class="con"><div class="inCon"></div></div></div>').appendTo($("body"));
			tooltipContainer.on("mouseover",function(e){
				$(this).show();
			})
			tooltipContainer.on("mouseleave",function(e){
				$(this).hide();
			})
		}
		tooltipContainer.show().find(".inCon").html(text);
		setTimeout(function(){
			var off = (tooltipContainer.width()-tarDom.width())/2;
			var height = tooltipContainer.outerHeight();
			tooltipContainer.css({top:top-height,left:left-off})
		},10)
	}
};

module.exports = Main;
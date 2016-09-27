/**
 * Author: huangzhiyang
 * Date: 2016/9/27 11:29
 * Description: ""
 */
require("./vacationmode.scss");
var Tip = {
	datePicker : function(){
		var tip = $("#queryLimitTipHidInp").val();
		return tip ? tip : "仅可查询30天数据，如有需要可在15:00至17:00之间查询更多数据";
	},
	report : function(){
		var tip = $("#reportLimitTipHidInp").val();
		tip = tip || "为保障假日期间平台运行稳定，2016年10月1日至10月6日限时使用该功能，如有需要可在15:00至17:00之间登录使用，给您带来不便敬请谅解！";
		return '<p style="font-size:14px; font-weight:bold" class="tit">限时使用</p><p class="desc">'+tip+'</p>';
	}
};
var Main = {
	init : function(opt){

		opt = opt || {};

		this.beginTimeHoverTrigger = opt.beginTimeHoverTrigger;
		this.endTimeHoverTrigger = opt.endTimeHoverTrigger;
		this.reportHoverTrigger = opt.reportHoverTrigger;


		var useLimit = this.useLimit = $("#useLimitHidInp").val();
		var queryLimit = this.queryLimit = $("#queryLimitHidInp").val();
		var clickLoad = this.clickLoad = $("#clickLoadHidInp").val();
		var reportData = this.reportData = $("#reportDataHidInp").val();

		if(useLimit==0) return false;

		if(queryLimit==1) this.initDateHover();
		if(reportData==1) this.initReportHover();

	},
	initDateHover : function(){
		var that = this;
		this.beginTimeHoverTrigger.on("mouseenter",function(e){
			that.dateTimePickerHover(e);
		}).on("mouseleave",function(e){
			$("#tooltipContainer").hide();
		})
		this.endTimeHoverTrigger.on("mouseenter",function(e){
			that.dateTimePickerHover(e);
		}).on("mouseleave",function(e){
			$("#tooltipContainer").hide();
		})
	},
	initReportHover : function(){
		var that = this;
		this.reportHoverTrigger.off("click").addClass("disable").on("mouseenter",function(e){
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

Main.Tip = Tip;

module.exports = Main;
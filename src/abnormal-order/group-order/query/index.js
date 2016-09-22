/**
 * Author: huangzhiyang
 * Date: 2016/9/20 10:06
 * Description: ""
 */
require("./index.scss");
var Calendar = require("COMMON/modules/calendar");
var Service = require("../api.service").Query;
var Loading = require("COMMON/js/util.loading.pc");
var Loading_Text = Loading("努力加载中...",{
	tag : "tr",
	colspan : 7,
	height : 500,
	style : "background-color:#'fff'",
	className : "listLoadingTr"
});
var Tpl = require("./index.xtpl");
var PaginationX = require("COMMON/modules/pagination-x");
var Query = PFT.Util.Class({
	container : "#tabPannel-query",
	EVENTS : {
		"click #query-searchBox .query-timeInp" : "onTimeInpClick",
		"click #query-searchBox .searchBtn" : "onSearchBtnClick",
		"keyup #query-searchBox .query-orderInp" : "onOrderInpKeyup",
		"mouseenter .showTitle" : "onShowTitleMouseenter",
		"mouseleave .showTitle" : "onShowTitleMouseleave"
	},
	template : PFT.Util.ParseTemplate(Tpl),
	init : function(){
		var that = this;
		this.beginTimeInp = $("#query-beginTimeInp");
		this.endTimeInp = $("#query-endTimeInp");
		this.orderInp = $("#query-orderInp");
		this.searchBtn = $("#query-searchBtn");
		this.tbody = $("#query-tbody");

		this.offsetTop = $("#rtWrap").offset().top;

		this.datepicker = new Calendar();

		this.datepicker.on("select",function(data){});

		var days = this.getDefaultDate();
		this.beginTimeInp.val(days.day_7_age);
		this.endTimeInp.val(days.today);


		that.pagination = new PaginationX({
			container : "#query-paginationContainer",
			count : 7,
			showTotal : true,
			jump : true
		})
		that.pagination.on("page.switch",function(toPage,current,total){
			that.query(1);
		})
		//that.searchBtn.trigger("click");
	},
	//页面初始化时，日期默认显示近7天
	getDefaultDate : function(){
		var core = Calendar.Core;
		var today = core.gettoday();
		var day_7_ago = core.prevDays(today,7)[6]; //7天前是哪一天
		return{
			today : today,
			day_7_age : day_7_ago
		}
	},
	getParmas : function(){
		return{
			beginTime : this.beginTimeInp.val(),
			endTime : this.endTimeInp.val(),
			ordernum : $.trim(this.orderInp.val())
		};
	},
	onShowTitleMouseenter : function(e){
		var tarDom = $(e.currentTarget);
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
		tooltipContainer.show().find(".inCon").html(tarDom.attr("data-title") || "");
		setTimeout(function(){
			var off = (tooltipContainer.width()-tarDom.width())/2;
			var height = tooltipContainer.outerHeight();
			tooltipContainer.css({top:top-height,left:left-off})
		},10)
	},
	onShowTitleMouseleave : function(e){
		$("#tooltipContainer").hide();
	},
	onOrderInpKeyup : function(e){
		this.searchBtn.trigger("click");
	},
	onSearchBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		this.query(1);
	},
	onTimeInpClick : function(e){
		var tarInp = $(e.currentTarget);
		var date = tarInp.val();
		var min="",max="";
		if(tarInp.hasClass("begin")){
			max = this.endTimeInp.val();
		}else{
			min = this.beginTimeInp.val();
		}
		this.datepicker.show(date,{
			picker : tarInp,
			top : 1,
			max : max,
			min : min
		});
	},
	query : function(toPage){
		toPage = toPage || 1;
		var params = this.getParmas();
		params["currentPage"] = toPage;
		Service.query(params,{
			debug : true,
			loading : function(){
				this.searchBtn.addClass("disable");
				this.pagination.render(null);
				this.tbody.html(Loading_Text);
				$("html,body").animate({scrollTop:this.offsetTop},150);
			},
			complete : function(){
				this.searchBtn.removeClass("disable");
				this.tbody.html("");
			},
			success : function(data){
				var list = data.data;
				var currentPage = data.page;
				var totalPage = data.totalPage;
				var html = this.template({data:list});
				this.tbody.html(html);
				this.pagination.render({current:currentPage,total:totalPage});
			},
			empty : function(){}
		},this)
	},
	disable : function(){
		$("#query-paginationContainer").hide();
		this.container.hide();
	},
	enable : function(){
		console.log("enable")
		var currentPage = this.pagination.getCurrentPage();
		var totalPage = this.pagination.getTotalPage();
		if(totalPage && totalPage>=1) this.pagination.render({current:currentPage,total:totalPage});
		this.container.show();
	}
});

module.exports = Query;





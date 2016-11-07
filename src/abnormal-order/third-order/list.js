/**
 * Author: huangzhiyang
 * Date: 2016/9/12 15:14
 * Description: ""
 */
var Loading = require("COMMON/js/util.loading.pc");
var Loading_Text = Loading("努力加载中...",{
	tag : "tr",
	colspan : 9,
	height : "700",
	className : "listLoadingTr"
});
var Service = require("./api.service");
var Tpl = require("./index.xtpl");
var PaginationX = require("COMMON/modules/pagination-x");

var List = PFT.Util.Class({
	container : "#tbody",
	EVENTS : {
		"click .actionBtn" : "onActionBtnClick",
		"mouseenter .showTitle" : "onShowTitleMouseenter",
		"mouseleave .showTitle" : "onShowTitleMouseleave"
	},
	init : function(search){
		var that = this;
		this.offsetTop = $("#rtWrap").offset().top;
		this.offsetTop2 = this.offsetTop + ($("#rtWrap").find(".rtNav").height()) + $("#searchContainer").outerHeight();
		this.Search = search;
		var pagination = this.pagination = new PaginationX({
			container : "#paginationXContainer",
			count : 7,
			showTotal : true,
			jump : true
		});
		pagination.on("page.switch",function(toPage,currentPage,totalPage){
			var params = that.Search.getParams();
			params["currentPage"] = toPage;
			that.fetchList(params,that.offsetTop2);
		});
	},
	template : PFT.Util.ParseTemplate(Tpl),
	fetchList : function(params,offsetTop){
		Service.fetchList(params,{
			debug : false,
			loading : function(){
				this.container.html(Loading_Text);
				this.pagination.render(null);
				this.Search.disable();
				$("html,body").animate({scrollTop:offsetTop || this.offsetTop},150);
			},
			complete : function(){
				this.container.html("");
				this.Search.enable();
			},
			success : function(data){
				var type=data.type;
				if(type){
					$(".col.col_5_1").hide()
				}else{
					$(".col.col_5_1").show()
				}
				var currentPage = data.page;
				var totalPage = data.totalPage;
				var html = this.template({data : data.data});
				this.container.html(html);
				this.pagination.render({current:currentPage,total:totalPage});
			},
			empty : function(data){
				this.container.html('<tr><td style="text-align:center; height:200px" colspan="9">暂无数据...</td></tr>');
				this.pagination.render(null);
			}
		},this);
	},
	onActionBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var mode = tarBtn.attr("data-mode");
		var tnum = tarBtn.attr("data-tnum");
		var orderNum = tarBtn.attr("data-ordernum");
		if(!mode) return false;
		this.doAction({
			mode : mode,
			tnum : tnum,
			orderNum : orderNum
		},tarBtn);
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
	//强制退票 & 强制核销
	doAction : function(params,tarBtn){
		Service.doAction(params,{
			loading : function(){
				tarBtn.attr("data-text",tarBtn.html()).addClass("disable").html('<img src="'+PFT.LOADING_IMG_GIF+'"/><span class="t">请稍后..</span>');
			},
			complete : function(){
				tarBtn.html(tarBtn.attr("data-text")).removeClass("disable").removeAttr("data-text");
			},
			success : function(data){
				PFT.Util.STip("success",'<div style="200px">操作成功</div>');
				tarBtn.remove();
			}
		},this);
	}
});
module.exports = List;
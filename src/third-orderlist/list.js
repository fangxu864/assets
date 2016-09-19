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
			debug : true,
			loading : function(){
				this.container.html(Loading_Text);
				this.pagination.render(null);
				this.Search.disable();
				$("html,body").animate({scrollTop:offsetTop || this.offsetTop});
			},
			complete : function(){
				this.container.html("");
				this.Search.enable();
			},
			success : function(data){
				var currentPage = data.page;
				var totalPage = data.totalPage;
				var html = this.template({data : data.data});
				this.container.html(html);
				this.pagination.render({current:currentPage,total:totalPage});
			},
			empty : function(data){
				listUl.html('<tr><td style="text-align:center; height:200px" colspan="7">暂无数据...</td></tr>');
				pagination.render(null);
			}
		},this);
	},
	onDoActionBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var action = tarBtn.attr("data-action");
		if(action) this.action[action](tarBtn);
	},
	action : {
		//退票
		tuipiao : function(tarBtn){

		},
		//核消
		hexiao : function(tarBtn){

		}
	}
});
module.exports = List;
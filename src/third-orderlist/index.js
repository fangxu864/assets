/**
 * Author: huangzhiyang
 * Date: 2016/9/12 15:14
 * Description: ""
 */
require('./index.scss');
var Loading = require("COMMON/js/util.loading.pc");
var Loading_Text = Loading("努力加载中...",{
	tag : "tr",
	colspan : 9,
	height : "200",
	className : "listLoadingTr"
});
var Status = require("./status");
var PaginationX = require("COMMON/modules/pagination-x");
var Search = require("./search");
var Service = require("./api.service");
var Tpl = require("./index.xtpl");
var Main = PFT.Util.Class({
	container : "#tbody",
	EVENTS : {
		"click .doActionBtn" : "onDoActionBtnClick"
	},
	template : PFT.Util.ParseTemplate(Tpl),
	init : function(){
		var template = this.template;
		var listUl = this.listUl = $("tbody");
		var pagination = this.pagination = new PaginationX({
			container : "#paginationXContainer",
			count : 7,
			showTotal : true,
			jump : true
		});
		pagination.on("page.switch",function(toPage,currentPage,totalPage){
			this.render({current:toPage,total:totalPage});
		});


		var search = new Search();
		search.on("search",function(params){
			Service.fetchList(params,{
				debug : true,
				loading : function(){
					listUl.html(Loading_Text);
					search.disable();
				},
				complete : function(){
					listUl.html("");
					search.enable();
				},
				success : function(data){
					var currentPage = data.page;
					var totalPage = data.totalPage;
					var html = template({data : data.data});
					listUl.html(html);
					pagination.render({current:currentPage,total:totalPage})
				},
				empty : function(data){
					console.log("empty")
					listUl.html('<tr><td style="text-align:center; height:200px" colspan="7">暂无数据...</td></tr>');
					pagination.render(null);
				}
			})
		})

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

$(function(){
	new Main();
})

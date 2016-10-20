/**
 * Author: huangzhiyang
 * Date: 2016/10/19 17:33
 * Description: ""
 */
require("./index.scss");
var Service = require("SERVICE_M/getproduct-hot-c");
var Loading = require("COMMON/js/util.loading.pc")("努力加载中...",{
	tag : "li",
	className : "sta loading"
});
var Tpl = require("./index.xtpl");
var Main = PFT.Util.Class({
	container : $("body"),
	EVENTS : {
		"click #searchBtn" : "onSearchBtnClick"
	},
	template : PFT.Util.ParseTemplate(Tpl),
	init : function(){
		this.searchInp = $("#searchInp");
		this.listUl = $("#listUl");
		var keyword = $.trim(this.searchInp.val());
		if(keyword){
			this.search(keyword)
		}
	},
	onSearchBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var keyword = $.trim(this.searchInp.val());
		if(!keyword) return false;
		this.search(keyword);
	},
	search : function(keyword){
		if(!keyword) return false;
		var listUl = this.listUl;
		Service({
			keyword : keyword,
			loading : function(){
				listUl.html(Loading);
			},
			complete : function(){
				listUl.html("");
			},
			success : function(data){
				var html = this.template({data:data});
				console.log(html)
				listUl.html(html);
			},
			empty : function(){
				listUl.html('<li class="sta empty">查无匹配产品...</li>');
				this.getSearchHistory();
			},
			fail : function(msg){
				listUl.html('<li class="sta fail">'+msg+'</li>');
			}
		},this)
	}
});

$(function(){
	new Main;
})
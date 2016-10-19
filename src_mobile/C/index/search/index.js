/**
 * Author: huangzhiyang
 * Date: 2016/10/17 17:27
 * Description: ""
 */
require("./index.scss");
var ContainerTpl = require("./index.xtpl");
var Service = require("SERVICE_M/getproduct-hot-c");
var Loading = require("COMMON/js/util.loading.pc")("努力加载中...",{
	tag : "li",
	className : "sta loading"
});
var Search = PFT.Util.Class({
	status : "close",
	__timeout : null,
	init : function(){
		var that = this;
		var container = this.container = $(ContainerTpl);
		this.searchBtn = $("#searchBtn");
		this.userBtn = $("#userBtn");
		this.searchInp = $("#searchInp");
		this.$body = $("body");
		this.$body.append(container);
		this.historyContainer = container.children(".historyContainer");
		this.resultContainer = container.children(".searchResultContainer");

		this.searchInp.on("input",function(e){
			clearTimeout(that.__timeout);
			that.__timeout = setTimeout(function(){
				that.onSearchInpChange(e);
			},300)
		})


		this.initRouter();
	},
	initRouter : function(){
		var that = this;
		var Router = Backbone.Router.extend({
			routes : {
				"" : "home",
				"open" : "open"
			},
			home : function(){
				that.close();
			},
			open : function(){
				that.show();
			}
		});
		this.router = new Router();
		Backbone.history.start();
	},
	getSearchHistory : function(){

	},
	setSearchHistory : function(keyword){

	},
	queryByKeyword : function(keyword){
		var that = this;
		if(keyword==""){
			this.showHistory();
			this.hideSearchResult();
			this.getSearchHistory();
		}else{
			this.hideHistory();
			this.showSearchResult();
			var listUl = this.resultContainer;


			Service({
				keyword : keyword,
				loading : function(){
					listUl.html(Loading);
				},
				complete : function(){
					listUl.html("");
				},
				success : function(data){

				},
				empty : function(){
					listUl.html('<li class="sta empty">查无匹配产品...</li>');
				},
				fail : function(msg){
					listUl.html('<li class="sta fail">'+msg+'</li>');
				}
			},this)
		}
	},
	showHistory : function(){
		this.historyContainer.show();
	},
	hideHistory : function(){
		this.historyContainer.hide();
	},
	showSearchResult : function(){
		this.resultContainer.show();
	},
	hideSearchResult : function(){
		this.resultContainer.hide();
	},
	onSearchInpChange : function(e){
		var tarInp = $(e.target);
		var keyword = $.trim(tarInp.val());
		this.queryByKeyword(keyword);
	},
	show : function(){
		var that = this;
		var container = this.container;
		var searchInp = this.searchInp;
		if(this.status=="show") return false;
		container[0].style.display = "block";
		this.searchBtn.removeClass("hide");
		this.userBtn.addClass("hide");
		container.animate({"transform" : "translate3d(0px,0px,0px)"},300,"linear",function(){
			that.status = "show";
		});

		var keyword = $.trim(this.searchInp.val());
		this.queryByKeyword(keyword);

	},
	close : function(){
		var that = this;
		var container = this.container;
		if(this.status=="close") return false;
		this.searchBtn.addClass("hide");
		this.userBtn.removeClass("hide");
		container.animate({"transform" : "translate3d(0px,2000px,0px)"},300,"linear",function(){
			that.status = "close";
			container[0].style.disable = "none";
		});
	}
});
module.exports = Search;
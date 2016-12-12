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
var Confirm = PFT.Mobile.Confirm;
var Search = PFT.Util.Class({
	status : "close",
	__timeout : null,
	__HISTORY_LOCALSTORAGE_KEY : "PFT-WX-C-SEARCH-HISTORY",
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
		this.historyList = this.historyContainer.children(".historyList");
		this.searchListPage = $('<div id="searchListContainer" class="searchListContainer"></div>').appendTo(this.$body);

		this.bineEvent();
		this.initRouter();
	},
	bineEvent : function(){
		var that = this;
		this.searchInp.on("input",function(e){
			clearTimeout(that.__timeout);
			that.__timeout = setTimeout(function(){
				that.onSearchInpChange(e);
			},300)
		})
		this.historyContainer.on("click",".deleteAllBtn",function(e){
			Confirm("确定要删除所有搜索记录吗？",function(result){
				if(result==true) that.removeSearchHistory();
			})
		}).on("click",".historyList .t",function(e){
			var text = $(e.currentTarget).text();
			that.searchInp.val(text);
			that.queryByKeyword(text);
		}).on("click",".historyList .deleteBtn",function(e){
			var tarItem = $(e.currentTarget).parent(".historyItem");
			var text = tarItem.find(".t").text();
			tarItem.remove();
			that.removeSearchHistory(text);
		})
		this.searchBtn.on("click",function(e){
			e.stopPropagation();
			e.preventDefault();
			var keyword = $.trim(that.searchInp.val());
			if(keyword=="") return false;
			that.setSearchHistory(keyword);
			window.location.href = ("search.html?keyword=" + encodeURI(keyword));
		})
	},
	initRouter : function(){
		var that = this;
		var Router = Backbone.Router.extend({
			routes : {
				"" : "home",
				"result" : "result"
			},
			home : function(){
				that.close();
				$("#indexPageFixHeader .searchBox").removeClass("onFocus");
				$("#indexPageFixHeader").removeClass("onFocus");
			},
			result : function(keyword){
				if(!keyword){
					that.show();
					that.hideListPage();
				}else{
					that.showListPage();
				}
				$("#indexPageFixHeader .searchBox").addClass("onFocus");
				$("#indexPageFixHeader").addClass("onFocus");
			}
		});
		this.router = new Router();
		Backbone.history.start();
	},
	getSearchHistory : function(){
		var history = localStorage.getItem(this.__HISTORY_LOCALSTORAGE_KEY);
		//history = history || "搜索1,探寻2,搜索1,探寻2,搜索1,探寻2,搜索1,探寻2,搜索1,探寻2,搜索1,探寻2";
		if(!history) return this.hideHistory();
		history = history.split(",");
		var html = "";
		for(var i in history){
			html += '<span class="historyItem"><i class="t">'+history[i]+'</i><i class="deleteBtn">x</i></span>';
		}
		this.historyList.html(html);
		this.showHistory();
	},
	setSearchHistory : function(keyword){
		if(!keyword) return false;
		keyword = $.trim(keyword);
		var key = this.__HISTORY_LOCALSTORAGE_KEY;
		var history = localStorage.getItem(key);
		if(!history){
			localStorage.setItem(key,keyword);
		}else{
			if(history.indexOf(keyword)>-1){ //如果此关键字已存在于localStorage 则禁止重复添加
				return false
			}else{
				localStorage.setItem(key,history+","+keyword);
			}
		}
	},
	removeSearchHistory : function(keyword){
		var key = this.__HISTORY_LOCALSTORAGE_KEY;
		if(typeof keyword=="undefined"){
			localStorage.removeItem(key);
			this.historyList.html("");
			this.hideHistory();
		}else if(keyword && (typeof keyword=="string")){
			var history = localStorage.getItem(key);
			if(!history) return false;
			history = history.split(",");
			var index = history.indexOf(keyword);
			history.splice(index,1);
			if(history.length==0){
				this.removeSearchHistory("");
			}else{
				localStorage.setItem(key,history.split(","));
			}
		}
	},
	queryByKeyword : function(keyword){
		if(keyword==""){
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
					var html = "";
					for(var i in data){
						var item = data[i];
						var title = item.title;
						var lid = item.lid;
						html += '<li class="searchResultLi"><a class="con" href="pdetail.html?lid='+lid+'"><span class="t">'+title+'</span><i class="rt uicon uicon-jiantou-sin-right"></i></a></li>';
					}
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
	showListPage : function(){
		var searchListPage = this.searchListPage;
		var keyword = $.trim(this.searchInp.val());
		searchListPage[0].style.display = "block";
		searchListPage.animate({transform:"translate3d(0px,0px,0px)"},300,"linear",function(){});
		Service({
			keyword : keyword,
			loading : function(){
				listUl.html(Loading);
			},
			complete : function(){
				listUl.html("");
			},
			success : function(data){
				var html = "";
				for(var i in data){
					var item = data[i];
					var title = item.title;
					var lid = item.lid;
					html += '<li class="searchResultLi"><a class="con" href="pdetail.html?lid='+lid+'"><span class="t">'+title+'</span><i class="rt uicon uicon-jiantou-sin-right"></i></a></li>';
				}
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
	},
	hideListPage : function(){
		var searchListPage = this.searchListPage;
		searchListPage.animate({transform:"translate3d(0px,2000px,0px)"},300,"linear",function(){
			searchListPage[0].style.disable = "none";
		})
	},
	show : function(){
		var that = this;
		var container = this.container;
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
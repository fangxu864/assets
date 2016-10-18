/**
 * Author: huangzhiyang
 * Date: 2016/10/17 17:27
 * Description: ""
 */
require("./index.scss");
var Search = PFT.Util.Class({
	status : "close",
	init : function(){
		var container = this.container = $('<div id="searchListPage" class="searchListPage"></div>');
		this.searchBtn = $("#searchBtn");
		this.userBtn = $("#userBtn");
		this.searchInp = $("#searchInp");
		this.$body = $("body");
		this.$body.append(container);
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
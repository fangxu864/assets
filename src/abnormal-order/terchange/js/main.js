/**
 * Created by Administrator on 16-3-25.
 */
var Filter = require("./modules/filter.js");
var List = require("./modules/list.js");
var Main = RichBase.extend({
	init : function(){
		this.filter = new Filter();
		this.navigation = new NavigationBar();
		this.list = new List({
			navigation : this.navigation
		});
		this.bindEvents();
		this.list.query(1,this.filter.getFilterParams());
	},
	bindEvents : function(){
		var that = this;
		this.filter.on("searchBtn.click",function(data){
			var params = data.params;
			that.list.query(1,params);
		})
		this.navigation.on("navigation",function(data){
			var toPage = data.toPage;
			$("html,body").animate({"scrollTop":185},200);
			that.list.query(toPage,that.filter.getFilterParams());
		})
	}
})

$(function(){
	new Main();
})
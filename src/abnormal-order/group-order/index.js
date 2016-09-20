/**
 * Author: huangzhiyang
 * Date: 2016/9/19 17:21
 * Description: ""
 */
require("./index.scss");
var Query = require("./query");
var Main = PFT.Util.Class({
	container : "#rtContainer",
	EVENTS : {
		"click #tabHead .tabItem" : "onTabItemClick"
	},
	init : function(){
		this.query = new Query();
	},
	onTabItemClick : function(e){
		var tarItem = $(e.currentTarget);
		var pannel = tarItem.attr("data-pannel");
		if(tarItem.hasClass("active")) return false;
		tarItem.addClass("active").siblings().removeClass("active");

		pannel=="query" ? this.query.enable() : this.query.disable();

	}
});

$(function(){

	new Main();

})
/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var ListManager = require("./list-manager");
var MainView = Backbone.View.extend({
	el : $("#cardContainer"),
	events : {

	},
	initialize : function(){
		var that = this;
		this.ListManager = new ListManager();
	}
});

$(function(){
	new MainView();
	
})


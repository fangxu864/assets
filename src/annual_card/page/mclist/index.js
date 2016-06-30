/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var TabHeader = require("./tab-header");
var ListManager = require("./list-manager");
var MainView = Backbone.View.extend({
	el : $("#cardContainer"),
	events : {

	},
	initialize : function(){
		var that = this;
		this.TabHeader = new TabHeader();
		this.TabHeader.on("switch",function(data){
			var status = data.status;
			that.ListManager.active(status);
		})
		this.ListManager = new ListManager({statusArr:this.TabHeader.getStatus()});
		this.TabHeader.active(1);
	}
});

$(function(){
	new MainView();
})


/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var TabHeader = require("./tab-header");
var ListManager = require("./list-manager");
var State = require("./state.js");
var MainView = Backbone.View.extend({
	el : $("#cardContainer"),
	events : {

	},
	initialize : function(){
		var that = this;
		this.TabHeader = new TabHeader({state:State});
		this.TabHeader.on("switch",function(data){
			var fromStatus = data.fromStatus;
			var toStatus = data.toStatus;
			that.ListManager.active(fromStatus,toStatus);
		})
		this.ListManager = new ListManager({statusArr:this.TabHeader.getStatus(),state:State});
		this.TabHeader.active(1);
	}
});

$(function(){
	new MainView();
})


/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var UserInfo = require("./userinfo");
var CardList = require("./card-list");
var MainView = Backbone.View.extend({
	el : $("#cardContainer"),
	events : {},
	initialize : function(){
		this.UserInfo = new UserInfo();
		this.CardList = new CardList();
	}
});

$(function(){
	new MainView();
})
/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var UserInfo = require("./userinfo");
var CardList = require("./card-list");
var OrderInfo = require("./orderinfo");
var MainView = Backbone.View.extend({
	el : $("#cardContainer"),
	events : {},
	initialize : function(){
		this.UserInfo = new UserInfo();
		this.CardList = new CardList();
		this.OrderInfo = new OrderInfo();
	}
});

$(function(){
	new MainView();
})

/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var Header = require("./header.js");
var MainView = Backbone.View.extend({
	initialize : function(){
		this.Header = new Header();
	}
});

$(function(){
	new MainView();
})
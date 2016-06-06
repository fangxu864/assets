/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var Model = require("./model");
var Header = require("./modules/header");
var MainView = Backbone.View.extend({
	initialize : function(){
		this.model = new Model();
		this.header = new Header({model:this.model});
	}
});

$(function(){
	new MainView();
})
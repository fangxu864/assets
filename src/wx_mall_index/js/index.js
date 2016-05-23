/**
 * Author: huangzhiyang
 * Date: 2016/5/20 17:11
 * Description: ""
 */
var FastClick = require("fastclick");
var CityQuery = require("COMMON/modules/wx_mall_location_query_city");
var Router = Backbone.Router.extend({
	routes : {
		"" : "home",
		"openCityQuery" : "openCityQuery"
	},
	home : function(){

	},
	openCityQuery : function(){

	}
});
var Main = Backbone.View.extend({
	initialize : function(){
		FastClick.attach(document.body);
		new CityQuery();
	}
});


$(function(){
	new Main();
})
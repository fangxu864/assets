/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var AllCitys = require("COMMON/js/config.province.city.js");
var SSelect = require("COMMON/js/component.city.select.simple.js"); //写了个简单的select控件
var MainView = Backbone.View.extend({
	el : $("#cardContainer"),
	events : {
		"focus .textInp" : "onTextInpFocus",
		"blur .textInp" : "onTextInpBlur"
	},
	initialize : function(){
		this.select = new SSelect({
			data : AllCitys,
			provId : "#provSelect",
			cityId : "#citySelect",
			onProvChange : function(data){
				console.log(data);
			},
			onCityChange : function(data){
				console.log(data);
			}
		})
	},
	onTextInpFocus : function(e){
		var tarInp = $(e.currentTarget);
		tarInp.parents(".line").removeClass("error");
	},
	onTextInpBlur : function(e){
		var tarInp = $(e.currentTarget);
		var val = $.trim(tarInp.val());
		var parent = tarInp.parents(".line");
		if(!val) return parent.addClass("error");
		if(tarInp.hasClass("mobileInp") && !PFT.Util.Validate.typePhone(val)){
			parent.addClass("error");
		}
	}
});

$(function(){
	new MainView();
})

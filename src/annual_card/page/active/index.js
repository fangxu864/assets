/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var ReadPhysicsCard = require("../../common/readPhysicsCard.js");
var MainView = Backbone.View.extend({
	el : $("#cardContainer"),
	events : {
		"click #readCardBtn" : "onReadCardBtnClick",
		"blur .textInp" : "onTextInpBlur"
	},
	initialize : function(){
		this.cardInp = $("#cardNum");
		this.ReadPhysicsCard = new ReadPhysicsCard({id:"readCardObj"});
	},
	onReadCardBtnClick : function(e){
		var cardval = this.ReadPhysicsCard.read();
		this.cardInp.val(cardval);
		if(!cardval) alert("读卡失败");
	},
	onTextInpBlur : function(e){
		var tarInp = $(e.currentTarget);
		var validate = tarInp.attr("validate");
		validate = validate.split("|");
		for(var i in validate){
			
		}
	},
	validator : {
		card : function(){

		},
		mobile : function(){

		},
		vcode : function(){

		},
		idCard : function(){

		},
		membername : function(){

		}
	}
});

$(function(){
	new MainView();
})

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
		"blur "
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

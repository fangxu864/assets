/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var Header = require("./header.js");
var List = require("./list.js");
var Dialog = require("./dialog");
var Select = require("COMMON/modules/select");
var MainView = Backbone.View.extend({
	el : $("body"),
	events : {
		"click #relateSHCardBtn" : "onRelateSHCardBtnClick"
	},
	initialize : function(){
		var that = this;
		this.Header = new Header();
		this.List = new List();
		this.Dialog = new Dialog({List:this.List});
		this.Header.on("create.card",function(data){
			var cards = data.cards;
			that.List.render(cards);
		})


		new Select({
			trigger : $("#test"),
			width : 180,
			field : {
				id : "pid",
				name : "title"
			},
			data : [{
				pid : "11",
				title : "测试名"
			},{
				pid : "11",
				title : "测试名"
			},{
				pid : "11",
				title : "测试名"
			},{
				pid : "11",
				title : "测试名"
			},{
				pid : "11",
				title : "测试名"
			},{
				pid : "11",
				title : "测试名"
			},{
				pid : "11",
				title : "测试名"
			}]
		})






	},
	onRelateSHCardBtnClick : function(e){
		//if($("#cardList").children(".cardItem").length==0) return false;
		this.Dialog.open();
	}
});

$(function(){
	new MainView();
})
/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var Api = require("../../common/api.js");
var ReadPhysicsCard = require("../../common/readPhysicsCard.js");
var MainView = Backbone.View.extend({
	el : $("#cardContainer"),
	events : {
		"click #readCardBtn" : "onReadCardBtnClick",
		"blur .textInp" : "onTextInpBlur"
	},
	initialize : function(){
		this.cardInp = $("#cardNum");
		this.readCardBtn = $("#readCardBtn");
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
	},
	getCardInfo : function(card_no,type){
		var tarBtn = this.readCardBtn;
		if(!card_no || !type) return false;
		PFT.Util.Ajax(Api.Url.active.checkCard,{
			params : {
				identify : card_no,
				type : type
			},
			loading : function(){
				tarBtn.addClass("disable");
			},
			complete : function(){
				tarBtn.removeClass("disable");
			},
			success : function(res){
				res = res || {};
				var data= res.data;
				if(res.code==200){
					var needID = data.need_ID;
					var virtual_no = data.virtual_no;
					var physics_no = data.physics_no;
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT)
				}
			}
		})
	}
});

$(function(){
	new MainView();
})

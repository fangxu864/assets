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
		this.cardInp = $("#cardInp");
		this.readCardBtn = $("#readCardBtn");
		this.idCardInp = $("#idCardInp");
		this.cardInfoBar = $("#cardInfoBar");
		this.ReadPhysicsCard = new ReadPhysicsCard({id:"readCardObj"});
	},
	onReadCardBtnClick : function(e){
		if($(e.currentTarget).hasClass("disable")) return false;
		var cardval = this.ReadPhysicsCard.read();
		this.cardInp.val(cardval);
		if(!cardval) return alert("读卡失败");
		this.getCardInfo(cardval,"physics")
	},
	onTextInpBlur : function(e){
		var that = this;
		var tarInp = $(e.currentTarget);
		var validate = tarInp.attr("validator");
		if(!validate) return false;
		validate = validate.split("|");
		for(var i in validate){
			var valid = validate[i].split(":");
			var rule = valid[0];
			var args = valid[1] ? valid[1].split(",") : [];
			var handler = that.validator[rule];
			if(handler) handler.apply(that,args);
		}
	},
	validator : {
		card : function(){
			var tarInp = this.cardInp;
			var val = $.trim(tarInp.val());
			if(!PFT.Util.Validate.typeInit0(val)) return alert("请输入数字卡号或直接用读卡器读取卡号");
			this.getCardInfo(val,"other");
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
		var that = this;
		var tarBtn = this.readCardBtn;
		if(!card_no || !type) return false;
		PFT.Util.Ajax(Api.Url.active.checkCard,{
			params : {
				identify : card_no,
				type : type
			},
			loading : function(){
				tarBtn.addClass("disable");
				$("#loadingIcon").show();
			},
			complete : function(){
				tarBtn.removeClass("disable");
				//$("#loadingIcon").hide();
			},
			success : function(res){
				return false;
				res = res || {};
				var data= res.data;
				if(res.code==200){
					var idCardInp = that.idCardInp;
					var needID = data.need_ID || "";
					var virtual_no = data.virtual_no;
					var physics_no = data.physics_no;
					idCardInp.attr("validate","idCard:"+needID);
					that.cardInfoBar.show().removeClass("error").html("虚拟卡号："+virtual_no+"<i style='margin:0 10px'></i>"+"物理ID："+physics_no);
				}else{
					that.cardInfoBar.show().html(res.msg || PFT.AJAX_ERROR_TEXT).addClass("error");
				}
			}
		})
	}
});

$(function(){
	new MainView();
})

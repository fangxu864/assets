/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var Api = require("../../common/api.js");
var ReadPhysicsCard = require("../../common/readPhysicsCard.js");
var CheckExistDialog = require("../../common/check-exist-dialog");
var MainView = Backbone.View.extend({
	time : 60,  //获取验证码的间隔时间 60s
	timer : null,
	cardHasReaded : {},
	el : $("#cardContainer"),
	events : {
		"click #readCardBtn" : "onReadCardBtnClick",
		"click #getVCodeBtn" : "onGetVCodeBtnClick",
		"click #activateBtn" : "onActiveBtnClick",
		"blur .textInp" : "onTextInpBlur",
		"focus .textInp" : "onTextInpFocus"
	},
	initialize : function(){
		var that = this;
		this.cardInp = $("#cardInp");
		this.readCardBtn = $("#readCardBtn");
		this.getVCodeBtn = $("#getVCodeBtn");
		this.idCardInp = $("#idCardInp");
		this.cardInfoBar = $("#cardInfoBar");
		this.mobileInp = $("#mobileInp");
		this.vcodeInp = $("#vcodeInp");
		this.memnameInp = $("#memnameInp");
		this.submitBtn = $("#activateBtn");
		this.ReadPhysicsCard = new ReadPhysicsCard({id:"readCardObj"});
		this.CheckExistDialog = new CheckExistDialog();
		this.CheckExistDialog.on("replaceAndSubmit",function(submitData){
			that.submit("replace");
			this.close();
		})
	},
	//点击读卡
	onReadCardBtnClick : function(e){
		if($(e.currentTarget).hasClass("disable")) return false;
		var cardval = this.ReadPhysicsCard.read();
		this.cardInp.val(cardval);
		if(!cardval) return alert("读卡失败");
		this.cardHasReaded[cardval] = 1;
		this.getCardInfo(cardval,"physics")
	},
	//点击获取验证码
	onGetVCodeBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("unable")) return false;
		var mobile = $.trim(this.mobileInp.val());
		if(!PFT.Util.Validate.typePhone(mobile)) return alert("请填写正确格式手机号");
		this.getVCode(mobile);
	},
	//点击提交激活
	onActiveBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		if(this.cardInfoBar.hasClass("error")) return false;
		if(!this.cardInp.val()){
			this.cardInp.blur();
			return false;
		}
		this.mobileInp.blur();
		if(this.mobileInp.siblings(".tip").hasClass("error")) return false;
		this.vcodeInp.blur();
		if(this.vcodeInp.siblings(".tip").hasClass("error")) return false;
		this.idCardInp.blur();
		if(this.idCardInp.siblings(".tip").hasClass("error")) return false;
		this.submit();
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
	onTextInpFocus : function(e){
		var that = this;
		var tarInp = $(e.currentTarget);
		var validate = tarInp.attr("validator");
		if(!validate) return false;
		if(tarInp.attr("id")=="cardInp"){
			$("#cardInfoBar").removeClass("error").hide();
		}else{
			tarInp.siblings(".tip").removeClass("error").hide();
		}
	},
	validator : {
		card : function(){
			var tarInp = this.cardInp;
			var val = $.trim(tarInp.val());
			var cardInfoBar = this.cardInfoBar;
			if(!val){
				cardInfoBar.show().addClass("error").html("请输入卡号或直接用读卡器读取卡号");
			}else{
				cardInfoBar.hide().removeClass("error");
				this.getCardInfo(val,"other");
			}
		},
		mobile : function(){
			var mobileInp = this.mobileInp;
			var mobile = $.trim(mobileInp.val());
			var tip = mobileInp.siblings(".tip");
			if(!PFT.Util.Validate.typePhone(mobile)){
				tip.show().addClass("error").text("请填写正确格式手机号");
				return false;
			}else{
				tip.hide().removeClass("error");
				return true;
			}
		},
		vcode : function(){
			var vcodeInp = this.vcodeInp;
			var vcode = $.trim(vcodeInp.val());
			var tip = vcodeInp.siblings(".tip");
			if(!vcode){
				tip.show().addClass("error").text("请填写验证码");
				return false;
			}else{
				tip.hide().removeClass("error");
				return true;
			}
		},
		idCard : function(need){
			var idCardInp = this.idCardInp;
			var idCard = $.trim(idCardInp.val());
			var tip = idCardInp.siblings(".tip");
			if((idCard && !PFT.Util.Validate.idCard(idCard)) || ((need==1) && !idCard)){
				tip.show().addClass("error").text("请填写正确格式身份证");
				return false;
			}else{
				tip.removeClass("error").hide();
				return true;
			}
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
				$("#loadingIcon").hide();
			},
			success : function(res){
				res = res || {};
				var data= res.data;
				if(res.code==200){
					var idCardInp = that.idCardInp;
					var needID = data.need_ID || "";
					var virtual_no = data.virtual_no;
					var physics_no = data.physics_no;
					idCardInp.attr("validate","idCard:"+needID);
					if(needID==1){
						$("#idCard-fontRed").show();
					}else{
						$("#idCard-fontRed").hide();
					}
					that.cardInfoBar.show().removeClass("error").html("虚拟卡号："+virtual_no+"<i style='margin:0 10px'></i>"+"物理ID："+physics_no);
				}else{
					that.cardInfoBar.show().html(res.msg || PFT.AJAX_ERROR_TEXT).addClass("error");
				}
			}
		})
	},
	getVCode : function(mobile){
		var that = this;
		var getVCodeBtn = this.getVCodeBtn;
		PFT.Util.Ajax(Api.Url.active.getVCode,{
			params : {
				mobile : mobile
			},
			loading : function(){
				getVCodeBtn.addClass("unable").text("请稍后..");
			},
			success : function(res){
				res = res || {};
				if(res.code==200){
					var last = that.time-1;
					that.timer = setInterval(function(){
						last = last-1;
						if(last<=0){
							getVCodeBtn.text("获取验证码").removeClass("unable");
							clearInterval(that.timer);
						}else{
							getVCodeBtn.text(last+"秒后可重新获取");
						}
					},1000)
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	submit : function(replace){
		var that = this;
		var submitBtn = this.submitBtn;
		var cardVal = this.cardInp.val();
		var type = this.cardHasReaded[cardVal] ? "physics" : "other";
		var mobile = this.mobileInp.val();
		var name = this.memnameInp.val();
		var id_card = this.idCardInp.val();
		var vcode = this.vcodeInp.val();
		var data = {
			identify : cardVal,
			type : type,
			mobile : mobile,
			name : name,
			id_card : id_card,
			vcode : vcode
		};
		if(replace=="replace") data["replace"] = 1;
		PFT.Util.Ajax(Api.Url.active.activateForPc,{
			type : "post",
			params : data,
			loading : function(){
				submitBtn.addClass("disable");
			},
			complete : function(){
				submitBtn.removeClass("disable");
			},
			success : function(res){
				res = res || {};
				var data = res.data || {};
				if(res.code==200){
					if(data.exist==1){
						that.CheckExistDialog.open(data);
					}else{
						PFT.Util.STip("success",'<div style="width:200px">激活成功</div>')
					}
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

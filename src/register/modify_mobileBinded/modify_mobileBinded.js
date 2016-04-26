/**
 * Created by Administrator on 16-4-18.
 */
var Dialog = require("COMMON/modules/easydialog");
var tpl = require("../view/modify_mobileBinded.html");
var VCode = require("COMMON/js/util.vcode.js");
var Validate = require("COMMON/js/util.validate.js");
var AJAX_ERROR_TEXT = "请求出错，请稍后重试";
var Main = {
	init : function(){
		this.old_mobile = "18305917899";
		this.modifyMobileTrigger = $("#modifyBtn");
		this.bindEvents();
	},
	bindEvents : function(){
		var that = this;
		this.modifyMobileTrigger.on("click",function(e){
			Dialog.open({
				container : {
					header : '修改绑定手机号',
					content : tpl
				},
				offsetY : -160,
				overlay : false,
				events : {
					"focus #modifyDialogBox .textInp" : function(e){
						var tarInp = $(e.currentTarget);
						that.onTextInpFocus(tarInp);
					},
					"click #modifyDialogBox .submitBtn" : function(e){
						that.onSubmitBtnClick(e);
					},
					"click #modifyDialogBox .getVCodeBtn" : function(e){
						that.onGetVCodeBtnClick($(e.target));
					}
				}
			},function(){
				$("#mobileInp_old").val(that.old_mobile);
			})
		})
	},
	getOldMobile : function(){
		return this.old_mobile;
	},
	getNewMobile : function(){
		return $.trim($("#mobileInp_new").val());
	},
	getOldVCode : function(){
		return $.trim($("#vcodeInpOld").val());
	},
	getNewVCode : function(){
		return $.trim($("#vcodeInpNew").val());
	},
	validate_vcode : function(vcode){
		var error = "";
		if(!vcode || vcode.length!==6) error = "请填写6位数验证码";
		return error;
	},
	validate_mobile : function(mobile){
		var error = "";
		if(!mobile || !Validate.typePhone(mobile)) error = "请填写正确格式手机号";
		return error;
	},
	onGetVCodeBtnClick : function(tarBtn){
		if(tarBtn.hasClass("disable")) return false;
		var mobile = tarBtn.hasClass("old") ? this.getOldMobile() : this.getNewMobile();
		var validate = this.validate_mobile();
		if(validate) return alert(validate);
		VCode.get(mobile,{
			loading : function(){},
			complate : function(){},
			success : function(res){

			}
		})
	},
	onTextInpFocus : function(tarInp){
		tarInp.parents(".rt").removeClass("error");
	},
	onSubmitBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var mobile = tarBtn.hasClass("old") ? this.getOldMobile() : this.getNewMobile();
		var vcode = tarBtn.hasClass("old") ? this.getOldVCode() : this.getNewVCode();
		if(tarBtn.hasClass("old")){
			this.checkVCode(vcode,tarBtn,function(vcode){
				var slideContainer = $("#slideContainer");
				slideContainer.animate({left:-slideContainer.children().first().width()},200)
			})
		}else if(tarBtn.hasClass("new")){
			var validate_mobile = this.validate_mobile(mobile);
			var validate_vcode = this.validate_vcode(vcode);
			if(validate_mobile) return alert(validate_mobile);
			if(validate_vcode) return alert(validate_vcode);

		}
	},
	checkVCode : function(vcode,tarBtn,callback){
		return callback(vcode);
		var validate = this.validate_vcode(vcode);
		if(validate) return alert(validate);
		VCode.check(vcode,{
			loading : function(){
				tarBtn.addClass("disable");
			},
			complete : function(){
				tarBtn.removeClass("disable");
			},
			success : function(res){
				var res = res || {};
				var code = res.code;
				if(code==200){
					callback && callback(vcode);
				}else{
					alert(res.msg || AJAX_ERROR_TEXT);
				}
			}
		})
	}
}

$(function(){
	Main.init();
})
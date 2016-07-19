/**
 * Author: huangzhiyang
 * Date: 2016/7/18 9:32
 * Description: ""
 */
var ResetPassword = function(){
	this.api = PFT.Config.Api.get("Member_Register");
	this.initialize();
};
ResetPassword.prototype = {
	initialize : function(){
		this.token = $("#csrf_token").val();
		this.forget_submit1 = $("#forget_submit1");
		this.forget_submit2 = $("#forget_submit2");
		this.forget_submit3 = $("#forget_submit3");
		this.passwordInp_1 = $("#passwordInp_1");
		this.passwordInp_2 = $("#passwordInp_re");
		this.pass1_tip = $("#pass1_tipContainer");
		this.pass1_tip_normal = this.pass1_tip.find(".normal");
		this.pass1_tip_error = this.pass1_tip.find(".error");
		this.pass2_tip = $("#pass2_tipContainer");
		this.pass2_tip_normal = this.pass2_tip.find(".normal");
		this.pass2_tip_error = this.pass2_tip.find(".error");
		this.forgetinputpvcode_1 = $("#forgetinputpvcode_1");
		this.oldAccountInp = $("#oldAccountInp");
		this.bindEvents();
	},
	bindEvents : function(){
		var that = this;
		this.forget_submit1.on("click",function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var oldAccount = $.trim(that.oldAccountInp.val());
			var vcode = $.trim(that.forgetinputpvcode_1.val());
			if(!PFT.Util.Validate.typePhone(oldAccount)) return alert("请输入正确格式手机号");
			if(!vcode) return alert("请填写图形验证码");
			that.submit_1(oldAccount,vcode,tarBtn);
		})
		this.forget_submit2.on("click",function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var passport = $("#passport").text();
			if(!passport || !PFT.Util.Validate.typePhone(passport)) return false;
			var vcode = $.trim($("#vcodeInp").val());
			if(!vcode) return alert("请输入短信验证码");
			if(vcode.length!=6) return alert("请输入6位数短信验证码");
			that.submit_2(passport,vcode,tarBtn);
		})
		this.forget_submit3.on("click",function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var pass1 = $("#passwordInp_1").val();
			var pass2 = $("#passwordInp_re").val();
			pass1 = $.trim(pass1);
			pass2 = $.trim(pass2);
			that.passwordInp_1.blur();
			that.passwordInp_2.blur();
			if(that.passwordInp_1.hasClass("valid_error") || that.passwordInp_2.hasClass("valid_error")) return false;
			that.submit_3(pass1,pass2,tarBtn);
		})

		this.passwordInp_1.on("blur",function(e){
			var tarInp = $(this);
			var val = $.trim($(e.target).val());
			that.pass1_tip_normal.hide();
			if(!val) return tarInp.addClass("valid_error");
			var valid = that.validate_password(val);
			if(valid.error){
				that.pass1_tip_error.show().text(valid.error);
				tarInp.addClass("valid_error");
			}else{
				that.pass1_tip_error.hide().text("");
				tarInp.removeClass("valid_error");
			}
		})
		this.passwordInp_1.on("focus",function(e){
			var val = $.trim($(this).val());
			var tip_normal = that.pass1_tip_normal;
			var tip_error = that.pass1_tip_error;
			var valid = that.validate_password(val);
			if(val==""){
				tip_normal.show();
				tip_error.hide();
			}else if(valid.error){
				tip_normal.hide();
				tip_error.show().text(valid.error);
			}else{
				tip_normal.hide();
				tip_error.hide();
			}
		})
		this.passwordInp_2.on("blur",function(e){
			var tarInp = $(this);
			var val = $.trim($(e.target).val());
			var pass1 = $.trim(that.passwordInp_1.val());
			var tip_normal = that.pass2_tip_normal;
			var tip_error = that.pass2_tip_error;
			tip_normal.hide();
			if(!pass1 || !val) return tarInp.addClass("valid_error");
			if(val!==pass1){
				tip_error.show().text("两次输入的密码不一致");
				tarInp.addClass("valid_error");
			}else{
				tip_error.hide();
				tarInp.removeClass("valid_error");
			}
		})
		this.passwordInp_2.on("focus",function(e){
			var val = $.trim($(e.target).val());
			var pass1 = $.trim(that.passwordInp_1.val());
			var tip_normal = that.pass2_tip_normal;
			var tip_error = that.pass2_tip_error;
			if(val==""){
				tip_normal.show();
				tip_error.hide();
			}else if(val!==pass1 && pass1){
				tip_normal.hide();
				tip_error.show();
			}else{
				tip_normal.hide();
				tip_error.hide();
			}
		})

	},
	validate_password : function(password){
		return PFT.Util.Validate.validatePwd(password);
	},
	//第1步
	submit_1 : function(oldAccount,vcode,tarBtn){
		var that = this;
		if(!oldAccount || !vcode) return false;
		PFT.Util.Ajax(this.api("resetVcode"),{
			type : "post",
			params : {
				passport : oldAccount,
				auth_code : vcode,
				token : that.token
			},
			loading : function(){ tarBtn.addClass("disable")},
			complete : function(){ tarBtn.removeClass("disable")},
			success : function(res){
				res = res || {};
				if(res.code==200){
					window.location.href = "forget_mobile.html?passport="+oldAccount;
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	//第2步
	submit_2 : function(passport,vcode,tarBtn){
		if(!passport || !vcode) return false;
		var that = this;
		PFT.Util.Ajax(this.api("checkVcode"),{
			type : "post",
			params : {
				passport : passport,
				vcode : vcode,
				token : that.token
			},
			loading : function(){ tarBtn.addClass("disable")},
			complete : function(){ tarBtn.removeClass("disable")},
			success : function(res){
				res = res || {};
				if(res.code==200){
					window.location.href = "forget_reset.html";
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	//第3步
	submit_3 : function(pass1,pass2,tarBtn){
		var that = this;
		PFT.Util.Ajax(that.api("resetPwd"),{
			type : "post",
			params : {
				pass1 : pass1,
				pass2 : pass2,
				token : that.token
			},
			loading : function(){ tarBtn.addClass("disable")},
			complete : function(){ tarBtn.removeClass("disable")},
			success : function(res){
				res = res || {};
				if(res.code==200){
					window.location.href = "forget_ok.html";
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	}
};

$(function(){
	new ResetPassword();
})

/**
 * Created by Administrator on 16-4-13.
 */
var Debug = true;
var Ajax = PFT.Util.Ajax;
var URLParseQuery = PFT.Util.UrlParse;
var Validate = PFT.Util.Validate;
var Dialog = require("COMMON/modules/easydialog");
//var md5 = require("js-md5"); //md5.hex(pwd)   in node_modules/
var AJAX_ERROR_TEXT = "请求出错，请稍后重试";
var ImgCodeUrl = PFT.Config.Api.get("Login","getCode");
var VRegister = Backbone.View.extend({
	api : PFT.Config.Api.get("Member_Register"),
	el : $("#regForm"),
	RESEND_VCODE_TIME : 120,
	timer : null,
	__registerSuccess : false,
	events : {
		"click #tiaokuanCheckbox" : "onTiaoKuanCheckBoxClick",
		"click #getValidCodeBtn" : "onGetValidCodeBtnClick",
		"click #regSubmitBtn" : "onRegSubmitBtnClick",
		"mousedown #showPwdBtn" : "onShowPwdBtnMousedown",
		"mouseup #showPwdBtn" : "onShowPwdBtnMouseup",
		"blur .textInp" : "onTextInpBlur",
		"blur #pwdInp" : "onPwdInpBlur",
		"input #pwdInp" : "onPwdInpChange",
		"focus .textInp" : "onTextInpFocus"
	},
	initialize : function(opt){
		this.router = opt.router;
		this.getDtype = opt.getDtype;
		this.registerBtn = $("#regSubmitBtn");
		this.mobileInp = $("#mobileInp");
		this.pwdInp = $("#pwdInp");
		this.pwdInpParent = this.pwdInp.parents(".rt");
		this.pwdInpErrorTip = this.pwdInpParent.find(".error");
		this.pwdLevelBar = this.pwdInpParent.find(".levelBar");
		this.companyInp = $("#companyInp");
		this.getVCodeBtn = $("#getValidCodeBtn");
		this.vcodeInp = $("#validCodeInp");
		this.regForm = $("#regForm");
		this.regSubmitBtn = $("#regSubmitBtn");
		this.token = $("#csrf_token").val();
		this.regSubmitBtn_text = this.regSubmitBtn.text();
		//成功获取验证码后
		this.on("get.vcode.success",function(res){
			var that = this;
			var getBtn = this.getVCodeBtn;
			var last_time = this.RESEND_VCODE_TIME;
			PFT.Help.AlertTo("success",'<p style="width:400px">验证码已发送到手机'+this.mobileInp.val()+'上，'+last_time+'秒后可重新获取</p>',2000);
			clearInterval(this.timer);
			getBtn.text(last_time+"秒后重新获取");
			this.timer = setInterval(function(){
				if(last_time==0){
					getBtn.removeClass("disable").text("获取验证码");
					return clearInterval(that.timer);
				}
				last_time--;
				getBtn.addClass("disable");
				getBtn.text(last_time+"秒后重新获取");
			},1000)
		})
	},
	//验证密码(合法性及安全度)
	//6-20数字、字母和常用符号两种以上组合
	validatePwd : function(pwd){
		var pwdParent = this.pwdInpParent;
		var pwdError = this.pwdInpErrorTip;
		var pwdLevelBar = this.pwdLevelBar;
		var onError = function(error){
			var error = error || "错误";
			pwdParent.addClass("error");
			pwdError.text(error);
			pwdLevelBar.removeClass("weak").removeClass("normal").removeClass("strong");
		};
		var onOk = function(level){
			pwdParent.removeClass("error");
			pwdLevelBar.removeClass("weak").removeClass("normal").removeClass("strong").addClass(level);
		};
		if(!pwd) return onError("*必填");
		var result = Validate.validatePwd(pwd);
		if(result.error) return onError(result.error);
		onOk(result.level);
	},
	onPwdInpBlur : function(e){
		var val = $(e.currentTarget).val();
		this.validatePwd(val);
	},
	onPwdInpChange : function(e){
		this.onPwdInpBlur(e);
	},
	onTextInpBlur : function(e){
		var tarInp = $(e.currentTarget);
		this.validateInput(tarInp);
	},
	onTextInpFocus : function(e){
		var tarInp = $(e.currentTarget);
		var parent = tarInp.parents(".rt");
		parent.removeClass("ok").removeClass("error");
	},
	onGetValidCodeBtnClick : function(e){
		var that = this;
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var mobileInp = this.mobileInp;
		var mobile = $.trim(mobileInp.val());
		if(!mobile) return alert("请先填写手机号");
		this.validateInput(mobileInp);
		if(!mobileInp.parents(".rt").hasClass("ok")) return alert("请填写正确格式手机号");
		that.checkMobileExist(mobile).then( //先验证此手机号是否已被注册
			function(is_register){
				if(is_register==1) return alert("此号码已被注册，请更换");
				return that.showImgVCodeDialog();
			},
			function(error){ alert(error) }
		);
		this.showImgVCodeDialog();
	},
	onShowPwdBtnMousedown : function(e){
		this.pwdInp.prop("type","text");
	},
	onShowPwdBtnMouseup : function(e){
		this.pwdInp.prop("type","password");
	},
	//点击注册提交按钮
	onRegSubmitBtnClick : function(e){
		var that = this;
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var can_submit = true;
		$("input[data-validate]").each(function(){
			var tarInp = $(this);
			tarInp.trigger("blur");
			if(tarInp.parents(".rt").hasClass("error")){
				can_submit = false;
				return false;
			}
		})
		if(!can_submit) return false;
		that.submit_register();
	},
	//弹出图形验证码输入框
	showImgVCodeDialog : function(){
		var that = this;
		Dialog.open({
			container : {
				header : '请先填写图形验证码',
				content : [
					'<div style="width:320px;" class="dialogCon" style="margin-left:30px">',
						'<div class="line" style="margin-bottom:10px;">请填写左侧图形验证码</div>',
						'<div class="line" style="margin-bottom:5px;"><img id="vcode_img" class="vcode_img" src="'+ImgCodeUrl+'" alt=""/><input id="imgMaCodeInp" type="text" placeholder="请填写左侧图形验证码"/>',
							'<a id="getValidCodeBtn_img" class="getValidCodeBtn_img validCodeBtn">获取验证码</a>',
						'</div>',
					'</div>'
				].join("")
			},
			offsetY : -100,
			events : {
				"click .vcode_img" : function(e){
					$(e.currentTarget).attr("src",ImgCodeUrl)
				},
				"click .getValidCodeBtn_img" : function(e){
					var tarBtn = $(e.currentTarget);
					var mobile = that.mobileInp.val();
					var imgVCode = $.trim($("#imgMaCodeInp").val());
					if(tarBtn.hasClass("disable")) return false;
					if(!imgVCode) return alert("请输入图形验证码");
					tarBtn.addClass("disable");
					that.getVCode(mobile,imgVCode,tarBtn).then( //传入图形验证码、手机号去获取短信验证码
						function(msg){ //获取验证码成功
							var getBtn = that.getVCodeBtn;
							var last_time = that.RESEND_VCODE_TIME;
							tarBtn.removeClass("disable");
							Dialog.close();
							PFT.Util.STip("success",'<p style="width:400px">验证码已发送到手机'+mobile+'上，'+last_time+'秒后可重新获取</p>',2000);
							clearInterval(that.timer);
							getBtn.text(last_time+"秒后重新获取");
							that.timer = setInterval(function(){
								if(last_time==0){
									getBtn.removeClass("disable").text("获取验证码");
									return clearInterval(that.timer);
								}
								last_time--;
								getBtn.addClass("disable");
								getBtn.text(last_time+"秒后重新获取");
							},1000)
						},
						function(error){
							tarBtn.removeClass("disable");
							alert(error)} //获取验证码失败
					)
				}
			}
		});
	},
	//获取验证码
	getVCode : function(mobile,imgVCode,tarBtn){
		var defer = PFT.Util.Promise();
		PFT.Util.Ajax(this.api("regVcode"),{
			type : "post",
			params : {
				mobile : mobile,
				token : PFT.Util.getToken(),
				auth_code : imgVCode
			},
			loading : function(){ tarBtn.addClass("disable")},
			complete : function(){ tarBtn.removeClass("disable")},
			success : function(res){
				var res = res || {};
				var code = res.code;
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(code==200){
					defer.resolve(msg);
				}else{
					defer.reject(msg);
				}
			}
		})
		return defer.promise;
	},
	//验证此手机号是否已被注册过
	checkMobileExist : function(mobile){
		var defer = PFT.Util.Promise();
		PFT.Util.Ajax(this.api("checkMobile"),{
			type : "post",
			params : {
				mobile : mobile,
				token : PFT.Util.getToken()
			},
			loading : function(){},
			complete : function(){},
			success : function(res){
				var res = res || {};
				var code = res.code;
				var data = res.data || {};
				var is_register = data.is_register;
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(code==200 && (is_register==1 || is_register==0)){
					defer.resolve(is_register); //is_register==1已注册   is_register==0未注册
				}else{
					defer.reject(msg);
				}
			}
		})
		return defer.promise;
	},
	//提交注册
	submit_register : function(){
		var regBtn = this.registerBtn;
		var dtype = this.getDtype();
		if(!dtype) return alert("缺省dtype");
		var mobile = this.mobileInp.val();
		var vcode = this.vcodeInp.val();
		var password = this.pwdInp.val();
		var company = $.trim(this.companyInp.val());
		var submitData = {
			dtype : dtype,
			mobile : mobile,
			pwd : password,
			token : this.token,
			company : company,
			vcode : vcode
		};
		Ajax(this.api("memberRegister"),{
			type : "post",
			params : submitData,
			loading : function(){ regBtn.addClass("disable")},
			complete : function(){ regBtn.removeClass("disable")},
			success : function(res){
				var res = res || {};
				var code = res.code;
				var data = res.data || {};
				if(code==200){
					PFT.Util.STip("success",'<div style="width:200px">注册成功</div>');
					$("#accountNum").text(data.account);
				}else{
					alert(res.msg || AJAX_ERROR_TEXT);
				}
			}
		})
	},
	validateInput : function(tarInp){
		var rules = tarInp.data("validate");
		var val = $.trim(tarInp.val());
		var result = true;
		if(!rules) return false;
		rules = rules.split(" ");
		for(var i in rules){
			var rule = rules[i];
			if(Validate[rule]){
				result = Validate[rule](val);
				if(!result) break;
			}
		}
		if(result){
			if(tarInp.attr("id")=="validCodeInp" && val.length!=6){
				return tarInp.parents(".rt").removeClass("ok").addClass("error");
			}
			tarInp.parents(".rt").removeClass("error").addClass("ok");
		}else{
			tarInp.parents(".rt").removeClass("ok").addClass("error");
		}
	},
	//是否同意条款
	onTiaoKuanCheckBoxClick : function(e){
		var checkbox = $(e.currentTarget);
		if(!!checkbox.prop("checked")){
			this.registerBtn.removeClass("disable");
		}else{
			this.registerBtn.addClass("disable");
		}
	},
	getDtype : function(){
		return $("#selectDtypeContainer").find("input[type=radio][name=dtype]:checked").val();
	}
});
module.exports = VRegister;
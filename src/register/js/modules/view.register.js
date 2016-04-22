/**
 * Created by Administrator on 16-4-13.
 */
var Ajax = require("COMMON/js/util.ajax.js");
var VCode = require("COMMON/js/util.vcode.js");
var URLParseQuery = require("COMMON/js/util.url.parse.query.js");
var Validate = require("COMMON/js/util.validate.js");
var Dialog = require("COMMON/modules/easydialog");
var md5 = require("js-md5"); //md5.hex(pwd)   in node_modules/
var AJAX_ERROR_TEXT = "请求出错，请稍后重试";
var VRegister = Backbone.View.extend({
	api : "route/index.php?c=Member_Register",
	el : $("#regForm"),
	RESEND_VCODE_TIME : 60,
	timer : null,
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
		this.registerBtn = $("#regSubmitBtn");
		this.mobileInp = $("#mobileInp");
		this.pwdInp = $("#pwdInp");
		this.pwdInpParent = this.pwdInp.parents(".rt");
		this.pwdInpErrorTip = this.pwdInpParent.find(".error");
		this.pwdLevelBar = this.pwdInpParent.find(".levelBar");
		this.getVCodeBtn = $("#getValidCodeBtn");
		this.vcodeInp = $("#validCodeInp");
		this.regForm = $("#regForm");
		this.regSubmitBtn = $("#regSubmitBtn");
		this.regSubmitBtn_text = this.regSubmitBtn.text();
		//成功获取验证码后
		this.on("get.vcode.success",function(res){
			var that = this;
			var getBtn = this.getVCodeBtn;
			var last_time = this.RESEND_VCODE_TIME;
			PFT.Help.AlertTo("success",'<p style="width:400px">验证码已发送到手机'+this.mobileInp.val()+'上，'+last_time+'秒后可重新获取</p>',2000);
			clearInterval(this.timer);
			getBtn.text(last_time+"秒后重新获取")
			this.timer = setInterval(function(){
				if(last_time==0){
					getBtn.removeClass("disable").text("获取验证码");
					return clearInterval(that.timer);
				}
				last_time--;
				getBtn.addClass("disable");
				getBtn.text(last_time+"秒后重新获取")
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
		var mobile = $.trim(this.mobileInp.val());
		if(!mobile) return alert("请先填写手机号");
		if(!this.mobileInp.parents(".rt").hasClass("ok")) return alert("请填写正确格式手机号");
		VCode.get(mobile,{
			loading : function(){ tarBtn.addClass("disable").text("正在获取...")},
			complete : function(){ tarBtn.removeClass("disable").text("获取验证码")},
			success : function(res){
				that.trigger("get.vcode.success",res);
			}
		})
	},
	onShowPwdBtnMousedown : function(e){
		this.pwdInp.prop("type","text");
	},
	onShowPwdBtnMouseup : function(e){
		this.pwdInp.prop("type","password");
	},
	//点击注册提交按钮
	onRegSubmitBtnClick : function(e){
		//return this.router.navigate("/step/2",{trigger:true});
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
		this.check_mobile_exist(function(mobile){
			//如果手机号未被注册过
			that.check_vcode_enable(function(vcode){
				//如果此验证码可用
				that.submit_register();
			})
		})
	},
	//提交注册前-校验该帐号名是否被注册过
	check_mobile_exist : function(callback){
		var that = this;
		var submitBtn = this.regSubmitBtn;
		var mobile = that.mobileInp.val();
		Ajax(this.api,{
			params : {
				a : "chkMobile",
				mobile : mobile
			},
			loading : function(){ submitBtn.text("正在注册...").addClass("disable")},
			complete : function(){ submitBtn.text(that.regSubmitBtn_text).removeClass("disable")},
			success : function(res){
				var res = res || {};
				var code = res.code;
				if(code==200){ //手机号未被注册过
					callback && callback(mobile)
				}else{ //当注册时，使用已使用过的手机号时
					var msg = res.msg || '您的手机已被关联到已有的平台帐号';
					Dialog.open({
						container : {
							header : '注册失败',
							content : [
								'<div style="width:300px;" class="dialogCon" style="margin-left:20px">',
								'<div class="line" style="margin-bottom:10px;">'+msg+'</div>',
								'<div class="line" style="margin-bottom:5px;"><a class="dbtn login" style="margin-right:10px" href="dlogin_n.html">点击登录</a>使用此手机号登录</div>',
								'<div class="line" style="margin-bottom:5px;"><a class="dbtn reReg reRegBtn" style="margin-right:10px" href="javascript:void(0)">返回注册</a>更换其它手机号码</div>',
								'</div>'
							].join("")
						},
						offsetY : -100,
						events : {
							"click .reRegBtn" : function(e){
								Dialog.close();
							}
						}
					});
				}
			}
		})
	},
	//提交注册前-校验验证码是否可用
	check_vcode_enable : function(callback){
		var that = this;
		var submitBtn = this.regSubmitBtn;
		var vcode = that.vcodeInp.val();
		Ajax(this.api,{
			params : {
				a : "verifyVcode",
				vcode : vcode
			},
			loading : function(){ submitBtn.text("正在注册...").addClass("disable")},
			complete : function(){ submitBtn.text(that.regSubmitBtn_text).removeClass("disable")},
			success : function(res){
				var res = res || {};
				var code = res.code;
				if(code==200){
					callback && callback(vcode)
				}else{
					alert(res.msg || AJAX_ERROR_TEXT);
				}
			}
		})
	},
	//提交注册
	submit_register : function(){
		var urlQuery = URLParseQuery();
		var dtype = urlQuery.dtype;
		if(!dtype) return alert("缺省dtype");
		var mobile = this.mobileInp.val();
		var vcode = this.vcodeInp.val();
		var password = md5.hex(this.pwdInp.val());
		Ajax(this.api,{
			type : "post",
			params : {
				a : "memberRegister",
				dtype : dtype,
				mobile : mobile,
				password : password,
				vcode : vcode
			},
			loading : function(){},
			complete : function(){},
			success : function(res){
				var res = res || {};
				var code = res.code;
				if(code==200){

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
	}
});
module.exports = VRegister;
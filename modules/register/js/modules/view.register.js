/**
 * Created by Administrator on 16-4-13.
 */
var Ajax = require("../../../../common/js/util.ajax.js");
var Validate = require("../../../../common/js/util.validate.js");
var VRegister = Backbone.View.extend({
	api : {
		getVCode : "call/jh_mem.php",
		register : "call/jh_mem.php"
	},
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
	initialize : function(){
		this.registerBtn = $("#regSubmitBtn");
		this.mobileInp = $("#mobileInp");
		this.pwdInp = $("#pwdInp");
		this.pwdInpParent = this.pwdInp.parents(".rt");
		this.pwdInpErrorTip = this.pwdInpParent.find(".error");
		this.pwdLevelBar = this.pwdInpParent.find(".levelBar");
		this.getVCodeBtn = $("#getValidCodeBtn");
		this.regForm = $("#regForm");
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
		var len = pwd.length;
		//常用英文符号
		var sChar = /[`~!@#\$%\^&\*\(\)_\+\-=\{\[\}\]\\\\|;:'",<>\.\?\/]/g;
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
		if(len<6 || len>20) return onError("位数须在6-20间");
		//判断密码可用性
		//不能全为数字  不能全为字母   不能全为符号
		//须是数字、字母、符号  三项中任意两项或三项组合
		var check = function(pwd){
			var error = "";
			var len = pwd.length;
			if(/\s/g.test(pwd)) return error = "不能包含空格";
			if(Validate.typeNum(pwd)) return error = "不能是纯数字";
			if(Validate.typeEe(pwd)) return error = "不能是纯字母";
			var num_leter_result = [];
			for(var i=0; i<len; i++){
				var s = pwd[i];
				if(Validate.typeNum(s) || Validate.typeEe(s)){
					num_leter_result.push(s);
				}
			}
			if(num_leter_result.length==0) error = "必须包含数字或字母";
			return error;
		};
		//判断密码强弱程度
		//弱密码：6位数字字母(大小写均可)组合。
		//中密码: 7位数及以上 数字字母（小写）组合
		//强密码：7位数及以上 数字字母并且存在大写字母或符号
		var getCheckLevel = function(pwd){
			var len = pwd.length;
			if(len==6) return "weak";
			var hasUpcaseLetterOrChar = (function(){
				var res = false;
				for(var i=0; i<len; i++){
					var s = pwd[i];
					if(Validate.typeE(s) || sChar.test(s)){
						res = true;
						break;
					}
				}
				return res;
			})();
			//只要包含有大写字母或常用符号的7位及以上密码
			if(hasUpcaseLetterOrChar) return "strong";
			return "normal";
		};
		var check_able = check(pwd);
		if(check_able){
			onError(check_able);
		}else{
			var level = getCheckLevel(pwd);
			onOk(level);
		}
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
		Ajax(that.api.getVCode,{
			type : "post",
			dataType : "json",
			params : {
				action : "SendVcode",
				stype : "register",
				mobile : mobile,
				emial : false
			},
			loading : function(){ tarBtn.addClass("disable").text("正在获取...")},
			complete : function(){ tarBtn.removeClass("disable").text("获取验证码")},
			success : function(res){
				var res = res || {};
				var status = res.status;
				var msg = res.msg || "请求出错，请稍后重试";
				if(status=="success"){
					that.trigger("get.vcode.success",res);
				}else{
					alert(msg);
				}
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
		return this.trigger("register.success");
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
		this.submit_register();
	},
	//提交注册
	submit_register : function(){
		var params = this.regForm.serialize();
		Ajax(this.api.register,{
			type : "post",
			dataType : "json",
			params : params,
			loading : function(){},
			complete : function(){},
			success : function(res){}
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
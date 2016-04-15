/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-12.
	 */
	__webpack_require__(1);
	var Placeholder = __webpack_require__(5);
	var SlideManager = __webpack_require__(6);
	var VRegister = __webpack_require__(7);
	var Router = Backbone.Router.extend({
		routes : {
			"" : "main",
			"step/:id" : "step"
		},
		initialize : function(){
			var that = this;
			this.slideManager = new SlideManager();
			this.VRegister = new VRegister();
			this.VRegister.on("register.success",function(){
				that.navigate("step/2",{trigger:true});
			})
			this.slideManager.on("slide.before",function(id){
	
			})
			this.slideManager.on("slide.after",function(id){
	
			})
			Placeholder.init();
		},
		main : function(){
			this.slideManager.slide(1);
		},
		step : function(id){
			this.slideManager.slide(id);
		}
	});
	var router = new Router;
	Backbone.history.start();

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-4-14.
	 */
	module.exports = {
		init : function(){
			if("placeholder" in document.createElement("input")) return false;
			$("input").each(function(){
				var tarInp = $(this);
				var placeholder = tarInp.prop("placeholder");
				var val = $.trim(tarInp.val());
				if(placeholder && !val) tarInp.val(placeholder);
			})
			$(document).on("focus","input",function(e){
				var tarInp = $(e.currentTarget);
				var val = $.trim(tarInp.val());
				var placeholder = tarInp.prop("placeholder");
				if(placeholder && val==placeholder) tarInp.val("");
			}).on("blur","input",function(e){
				var tarInp = $(e.currentTarget);
				var val = $.trim(tarInp.val());
				var placeholder = tarInp.prop("placeholder");
				if(placeholder && !val) tarInp.val(placeholder);
			})
		}
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-4-12.
	 */
	var SlideManager = Backbone.View.extend({
		el : $("#slideContainer"),
		initialize : function(){
			this.stepWidth = this.$el.children().first().width();
		},
		slide : function(id){
			var that = this;
			var dir = -1;
			this.$el.children(".step_"+id).addClass("active").siblings().removeClass("active");
			var id = id-1;
			this.trigger("slide.before",id);
			this.$el.animate({left:dir*id*this.stepWidth},200,function(){
				that.trigger("slide.after",id);
			});
		}
	});
	module.exports = SlideManager;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-13.
	 */
	var Ajax = __webpack_require__(8);
	var Validate = __webpack_require__(9);
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

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-4-13.
	 */
	module.exports = function(url,opt){
		if(!url) return alert("ajax请求缺少url");
		var fn = new Function;
		var opt = opt || {};
		var params = opt.params || {};
		var loading = opt.loading || fn;
		var complete = opt.complete || fn;
		var success = opt.success || fn;
		var timeout = opt.timeout || function(){ alert("请求超时，请稍后重试")};
		var serverError = opt.serverError || function(xhr,txt){
			var txt = txt || "请求出错，请稍后重试";
			if(txt=="parsererror") txt = "请求出错，请稍后重试";
			alert(txt);
		};
		var type = opt.type || "get";
		var dataType = opt.dataType || "json";
		var ttimeout = opt.ttimeout || 120 * 1000;
		$.ajax({
			url : url,
			type : type,
			dataType : dataType,
			data : params,
			timeout :ttimeout,
			beforeSend : function(){
				loading();
			},
			success : function(res){
				complete(res);
				success(res);
			},
			error : function(xhr,txt){
				complete(xhr,txt);
				if(txt == "timeout"){
					timeout(xhr,txt);
				}else{
					serverError(xhr,txt);
				}
			}
		})
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	var Validate = {
		//非空
		noBlank: function( value ){
			return !!value;
		},
		//最小
		min: function( value, rule ){
			return value.length >= rule;
		},
		//最大
		max: function( value, rule ){
			return value.length <= rule;
		},
		//验证常用英文符号，常用于密码验证
		typeChar : function(val){
			//常用英文符号
			var sChar = /[`~!@#\$%\^&\*\(\)_\+\-=\{\[\}\]\\\\|;:'",<>\.\?\/]/g;
			return sChar.test(val);
		},
		typeCN : function(str){
			var result = true;
			var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/g;
			for(var i= 0,len=str.length; i<len; i++){
				if(!reg.test(str)){
					result = false;
					break;
				}
			}
			return result;
		},
		//中文、英文
		typeZE: function( value ){
			return /^[\u4E00-\u9FA5\uf900-\ufa2d\uFE30-\uFFA0a-zA-Z]+$/.test( value );
		},
		//英文、数字
		typeEN: function( value ){
			return /^[0-9|a-z|A-Z]+$/.test( value );
		},
		//只能大写英文字母
		typeE : function(value){
			return /^[A-Z]+$/g.test(value);
		},
		//只能小写英文字母
		typee : function(value){
			return /^[a-z]+$/g.test(value);
		},
		//只能大小写英文字母
		typeEe : function(value){
			return /^[a-zA-Z]+$/g.test(value);
		},
		//数字
		typeNum: function( value ){
			return !isNaN( value );
		},
		//电话
		typePhone: function( value ){
			var reg = /^1[0-9]{10}$/;
			return reg.test( value );
		},
		//email
		typeEmail: function( value ){
			return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(value)
		},
		//身份证号合法性验证
		//支持15位和18位身份证号
		//支持地址编码、出生日期、校验位验证
		idcard : function(code){
			var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
			var tip = "";
			var pass= true;
	
			if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
				tip = "身份证号格式错误";
				pass = false;
			}else if(!city[code.substr(0,2)]){
				tip = "地址编码错误";
				pass = false;
			}else{
				//18位身份证需要验证最后一位校验位
				if(code.length == 18){
					code = code.split('');
					//∑(ai×Wi)(mod 11)
					//加权因子
					var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
					//校验位
					var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
					var sum = 0;
					var ai = 0;
					var wi = 0;
					for (var i = 0; i < 17; i++)
					{
						ai = code[i];
						wi = factor[i];
						sum += ai * wi;
					}
					var last = parity[sum % 11];
					if(parity[sum % 11] != code[17]){
						tip = "校验位错误";
						pass =false;
					}
				}
			}
			return pass;
		}
	};
	module.exports = Validate;


/***/ }
/******/ ]);
//# sourceMappingURL=register.all.js.map
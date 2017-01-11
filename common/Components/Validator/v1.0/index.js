/**
 * Author: huangzhiyang
 * Date: 2016/12/26 12:02
 * Description: ""
 *
 * how to use
 *
 * var Validator = require("COMMON/Components/Validator");  //引入验证器
 *
 * console.log(Validator.Rules)  //可以查看下验证器内所有预置的验证规则
 *
 * var explam = Validator.Rules.mobile("18309517966");
 *
 * if(explam.isOk){
 * 		console.log("手机号验证通过")
 * }else{
 * 		console.log(explam.errMsg || "手机号格式错误")
 * }
 *
 *
 *
 * var validateMobile = Validate({
		target : $("#mobileInp"),            						//要验证的input
		event : "blur",                      						//当blur事件触发时 验证
		rule : ["require","mobile"],         						//验证规则  规则集在目录下的rules.js文件下
		callback : function(rule,isOk,errMsg,errCode,target,value){ //验证完成后会自动执行里面的代码

		  	//rule：当前验证的是哪条规则，比如在这里，rule有require、mobile这2个，所以callback会被执行2次  第1次执行时,rule=="require" 第2次执行时 rule==mobile
		  	//isok：针对当前规则，验证是否通过  isok=true/false
		  	//errMsg： 验证不通过时的提示信息
		  	//errCode：验证不通过时错误代码
		  	//target：指向当前被验证的input元素
		  	//value: 当前input元素的值

		  	if(isOk){

		  	}else{

		  	}
		}
	});
 *
 *  Validate方法执行后会return一个值
 *  这里，validateMobile也是一个验证器，可以直接调用
 *
 *  var result = validateMobile();
 *  if(result.isOk){ //require跟mobile规则都验证通过
 *
 *  }else{ //只要有一个规则不通过说明对此input的验证就是不通过的，此时表单不能提交
 *
 *  }
 *
 *
 *
 */


var Rules = require("./rules");
var Help = require("./help");
function Validate(opt){
	opt = opt || {};
	var target = opt.target;
	var rule = opt.rule;
	var callback = opt.callback || function(){};
	var event = opt.event;
	var getValue = function(){
		var value = opt.value;
		if(typeof value==="function"){
			value = value(target)
		}else{
			value = $.trim(target.val());
		}
		if(typeof value==="undefined"){
			console.error("missing value param");
			return false;
		}
		return value;
	};

	if(!target.length){
		console.error("missing target param");
		return false;
	}
	if(typeof event=="string") event = event.split(",");
	if(typeof rule==="string") rule = rule.split(",");
	if(rule.length==0){
		console.error("need at least one rule");
		return false;
	}

	var validate = function(){
		var value = getValue();

		if(value===false){
			console.error("can not get value");
			return false;
		}
		for(var i=0; i<rule.length; i++){
			var _rule = rule[i];
			var _isOk = 1;
			var _errMsg = "";
			var _errCode = "";
			if(typeof _rule==="string" && Rules[_rule]){
				var _res = Rules[_rule](value);
				_isOk = _res.isOk;
				_errMsg = _res.errMsg;
				_errCode = _res.errCode;
				callback(_rule,_isOk,_errMsg,_errCode,target,value);
				if(_isOk){
					target.removeClass("validate-error");
				}else{
					target.addClass("validate-error");
					return{
						isOk : _isOk,
						errMsg : _errMsg,
						errCode : _errCode
					}
				}
			}else if(Help.isObject(_rule)){
				for(var r in _rule){
					var _ru = _rule[r];
					var _rus = _ru(value);
					var _isOk = _rus.isOk;
					var _errMsg = _rus.errMsg;
					var _errCode = _rus.errCode;
					callback(r,_isOk,_errMsg,_errCode,target,value);
					if(!_isOk){
						target.removeClass("validate-error");
					}else{
						target.addClass("validate-error");
						return{
							isOk : _isOk,
							errMsg : _errMsg,
							errCode : _errCode
						}
					}
				}
			}else{
				console.error("no "+i+" rule in base rules");
				return false;
			}
		}

		return{
			isOk : true,
			errMsg : "",
			errCode : ""
		}
	}

	if(Help.isArray(event) && event.length>0){
		for(var e=0; e<event.length; e++){
			var _event = event[e];
			target.on(_event,function(e){
				validate();
			})
		}
		return validate;
	}else{
		return validate();
	}

}
Validate.Rules = Rules;

module.exports = Validate;

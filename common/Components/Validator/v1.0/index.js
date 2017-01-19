/**
 * Author: huangzhiyang
 * Date: 2016/12/26 12:02
 * Description: ""
 *
 * how to use
 *
 * var Validator = require("COMMON/Components/Validator");  //������֤��
 *
 * console.log(Validator.Rules)  //���Բ鿴����֤��������Ԥ�õ���֤����
 *
 * var explam = Validator.Rules.mobile("18309517966");
 *
 * if(explam.isOk){
 * 		console.log("�ֻ�����֤ͨ��")
 * }else{
 * 		console.log(explam.errMsg || "�ֻ��Ÿ�ʽ����")
 * }
 *
 *
 *
 * var validateMobile = Validate({
		target : $("#mobileInp"),            						//Ҫ��֤��input
		event : "blur",                      						//��blur�¼�����ʱ ��֤
		rule : ["require","mobile"],         						//��֤����  ������Ŀ¼�µ�rules.js�ļ���
		callback : function(rule,isOk,errMsg,errCode,target,value){ //��֤��ɺ���Զ�ִ������Ĵ���

		  	//rule����ǰ��֤�����������򣬱��������rule��require��mobile��2��������callback�ᱻִ��2��  ��1��ִ��ʱ,rule=="require" ��2��ִ��ʱ rule==mobile
		  	//isok����Ե�ǰ������֤�Ƿ�ͨ��  isok=true/false
		  	//errMsg�� ��֤��ͨ��ʱ����ʾ��Ϣ
		  	//errCode����֤��ͨ��ʱ�������
		  	//target��ָ��ǰ����֤��inputԪ��
		  	//value: ��ǰinputԪ�ص�ֵ

		  	if(isOk){

		  	}else{

		  	}
		}
	});
 *
 *  Validate����ִ�к��returnһ��ֵ
 *  ���validateMobileҲ��һ����֤��������ֱ�ӵ���
 *
 *  var result = validateMobile();
 *  if(result.isOk){ //require��mobile������֤ͨ��
 *
 *  }else{ //ֻҪ��һ������ͨ��˵���Դ�input����֤���ǲ�ͨ���ģ���ʱ�������ύ
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

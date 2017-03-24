/**
 * Author: huangzhiyang
 * Date: 2016/12/29 15:39
 * Description: ""
 */

// var result  = form.valid();
// if(result.isOk){
// 	//submit()
// }else{
// 	console.log(result.msg,result,code);
// }



// var d = new Validator({
// 	container : $("#form"),
// 	field : [{
// 		target : ".selector",
// 		value : function(target){

// 		},
// 		rule : "require,mobile",
// 		event : "blur",
// 		ok : function(result){},
// 		fail : function(result){

// 		}
// 	}]
// });







var Rules = require("./rules.js");


function Validator(opt){
	//无new实例化
	if(!(this instanceof Validator)) return new Validator(opt);
	this.field = opt.field || [];
	this.container = opt.container || null;
	if(typeof this.container==="string"){
		this.container = $(this.container);
	}


	this.__mapEvents();

}

Validator.Rules = Rules;

Validator.prototype = {
	__validResult : {
		isOk : false,
		errMsg : "",
		errCode : ""
	},
	__valid : function(opt){

		// opt = {
		// 	target : ".textInp",             //css选择器
		// 	rule : ["require"],              //验证规则  支持多个规则
		// 	value : function(target){        //要验证的目标dom元素的值  可选
		// 		return target.val();
		// 	},
		// 	ok : function(result){},         //所有规则都验通过后
		// 	fail : function(result){}        //只要有一个规则验证不通过，即代表对此dom元素的验证不通过
		// }
		// opt.rule有以下几种形式：
		// rule = ["require,mobile"]
		// rule = "require,mobile"   //等同于上面的写法
		// rule = ["require","mobile",{    //自定义规则，规则名为customRule,后面跟的fn即是此验证规则的实现
		// 	"customRule" : function(value){   
				// var result = {   //result固定是这个格式
				// 	isOk : true,
				// 	errMsg : "",
				// 	errCode : ""
				// };

				// if(value.length>10){
				// 	result["isOk"] = false;
				// 	result["errMsg"] = "不能超过10个字符";
				// 	result["errCode"] = 5;  //errCode自定
				// }else{
				// 	result["isOk"] = true;
				// }

				// return result;   //注意：这里必须把result return出去，否则会报错

		// 	}
		// }]

		opt = opt || {};
		var that = this;
		var container = this.container;
		var target = opt.target;
		if(typeof target!=="string") return console.error("target must be a css selector");
		target = container ? container.find(target) : $(target);

		var value = typeof opt.value==="function" ? opt.value(target) : target.val();
		value = $.trim(value);

		var rule = opt.rule;
		if(typeof rule=="string"){
			rule = rule.split(",");
		}else if(Object.prototype.toString.call(rule)!=="[object Array]"){
			if(rule.length==0) return console.error("not rule exist");
		}else{
			return console.error("rule must be array or string");
		}

		var ok = opt.ok || function(){};
		var fail = opt.fail || function(){};

		var isOk = true;

		//开始验证
		for(var i=0,len=rule.length; i<len; i++){
			var _rule = rule[i];
			var _valid;
			var res;
			if(typeof _rule==="string"){
				if(Rules[_rule]){  //如果这个规则在预置规则里已存在
					_valid = Rules[_rule];
					res = _valid(value);
					res["rule"] = _rule;
					res["value"] = value;
					if(!res.isOk){
						that.__validResult.isOk = false;
						that.__validResult.errMsg = res.errMsg;
						that.__validResult.erCode = res.errCode;
						isOk = false;
						fail(res);
						break;
					}
				}else{
					console.error("no rule in Rules");
				}
			}else if(Object.prototype.toString.call(_rule)=="[object Object]"){ //自定义规则需要以{rulename:validatFn}形式
				for(var k in _rule){
					res = _rule[k](value);
					res["rule"] = k;
					res["value"] = value;
					if(!res.isOk){
						that.__validResult.isOk = false;
						that.__validResult.errMsg = res.errMsg;
						that.__validResult.erCode = res.errCode;
						isOk = false;
						fail(res);
					}
				}
				if(!isOk) break;
			}
		}

		//如果所有规则都被验证通过
		if(isOk) ok({isOk:true,value:value,rule:rule});

	},
	__mapEvents : function(){
		var that = this;
		var container = this.container;
		var field = this.field;
		for(var i=0; i<field.length; i++){
			var _field = field[i];
			(function(field){
				var event = field.event;
				if(typeof event=="string"){
					event = event.replace(","," ");
				}else if(Object.prototype.toString.call(event)=="[object Array]" && event.length>0){
					event = event.join(" ");
				}
				var target = field.target;
				if(container){
					container.on(event,target,function(e){
						that.__valid(field);
					})
				}else{
					target.on(event,function(e){
						that.__valid(field);
					})
				}
			})(_field)
		}
	},
	/**
     * 验证全部或验证某一项
	 */
	valid(index){
		var that = this;
		this.__validResult = {
			isOk : true,
			errMsg : "",
			errCode : ""
		};

		var field = this.field;
		if(typeof index==="number" && field[index]){
			this.__valid(index);
		}else{
			for(var i=0,len=field.length; i<len; i++){
				that.__valid(field[i]);
			}
		}

		return this.__validResult;

	}
};


module.exports = Validator;

















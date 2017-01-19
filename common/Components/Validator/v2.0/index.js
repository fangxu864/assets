/**
 * Author: huangzhiyang
 * Date: 2016/12/29 15:39
 * Description: ""
 */
var form = new Form({
	container : $("#form"),
	field : {
		name : {
			value : "sdfdf",
			validate : {
				rule : "require,mobile",
				event : "blur",
				ok : function(){},
				error : function(msg,code){

				}
			}
		},
		mobile : {
			value : "12445234234",
			validate : {
				rule : ["require","mobile",{
					"isChar" : function(val){

					}
				}],
				event : "blur",
				ok : function(){},
				error : function(msg,code){

				}
			}
		}
	},
	template : function(){
		return '<div><%=name%></div>'
	},
	methods : {

	},
	submit : "api.12301.cc/r/c/a"
});


var result  = form.valid();
if(result.isOk){
	//submit()
}else{
	console.log(result.msg,result,code);
}



var d = new Validator({
	container : $("#form"),
	field : [{
		target : ".selector",
		value : function(target){

		},
		rule : "require,mobile",
		event : "blur",
		ok : function(){},
		fail : function(msg,code){

		}
	}]
});







var Rules = require("./rules.js");


function Validator(opt){
	//无new实例化
	if(!this instanceof Validator) return new Validator(opt);
	this.field = opt.field || [];
	this.container = opt.container || null;
}

Validator.Rules = Rules;

Validator.prototype = {
	__validResult : {
		isOk : false,
		errMsg : "",
		errCode : ""
	},
	__init : function(){},
	__valid : function(opt){
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
					res.isOk ? ok(res) : fail(res);
					if(!res.isOk){
						that.__validResult.isOk = false;
						that.__validResult.errMsg = res.errMsg;
						that.__validResult.erCode = res.errCode;
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
					res.isOk ? ok(res) : fail(res);
					if(!res.isOk){
						that.__validResult.isOk = false;
						that.__validResult.errMsg = res.errMsg;
						that.__validResult.erCode = res.errCode;
						break;
					}
				}
			}
		}
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
					console.log("event="+event);
				}else if(Object.prototype.toString.call(event)=="[object Array]" && event.length>0){
					event = event.join(" ");
					console.log("event="+event);
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

		this.__validResult = {
			isOk : true,
			errMsg : "",
			errCode : ""
		};
		
		var field = this.field;
		if(typeof index==="number" && field[index]){

		}else{

		}

	}
};


















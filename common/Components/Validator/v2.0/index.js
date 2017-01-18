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
	__init : function(){},
	__valid : function(opt){
		opt = opt || {};
		var container = this.container;
		var target = opt.target;
		if(typeof target!=="string") return console.error("target must be a css selector");
		target = container ? container.find(target) : $(target);

		var value = typeof opt.value==="function" ? opt.value(target) : target.val();
		value = $.trim(value);

		var rule = opt.rule;
		if(typeof rule==="string") rule = rule.split(",");
		if(Object.prototype.toString.call(rule)!=="[object Array]") return console.error("rule must be array or string");
		if(rule.length==0) return false;
		var event = opt.event;
		if(typeof event==="string") event = rule.split(",");
		if(event && Object.prototype.toString.call(event)!=="[object Array]") return console.error("event must be array or string");
		var ok = opt.ok || function(){};
		var fail = opt.fail || function(){};




	},
	__mapEvents : function(){
		if(this.container){
			
		}else{

		}
	}
};


















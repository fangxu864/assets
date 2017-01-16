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
		target : textInp,
		rule : "require,mobile",
		event : "blur",
		ok : function(){},
		fail : function(msg,code){

		}
	}]
});





function Validator(opt){
	//无new实例化
	if(!this instanceof Validator) return new Validator(opt);
	this.field = opt.field || [];
	this.container = opt.container || null;
}
Validator.prototype = {
	__init : function(){},
	__valid : function(opt){

	}
};


















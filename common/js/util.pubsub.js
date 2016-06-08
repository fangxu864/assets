/**
 * Author: huangzhiyang
 * Date: 2016/6/7 10:09
 * Description: 订阅发布模型
 */
var E = {
	fn : {},
	on : function(type,fn){
		var fns = this.fn[type] || (this.fn[type]=[]);
		fns.push(fn);
	},
	fire : function(type){
		var fns = this.fn[type];
		if(!fns) return false;
		var args = arguments;
		var len = args.length;
		var argus,scope;
		if(len==1){
			argus = "";
			scope = this;
		}else if(len==2){
			argus = args[len-1];
			scope = this;
		}else if(len==3){
			argus = args[len-2];
			scope = args[len-1];
		}
		for(var i in fns){
			var fn = fns[i];
			fn.call(scope,argus);
		}
	},
	trigger : function(type){
		this.fire(type);
	}
};
module.exports = E;
/**
 * Created by Administrator on 16-4-20.
 */
var Ajax = require("./util.ajax.js");
var fn = new Function;
var ERROR = "请求出错，请稍后重试";
//验证码操作相关
module.exports = {
	api : "route/?c=Member_Register",
	//获取验证码
	get : function(mobile,opt){
		if(!mobile) return false;
		var opt = opt || {};
		var url = opt.url;
		var api = url ? url : this.api;
		var success = opt.success || fn;
		var fail = opt.fail;
		Ajax(api,{
			params : {
				a : "sendVcode",
				mobile : mobile
			},
			loading : opt.loading,
			complete : opt.complete,
			success : function(res){
				var res = res || {};
				var code = res.code;
				var msg = res.msg || "请求出错，请稍后重试";
				if(code==200){
					success(res);
				}else{
					res["msg"] = msg;
					fail ? fail(res) : alert(msg);
				}
			},
			timeout : opt.timeout,
			serverError : opt.serverError
		})
	},
	//校验验证码
	check : function(vcode,opt){
		if(!vcode) return false;
		var opt = opt || {};
		var url = opt.url;
		var api = url ? url : this.api;
		var success = opt.success || fn;
		var fail = opt.fail;
		Ajax(api,{
			params : {
				a : "verifyVcode",
				vcode : vcode
			},
			loading : opt.loading,
			complete : opt.complete,
			success : function(res){
				var res = res || {};
				var code = res.code;
				var msg = res.msg || "请求出错，请稍后重试";
				if(code==200){
					success(res);
				}else{
					res["msg"] = msg;
					fail ? fail(res) : alert(msg);
				}
			},
			timeout : opt.timeout,
			serverError : opt.serverError
		})
	}
}
/**
 * Created by Administrator on 16-3-30.
 */
var Api = {
	fn : new Function,
	AJAX_TIMEOUT : "请求起时，请稍后重试",
	AJAX_SERVERERROR : "请求出错，请稍后重试",
	api : {
		jh_refund_audit : "call/jh_refund_audit.php",
		repush : "module/api/RefundNotice.php",
		handle : "call/handle.php",
		terminal_revoke : "call/terminal_revoke.php"
	},
	//获取列表
	getList : function(page,params,opt){
		var that = this;
		var opt = opt || {};
		var page = page || 1;
		page = "&page="+page;
		var action = "&action=get_audit_list";
		var limit = "&limit=20"; //每页显示多少条数据
		var url = this.api.jh_refund_audit+"?"+params+action+page+limit;
		var fn = this.fn;
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var success = opt.success || fn;
		var empty = opt.empty || fn;
		var fail = opt.fail || fn;
		var unlogin = opt.unlogin || fn;
		PFT.Ajax({
			url :url,
			type : "get",
			dataType : "json",
			ttimeout : 30 * 60 *1000,
			loading : function(){
				loading()
			},
			removeLoading : function(){
				removeLoading()
			},
			timeout : function(){ alert(that.AJAX_TIMEOUT)},
			serverError : function(){ alert(that.AJAX_SERVERERROR)}
		},function(res){
			var res = res || {};
			var code = res.code;
			var data = res.data;
			var list = data.audit_list;
			if(!res["msg"]) res["msg"] = that.AJAX_SERVERERROR;
			if(code==200){
				if(list.length){
					success(res);
				}else{
					empty(res);
				}
			}else if(code==102){
				unlogin(res);
			}else{
				fail(res)
			}
		})
	},
	//再次推送
	repush : function(opt){
		var that = this;
		var opt = opt || {};
		var params = opt.params || {};
		var fn = this.fn;
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var success = opt.success || fn;
		var fail = opt.fail || fn;
		var api = this.api.repush;
		params["action"] = "repush";
		PFT.Ajax({
			url : api,
			type : "post",
			dataType : "json",
			data : params,
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(){ alert(that.AJAX_TIMEOUT)},
			serverError : function(){ alert(that.AJAX_SERVERERROR);}
		},function(res){
			var res = res || {};
			var code = res.code;
			if(!res.msg) res["msg"] = that.AJAX_SERVERERROR;
			if(code==200){
				success(res);
			}else{
				fail(res);
			}
		})
	},
	//同意&拒绝
	audit : function(api,opt){
		var that = this;
		var opt = opt || {};
		var params = opt.params || {};
		var fn = this.fn;
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var success = opt.success || fn;
		var fail = opt.fail || fn;
		PFT.Ajax({
			url : api,
			type : "post",
			dataType : "json",
			data : params,
			ttimeout : 60 * 1000,
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(){ alert(that.AJAX_TIMEOUT)},
			serverError : function(){ alert(that.AJAX_SERVERERROR);}
		},function(res){
			var res = res || {};
			var code = res.code;
			if(!res.msg) res["msg"] = that.AJAX_SERVERERROR;
			if(code==200 || (api=="call/jh_refund_audit.php" && code==243) || (api=="call/handle.php" && res.outcome==1)){
				success(res);
			}else{
				fail(res);
			}
		})
	}
};
module.exports = Api;
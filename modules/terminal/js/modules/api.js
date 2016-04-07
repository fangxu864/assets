/**
 * Created by Administrator on 16-3-31.
 */
var Api = {
	DEFAULT_IMG : "http://www.12301.cc/images/defaultThum.jpg",
	LOADING_IMG : "http://www.12301.cc/images/icons/gloading.gif",
	PMODE : { //订单的支付方式
		"0" : "账户余额支付",
		"1" : "支付宝支付",
		"2" : "授信支付",
		"3" : "产品自销",
		"4" : "现场支付",
		"5" : "微信支付"
	},
	PAYSTATUS : { //当前订单的支付状态
		0 : "景区到付",
		1 : "已成功",
		2 : "未支付"
	},
	ORDERSTATUS : { //当前订单的状态
		"0" : "未使用",
		"1" : "已使用",
		"2" : "已过期",
		"3" : "已取消",
		"4" : "凭证码被替代",
		"5" : "被终端撤销(已取消)",
		"6" : "被终端撤销(已使用)"
	},
	fn : new Function,
	api : {
		//获取产品
		fetchProduct : "terminal_chk.html",
		//验证&搜索订单
		//terminal : "call/terminal.php",
		//2015-10-19改
		terminal : "api/index.php?f=terminal",
		queryOrder : "api/index.php?f=terminal"
	},
	AJAX_TIMEOUT : 1000 * 60, //秒
	AJAX_TIMEOUT_TEXT : "请求超时，请稍后重试",
	AJAX_ERROR_TEXT : "请求出错，请稍后重试",
	isObjectEmpty : function(obj){
		var result = true;
		for(var i in obj){
			result = false;
			break;
		}
		return result;
	},
	getSid : function(){
		return $("#gsid").val() || "";
	},
	getSalerid : function(){
		return $.trim($("#term_prodNum").text()) || "";
	},
	getVoucher : function(){
		return $.trim($("#termSearInp").val());
	},
	checkIsAdmin : function(){ return $("#isAdmin").val()},
	//载入产品
	fetchProduct : function(params,opt){
		var that = this;
		var params = params || {};
		var opt = opt || {};
		var api = this.api.fetchProduct;
		var fn = this.fn;
		var keyword = params.keyword || "";
		var sid = params.sid || "";
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var timeout = opt.timeout || function(){ alert(this.AJAX_TIMEOUT_TEXT)};
		var serverError = opt.serverError || function(){ alert(this.AJAX_ERROR_TEXT)};
		var empty = opt.empty || fn;
		var success = opt.success || fn;
		var fail = opt.fail || fn;
		var xhr;
		xhr = PFT.Ajax({
			url : api,
			type : "get",
			dataType : "json",
			ttimeout : that.AJAX_TIMEOUT * 1000,
			data : {
				"action" : "queryproduct",
				"keyword" : keyword,
				"sid" : sid
			},
			loading : function(){
				loading();
			},
			removeLoading : function(){
				removeLoading();
			},
			timeout : function(res) {
				timeout(res);
			},
			serverError : function(res) {
				serverError(res);
			}
		},function(res){
			if(res.status=="success"){
				if(res.list && res.list.length>0){
					success(res);
				}else{
					empty(res);
				}
			}else{
				fail(res);
			}
		})
		return xhr;
	},
	/**
	 * 前后端数据请求核心接口
	 * @param salerid(必须)   商家编码
	 * @param voucher(必须)   输入的查询字段  凭证码&手机号&订单号    当cmode为3时，只能输入订单查询
	 */
	queryOrder : function(salerid,voucher,opt){
		var that = this;
		if(!salerid || !voucher) return false;
		salerid = $.trim(salerid);
		voucher = $.trim(voucher);
		var api = this.api.queryOrder;
		var fn = this.fn;
		var opt = opt || {};
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var success = opt.success || fn;
		var empty = opt.empty || fn;
		var unlogin = opt.unlogin || fn;
		var fail = opt.fail || fn;
		var timeout = opt.timeout || function(){ alert(that.AJAX_TIMEOUT_TEXT)};
		var serverError = opt.serverError || function(){ alert(that.AJAX_ERROR_TEXT)};
		var data = {
			query : 1,
			salerid : salerid,
			voucher : voucher
		};
		PFT.Ajax({
			url : api,
			type : "get",
			dataType : "json",
			data : data,
			ttimeout : that.AJAX_TIMEOUT,
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(res){ console.log("timeout"); timeout(res)},
			serverError : function(res){ console.log("timeout"); serverError(res)}
		},function(res){
			var res = res || {};
			var status = res.status;
			var code = res.code;
			if(status=="success"){
				var orders = res.orders;
				if(orders && !that.isObjectEmpty(orders)){
					success(res);
				}else{
					empty(res);
				}
			}else if(status=="fail" && code==0){
				unlogin(res);
			}else if(status=="fail" && res.msg){
				fail(res);
			}
		})
	},
	/**
	 * 验票
	 * @param params
	 *    params: check_method  1=保留余票  0=取消余票
	 *    params: salerid 产品id(景区id)
	 *    params: ordernum 订单号
	 *    params: list   子订单列表
	 *    params: rtime  过期订单
	 * @param opt
	 */
	terminal : function(params,opt){
		var that = this;
		var api = this.api.terminal;
		var params = params || {};
		var opt = opt || {};
		var fn = this.fn;
		var check_method = params.check_method || 0;
		var salerid = params.salerid || "";
		var ordernum = params.ordernum || "";
		var list = params.list || ""; //字符串string
		var rtime = params.rtime || "";
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var success = opt.success || fn;
		var fail = opt.fail || fn;
		var unlogin = opt.unlogin || fn;
		var timeout = opt.timeout || function(){ alert(that.AJAX_TIMEOUT_TEXT)};
		var serverError = opt.serverError || function(){ alert(that.AJAX_ERROR_TEXT)};
		var data = {
			check : 1,
			salerid : salerid,
			ordernum : ordernum,
			check_method : check_method,
			list : list,
			rtime : rtime
		};
		PFT.Ajax({
			url : api,
			type : "post",
			dataType : "json",
			data : {
				data : PFT.Help.JSON.stringify(data)
			},
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(){ timeout()},
			serverError : function(){ serverError()}
		},function(res){
			var res = res || {};
			var status = res.status;
			var code = res.code;
			var msg = res.msg;
			if(status=="success"){
				success(res);
			}else if(status=="fail" && code==0){ //登录过期
				unlogin(res);
			}else{
				res["msg"] = msg || that.AJAX_ERROR_TEXT;
				fail(res);
			}
		})
	}
};
module.exports = Api;
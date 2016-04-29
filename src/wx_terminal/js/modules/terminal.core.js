/**
 * Created by Administrator on 15-9-28.
 */
var AdaptOrder = require("./adaptOrder.js");
var TerminalCore = RichBase.extend({
	fn : new Function,
	AJAX_TIMEOUT_TEXT : "请求超时，请稍后重试",
	AJAX_ERROR_TEXT : "请求出错，请稍后重试",
	statics : {
		PAYTYPE : {
			"0" : "账户余额支付",
			"1" : "支付宝支付",
			"2" : "授信支付",
			"3" : "产品自销",
			"4" : "现场支付",
			"5" : "微信支付"
		},
		PAYSTATUS : {
			0 : "景区到付",
			1 : "已成功",
			2 : "未支付"
		},
		ORDERSTATUS : {
			"0" : "未使用",
			"1" : "已使用",
			"2" : "已过期",
			"3" : "已取消",
			"4" : "凭证码被替代",
			"5" : "被终端撤销(已取消)",
			"6" : "被终端撤销(已使用)",
			"7" : "已部分使用"
		},
		api : "../m/voucher_check.php",
		queryOrderApi : "../m/terminal.php?debug=2",
		timeout : 5 * 60 * 1000,
		showMask : function(){
			$("#gmaskLayer").show().css("z-index",100002);
		},
		hideMask : function(){
			$("#gmaskLayer").hide().css("z-index",-1);
		},
		showLogin : function(){
			$("#loginWrap").show().css("z-index",100001);
		},
		hideLogin : function(){
			$("#loginWrap").hide().css("z-index",-1);
		},
		getSalerid : function(){
//			return "867000";
			return $("#productname").attr("data-salerid") || "";
		},
		tpl : {
			orderItem : require("../../tpl/orderlist_webpack.html"),
			terminalSuccess : require("../../tpl/terminallSuccess_webpack.html")
		}
	},
	init : function(){},
	isObjectEmpty : function(obj){
		var result = true;
		for(var i in obj){
			result = false;
			break;
		}
		return result;
	},
	getObjectLength : function(obj){
		var obj = obj || {};
		var len = 0;
		for(var i in obj){
			len+=1;
		}
		return len;
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
		var api = this.statics.queryOrderApi;
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
				data : JSON.stringify(data)
			},
			ttimeout : this.statics.ttimeout,
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
	},
	//拉取景区产品数据
	loadProduct : function(opt){
		var that = this;
		var opt = opt || {};
		var fn = new Function;
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var success = opt.success || fn;
		var empty = opt.empty || fn;
		var error = opt.error || fn;
		var timeout = opt.timeout || fn;
		var serverError = opt.serverError || fn;
		var unlogin = opt.unlogin || fn;
		var url = this.statics.api;
		var ttimeout = this.statics.ttimeout;
		PFT.Ajax({
			url : url,
			type : "post",
			dataType : "json",
			cache : true,
			data : { "act":"get_landlist"},
			ttimeout : ttimeout,
			loading : function(){
				loading();
				that.fire("product.loading");
			},
			removeLoading : function(){
				removeLoading();
				that.fire("product.removeLoading");
			},
			timeout : function(res){
				timeout(res);
				that.fire("product.timeout",res);
			},
			serverError : function(res){
				serverError(res);
				that.fire("product.serverError",res);
			}
		},function(res){
			var errormsg = res.errormsg;
			var status = res.sta;
			var list = res.list;
			if(status=="success"){
				if(list.length){
					success(res);
					that.fire("product.success",res);
				}else{
					empty(res);
					that.fire("product.empty",res);
				}
			}else if(errormsg=="unlogin"){
				unlogin(res);
				that.fire("product.unlogin",res);
			}else{
				error(res);
				that.fire("product.error",res);
			}
		})
	},
	/**
	 * 查询某个产品下的订单
	 * @param salerid  产品编号
	 * @param number   证码，电话号码，身份证  三者任意一种
	 */
	queryOrder : function(salerid,number,opt){
		if(!salerid || !number){
			alert("缺省salerid景区6位帐号 或 voucher凭证码/手机号/身份证");
			return false;
		}
		number = $.trim(number);
		var that = this;
		var fn = new Function;
		var opt = opt || {};
		var api = this.statics.queryOrderApi;
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var unlogin = opt.unlogin || fn;
		var empty = opt.empty || fn;
		var success = opt.success || fn;
		var error = opt.error || fn;
		var timeout = opt.timeout || fn;
		var serverError = opt.serverError || fn;
		PFT.Ajax({
			url : api,
			type : "get",
			dataType : "json",
			data : {
				query : 1,
				salerid : salerid,
				voucher : number
			},
			ttimeout : that.statics.timeout,
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(){ timeout()},
			serverError : function(){ serverError()}
		},function(res){
			var res = res || {};
			//debug
			//res = '{"status":"success","orders":{"3288333":{"ordernum":"3288333","code":"642364","mcode":"642364","ptype":"A","pmode":"2","status":"7","landid":"15358","series":"0","endtime":"2016-04-28","ordertel":"18359183441","ordername":"\u5c0f","ordertime":"2016-04-28 11:21:38","begintime":"2016-04-28","paystatus":"1","checktime":"2016-04-28 11:22:24","tickets":[{"tid":33449,"tnum":0,"tnum_s":2,"name":"\u6210\u4eba\u7968","tprice":"3","ordernum":"3288333","status":1,"batch_check":"0","refund_audit":"1"},{"tid":33450,"tnum":0,"tnum_s":1,"name":"\u8001\u4eba\u7968","tprice":"3","ordernum":"3288334","status":"1","batch_check":"0","refund_audit":"1"}]}}}';
			//res = '{"status":"success","orders":{"3288333":{"ordernum":"3288333","code":"642364","mcode":"642364","ptype":"A","pmode":"2","status":"7","landid":"15358","series":"0","endtime":"2016-04-28","ordertel":"18359183441","ordername":"\u5c0f","ordertime":"2016-04-28 11:21:38","begintime":"2016-04-28","paystatus":"1","checktime":"2016-04-28 11:22:24","tickets":[{"tid":33449,"tnum":0,"tnum_s":2,"name":"\u6210\u4eba\u7968","tprice":"3","ordernum":"3288333","status":1,"batch_check":"0","refund_audit":"1"},{"tid":33450,"tnum":0,"tnum_s":1,"name":"\u8001\u4eba\u7968","tprice":"3","ordernum":"3288334","status":"1","batch_check":"0","refund_audit":"1"}]}}}';
			//res = JSON.parse(res);
			//res.orders["1343434"] = res.orders["3288333"];
			var status = res.status;
			var code = res.code;
			if(status=="success"){
				var orders = res.orders;
				if(orders && !that.isObjectEmpty(orders)){
					for(var i in orders){
						var order = orders[i];
						AdaptOrder.adapt(order);
					}
					success(orders);
				}else{
					empty(res);
				}
			}else if(status=="fail" && code==0){
				unlogin(res);
			}else if(status=="fail" && res.msg){
				error(res);
			}
		})
	}
});
module.exports = TerminalCore;
/**
 * Author: huangzhiyang
 * Date: 2016/10/12 11:23
 * Description: ""
 */

//微信支付
exports.Wx = function(opt){
	var opt = opt || {};
	var fn = new Function;
	var WeixinJSBridge = opt.WeixinJSBridge;
	var data = opt.data;
	if(!WeixinJSBridge || !data) return false;
	var url = opt.url || "http://wx.12301.cc/api/index.php?c=pay_WxPay&a=order";
	var loading = opt.loading || fn;
	var complete = opt.complete || fn;
	var success = opt.success || fn;
	var error = opt.error || fn;
	var timeout = opt.timeout || fn;
	var serverError = opt.serverError || fn;
	var loading_wx = opt.loading_wx || fn;
	var complete_wx = opt.complete_wx || fn;
	var success_wx = opt.success_wx || fn;
	var cancel_wx = opt.cancel_wx || fn;
	var fail_wx = opt.fail_wx || fn;
	var error_wx = opt.error_wx || fn;
	loading();
	$.ajax({
		url : url,
		type : "post",
		dataType : "json",
		data : data,
		beforeSend : function(){ loading()},
		success : function(res){
			complete();
			var res = res || {};
			var status = res.status;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			var res_data = res.data;
			if(status=="ok"){
				loading_wx();
				WeixinJSBridge.invoke('getBrandWCPayRequest',res_data,function(data){
					complete_wx(data);
					if(data.err_msg == "get_brand_wcpay_request:ok" ){
						success_wx(data);
					}else if(data.err_msg == "get_brand_wcpay_request:cancel") {
						alert('您取消了支付，支付成功后订单才会生效哦~');
						cancel_wx(data);
					}else if (data.err_msg == "get_brand_wcpay_request:fail") {
						alert('系统错误,请更换支付宝或银联支付');
						error_wx(data);
					}else{
						alert('支付失败，失败原因：'+data.err_msg);
						fail_wx(data)
					}
				});
				success(res);
			}else{
				error(msg);
			}
		},
		error : function(xhr,txt){
			complete();
			if(txt == "timeout"){
				timeout();
			}else{
				serverError();
			}
		}
	})
};
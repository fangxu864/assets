/**
 * Author: huangzhiyang
 * Date: 2016/10/11 16:00
 * Description: 选择支付方式页面  请求微信支付二维码数据
 *  http://wx.12301.local/api/index.php?c=pay_WxPay&a=order
 *  参数	类型	说明
 *	out_trade_no	int	订单号
 	is_qr	int	1
 	subject	string	订单主体说明
	 {
		"status": 'ok', // ok/fail
		"data": "weixin://wxpay/bizpayurl?pr=irJUNA8",  //微信二维码地址,需用qrcode插件生成二维码
		"msg": ""//失败时才有值
	}
 */
module.exports = function(ordernum,subject,opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	if(!ordernum) return false;

	if(__DEBUG__){

		opt.loading();
		setTimeout(function(){
			opt.complete();
			opt.success({
				ptype : "C",
				"payWay": {
					"ali": "0", //1显示
					"wx": "1",
					"uni": "1"
				},
				'payParams' : {
					"subject" : "普通票支付",
					"appid" : "111111111",
					"openid" : "1111111111",
					"expireTime" : 120,
					"outTradeNo" : "2626261",
					"buyId" : 3385,
					"domain" : "123624.12301.cc"
				},
				"detail": {
					"landTitle" : "【测试】周五测试（勿买勿删）",
					"totalmoney" : "100",
					"ordername" : "测试丹丹",
					"ordertel" : "18259158223",
					"tickets" : [{
						"title" : "成人票","num" : "1"
					}],
					"extra" : {
						"date" : "2016-08-12~2016-09-11"
					}
				}
			})
		},600);
		return false;
	}

	PFT.Util.Ajax(PFT.Api.C.selectPaymode_wx_qrcode(),{
		type : "post",
		params : {
			out_trade_no : ordernum,
			subject : subject,
			is_qr : 1,
			token : PFT.Util.getToken()
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};

			var status = res.status;
			var data = res.data;
			var msg = res.msg;
			if(status=="ok"){
				opt.success(data);
			}else{
				opt.fail(msg);
			}

		}
	})
}
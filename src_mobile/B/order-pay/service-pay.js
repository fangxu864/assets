/**
 * Author: huangzhiyang
 * Date: 2016/10/11 16:00
 * Description: 选择支付方式页面
 *  http://wx.12301.local/r/Mall_Order/pay/
 *  参数	类型	说明
 *	ordernum	int	订单号
 *	host	int	123624(来源,从上一个页面中带过来，123624.12301.local)
	 *{
		"code": 200,
		"data": {
			"totalMoney": 0.01, //总金额
			"autoCancel": "120",    //自动取消时间
			"pay": {
				"ali": "0", //支付宝支付
				"wx": "1",  //微信支付
				"uni": "1"  //银联支付
			}
		},
		"msg": ""
	}
 */
module.exports = function(ordernum,host,opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	if(!ordernum || !host) return false;

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

	PFT.Util.Ajax('/r/MicroPlat_Order/pay',{
		type : "post",
		params : {
			ordernum : ordernum,
			host : host,
			token : PFT.Util.getToken()
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var data = res.data;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			var search=window.location.search;
			if(code==200){
				//data["ptype"] = data["ptype"].toUpperCase();
				opt.success(data);
			}else if(code==205){
				window.location.href="order_pay_success.html?ordernum="+ordernum;
			}else if(code==206){
				window.location.href=data.url+search;
			}else{
				opt.fail(msg);
			}
		}
	})
}
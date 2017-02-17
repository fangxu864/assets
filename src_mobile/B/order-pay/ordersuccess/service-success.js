/**
 * Author: huangzhiyang
 * Date: 2016/10/11 16:00
 * Description: 下单成功，订单&支付详情
 *  http://wx.12301.local/r/Mall_Order/paySuccess/
 *  参数	类型	说明
 *	ordernum	int	订单号
 *	{
		 "code": 200,
		 "data": {
				"landTitle": "微商城演出测试（勿动）",
				"totalmoney": "1",
				"ordername": "翁彬",
				"ordertel": "13023829679",
				"qrcode": "978312",
				"tickets": [
					{
						"title": "vip",
						"num": "1"
					}
				],
				"extra": {
					"date": "2016-08-17 12:01-18:00",
					"seat": "座位号：1-15。"
				}
			},
		 "msg": ""
	 }
 */
module.exports = function(ordernum,opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	if(!ordernum) return false;

	if(__DEBUG__){

		opt.loading();
		setTimeout(function(){
			opt.complete();
			opt.success({
				ptype : "A",
				"landTitle": "微商城演出测试（勿动）",
				"totalmoney": "1",
				"ordername": "翁彬",
				"ordertel": "13023829679",
				"qrcode": "978312",
				"tickets": [
					{
						"title": "vip",
						"num": "1"
					}
				],
				"extra": {
					"date": "2016-08-17 12:01-18:00",
					"seat": "座位号：1-15。"
				}
			})
		},600);
		return false;
	}

	PFT.Util.Ajax('/r/MicroPlat_Order/paySuccess',{
		type : "post",
		params : {
			ordernum : ordernum,
			token : PFT.Util.getToken()
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var data = res.data;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			if(code==200){
				opt.success(data);
			}else{
				opt.fail(msg);
			}
		}
	})
}
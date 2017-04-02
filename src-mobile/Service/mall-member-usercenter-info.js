/**
 * Author: huangzhiyang
 * Date: 2016/8/9 16:50
 * Description: 个人中心   http://123624.12301.local/r/Mall_Member/userCenter/
 *
 */
module.exports = function(opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	if(__DEBUG__){
		opt.loading();
		setTimeout(function(){
			opt.complete();
			opt.success({
				"name": "慢慢测试三",
				"mobile": "12345678901",
				"headImg": "http://images.12301.test/123933/1371975572.jpg",
				"remainMoney": 186,
				"menus": {
					"saleCenter": {
						"name": "分销中心",
						"data": []
					},
					"orderList": {
						"name": "我的订单",
						"data": []
					},
					"coupon": {
						"name": "优惠券",
						"data": []
					},
					"poster": {
						"name": "海报推广",
						"data": []
					}
				}
			})
		},1000)

		return false;
	}


	PFT.Util.Ajax(PFT.Api.C.getUserCenterInfo(),{
		type : "post",
		params : {
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
				opt.fail(msg,code);
			}
		}
	})
}
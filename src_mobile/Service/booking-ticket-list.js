/**
 * Author: huangzhiyang
 * Date: 2016/8/9 16:50
 * Description: ""
 */
module.exports = function(pid,opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	if(__DEBUG__){
		opt.loading()
		setTimeout(function(){
			opt.success([{
				"title": "成人票and可乐赠饮",
				"jsprice": 13,
				"tprice": "14.00",
				"pid": "14624",
				"tid": "17536",
				"buy_limit_low": "2",   //最小购买张数
				"buy_limit_up": "2"
			},{
				"title": "成人票and可乐赠饮",
				"jsprice": 13,
				"tprice": "14.00",
				"pid": "14624",
				"tid": "17536",
				"buy_limit_low": "2",   //最小购买张数
				"buy_limit_up": "2"
			},{
				"title": "成人票and可乐赠饮",
				"jsprice": 13,
				"tprice": "14.00",
				"pid": "14624",
				"tid": "17536",
				"buy_limit_low": "2",   //最小购买张数
				"buy_limit_up": "2"
			}])
		},1000)

		return false;
	}

	PFT.Util.Ajax(PFT.Api.C.getTicketListBook(),{
		params : {
			pid : pid
		},
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var list = res.list;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			if(code==200){
				if(list.length){
					success(list);
				}else{
					empty(list);
				}
			}else{
				opt.fail(msg);
			}
		}
	})
}
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
				"zone_id" : "602",
				"pid": "1",
				"tid": "1753",
				"buy_low": "4",   //最小购买张数
				"buy_up": "7",
				"sonTickets": [ //套票才有
					{
						"pid": "3563",
						"lid": "3221",
						"title": "【测试】周五测试（勿买勿删）成人票",
						"num": "1",
						"p_type": "A"
					},
					{
						"pid": "3565",
						"lid": "3222",
						"title": "【测试】没那么简单成人测试测试票",
						"num": "2",
						"p_type": "A"
					}
				]
			},{
				"title": "成人票and可乐赠饮",
				"jsprice": 13,
				"tprice": "14.00",
				"pid": "2",
				"tid": "07536",
				"buy_low": "-1",   //最小购买张数
				"buy_up": "-1"
			},{
				"title": "成人票and可乐赠饮",
				"jsprice": 13,
				"tprice": "14.00",
				"pid": "3",
				"tid": "57536",
				"buy_low": "-1",   //最小购买张数
				"buy_up": "-1"
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
					list.forEach(function(item,index){
						var buy_up = item.buy_up;   //限制最大购买张数(即一次最多只能购买多少张)
						var buy_low = item.buy_low; //限制最少购买张数(即一次最少需要购买多少张)
						if(buy_low==0) item["buy_low"] = -1;//后端返回0时，即表示不限 (这里要我吐槽一下坑爹的后端，一会是-1 一会是0)
						if(buy_up==0) item["buy_up"] = -1;
					})
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
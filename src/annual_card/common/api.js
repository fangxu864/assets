/**
 * Author: huangzhiyang
 * Date: 2016/6/15 15:36
 * Description: 此项目所有与后端交互数据的接口都汇总到这里
 */
var fn = function(){};
var Api = {
	Url : {
		//卡片录入相关接口
		EntryCard : {
			//获取供应商的年卡产品列表
			getProdList : "/r/product_annualCard/getAnnualCardProducts/",
			//录入卡片
			createAnnualCard : "/r/product_annualCard/createAnnualCard/",
			//获取相关产品已生成好的卡片
			getAnnualCards : "/r/product_annualCard/getAnnualCards/",
			//删除生成好的卡片
			deleteAnnualCard : "/r/product_annualCard/deleteAnnualCard/"
		},
		//下单页面
		makeOrder : {
			//预定页面请求卡片信息接口
			getCardsForOrder : "/r/product_annualCard/getCardsForOrder/",
			//预定页面请求订单信息接口
			getOrderInfo : "/r/product_annualCard/getOrderInfo/"
		}
	},
	defaults : {
		type : "get",
		ttimout : 60 * 1000,
		loading : fn,
		complete : fn,
		success : fn,
		fail : fn,
		timeout : fn,
		serverError : fn
	}
	///**
	// * 获取供应商的年卡产品列表 (分页)
	// * @param page      获取第几页
	// * @param pagesize  每页显示多少条
	// */
	//getCardProdList : function(opt){
	//	opt = $.extend(Defaults,opt||{});
	//	var page = opt.page || 1;
	//	var pagesize = opt.pagesize || 1000;
	//	PFT.Util.Ajax(Url.EntryCard.getProdList,{
	//		type : opt.type,
	//		params : {
	//			page : page,
	//			page_size : pagesize
	//		},
	//		ttimeout : opt.ttimeout,
	//		loading : function(){ opt.loading()},
	//		complete : function(){ opt.complete()}
	//	},function(res){
	//		res = res || {};
	//		var code = res.code;
	//		if(code==200){
	//			opt.success(res);
	//		}else{
	//			opt.fail(res);
	//		}
	//	})
	//}
};
module.exports = Api;

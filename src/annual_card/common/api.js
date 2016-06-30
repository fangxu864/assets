/**
 * Author: huangzhiyang
 * Date: 2016/6/15 15:36
 * Description: 此项目所有与后端交互数据的接口都汇总到这里
 */
var fn = function(){};
var Api = {
	Url : {
		//发布年卡产品
		PublishCardProd : {
			submit : "/r/product_scenic/save/",
			//图片上传
			uploadFile : "/r/product_AnnualCard/uploadImg/",
			//编辑状态，获取年卡产品详细信息
			getInfo : "/r/product_scenic/get/"
		},
		//年卡套餐-即票类编辑
		PackageInfo : {
			//添加&修改票类
			updateTicket : "/r/product_ticket/UpdateTicket/",
			//拉取已存在的票类
			getPackageInfoList : "/r/product_ticket/ticket_attribute/",
			//获取产品列表
			getLands : "/r/product_AnnualCard/getLands/",
			//获取票类列表
			getTickets : "/r/product_AnnualCard/getTickets/",
			//删除票类
			deleteTicket : "/route/index.php?c=product_ticket&a=set_status"//"/r/product_ticket/set_status"
		},
		//卡片录入相关接口
		EntryCard : {
			//获取供应商的年卡产品列表
			getProdList : "/r/product_AnnualCard/getAnnualCardProducts/",
			//录入卡片
			createAnnualCard : "/r/product_AnnualCard/createAnnualCard/",
			//获取相关产品已生成好的卡片
			getAnnualCards : "/r/product_AnnualCard/getAnnualCards/"

		},
		//下单页面
		makeOrder : {
			//预定页面请求卡片信息接口
			getCardsForOrder : "/r/product_AnnualCard/getCardsForOrder/",
			//预定页面请求订单信息接口
			getOrderInfo : "/r/product_AnnualCard/getOrderInfo/",
			//如果购买虚拟卡，订单提交之前需要先请你去这个接口，判断会员是否已经绑定过其他年卡
			isNeedToReplace : "/r/product_AnnualCard/isNeedToReplace/",
			submit : "/formSubmit_v01.php"
		},
		//获取某个产品的虚拟卡的库存
		getVirtualStorage : "/r/product_AnnualCard/getVirtualStorage/",
		//库存明细页
		storage : {
			//获取库存列表
			getList : "/r/product_AnnualCard/getAnnualCardStorage/",
			//删除生成好的卡片
			deleteAnnualCard : "/r/product_AnnualCard/deleteAnnualCard/"
		},
		//下单成功页
		ordersuccess : {
			getOrderDetail : "/r/product_AnnualCard/orderSuccess/"
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
};
module.exports = Api;

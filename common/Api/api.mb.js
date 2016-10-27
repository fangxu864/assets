/**
 * Author: huangzhiyang
 * Date: 2016/8/2 16:25
 * Description: ""
 */
var Get = require("COMMON/js/config.api").get;
var Mall_Product = Get("Mall_Product");
var Mall_Order = Get("Mall_Order");
var Mall_Member = Get("Mall_Member");
var Api_Mb = {
	//微商城，城市选择， 获取城市列表
	fetchCityFromProduct : function(){
		return "/wx/api/v0.0.3/order.php";
	},
	//微商城，获取产品类型列表
	getptype : function(){
		return Mall_Product("getTypeList");
	},
	//获取微商城自定义店铺配置
	custom_shop_config : function(){
		return Mall_Product("getCustomConfig");
	},
	//商微城C端接口
	C : {
		//获取热门推荐产品
		getProductHot : function(){
			return Mall_Product("index");
		},
		//获取产品列表
		productList : function(){
			return Mall_Product("productList");
		},
		//产品详情页，获取票类列表
		getTicketList : function(){
			return Mall_Product("getTicketList");
		},
		//产品详情页，获取相关套票
		getRelatedPackage : function(){
			return Mall_Product("getRelatedPackage");
		},
		//产品详情页，产品详情信息
		getLandInfo : function(){
			return Mall_Product("getLandInfo");
		},
		//获取日历价格
		getCalendarPrice : function(){
			return Mall_Product("getCalendarPrice")
		},
		//下订单页，获取产品信息（包含票列表）
		getBookInfo : function(){
			return Mall_Product("getBookInfo")
		},
		//获取场次列表
		getShowInfo : function(){
			return Mall_Product("getShowInfo");
		},
		//下单页，非酒店类产品获取价格库存
		getPriceAndStorage : function(){
			return Mall_Product("getPriceAndStorage");
		},
		//下单页，酒店类产品获取价格库存
		getHotelPriceAndStorage : function(){
			return Mall_Product("getHotelPriceAndStorage");
		},
		//下单页，提交订单
		submitOrder : function(){
			return Mall_Order("order");
		},
		//下单成功，选择支付方式
		selectPaymode : function(){
			var hostname = window.location.hostname;
			var isWXFirst = hostname.split(".")[0]=="wx";
			if(isWXFirst){ //如果是wx开头的
				return "/api/index.php?c=Mall_Order&a=pay"
			}else{
				return Mall_Order("pay");
			}
		},
		//下单成功，订单&支付详情
		ordersuccess : function(){
			return Mall_Order("paySuccess");
		},
		//帐号登录
		login : function(){
			return Mall_Member("login");
		},
		//短信登录
		smsLogin : function(){
			return Mall_Member("smsLogin");
		},
		//短信登录时，获取验证码
		smsLogin_getVCode : function(){
			return Mall_Member("sendVcode");
		},
		//个人中心页面info
		getUserCenterInfo : function(){
			return Mall_Member("userCenter");
		},
		//个人中心 订单列表页
		userCenterOrderList : function(){
			return Mall_Member("getOrderList");
		},
		//个人中心 订单详情页
		userCenterOrderDetail : function(){
			return Mall_Member("orderDetail");
		},
		//个人中心 取消订单
		userCenterOrderCanel : function(){
			return Mall_Member("cancelOrder");
		},
		//退出登录
		logout : function(){
			return Mall_Member("logout");
		},
		//C端端面跳转链接
		Page_Link : {

		}
	}
};




module.exports = function(Api){
	for(var i in Api_Mb) Api[i] = Api_Mb[i];
	return Api;
}
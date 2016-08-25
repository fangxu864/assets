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
		//下订单页，获取票类列表
		getTicketListBook : function(){
			return Mall_Product("getBookList")
		},
		//获取场次列表
		getShowInfo : function(){
			return Mall_Product("getShowInfo");
		},
		//下单页，酒店类产品获取价格库存
		getHotelPriceAndStorage : function(){
			return Mall_Product("getHotelPriceAndStorage")
		},
		//下单页，提交订单
		submitOrder : function(){
			return Mall_Order("order")
		},
		//帐号登录
		login : function(){
			return Mall_Member("login");
		},
		//短信登录
		smsLogin : function(){
			return Mall_Member("smsLogin");
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
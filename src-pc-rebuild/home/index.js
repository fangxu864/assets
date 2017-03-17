/**
 * Author: huangzhiyang
 * Date: 2017/1/12 15:44
 * Description: ""
 */
require("./index.scss");

var UserInfo = require("./modules/userinfo");

var SaleEchart = require("./modules/sale-echart");
// var WxShopData = require("./modules/wxshop-data");

var RecentUse = require("./modules/recent-use");

var PriceChange = require("./modules/price-change");
var ProductChange = require("./modules/product-change");
var PartnerChange = require("./modules/partner-change");

var SystemNotice = require("./modules/system-notice");

var AD = require("./modules/ad");

var ScrollManager = PFT.Util.MainBodyScrollManager;

var Main = PFT.Util.Class({
	container : $("#G_Body_Con"),
	init : function(){

		this.inContainer = $('#inBodyCon');
		this.pageMain = $('#pageMain');
		this.rightBar = $('#rightBar');

		this.userInfo = UserInfo(this.pageMain);
		this.recentUse = RecentUse(this.pageMain);

		this.saleEchart = SaleEchart(this.pageMain);
		// this.wxShopData = WxShopData(this.pageMain);


		this.priceChange = PriceChange(this.rightBar);
		this.productChange = ProductChange(this.rightBar);

		this.partnerChange = PartnerChange(this.rightBar);
		this.systemNotice = SystemNotice(this.rightBar);
		AD(this.rightBar);


	}
});


$(function(){

	new Main;

})



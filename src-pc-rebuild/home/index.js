/**
 * Author: huangzhiyang
 * Date: 2017/1/12 15:44
 * Description: ""
 */
require("./index.scss");

var UserInfo = require("./modules/userinfo");

var saleEchart = require("./modules/sale-echart");
var wxShopData = require("./modules/wxshop-data");

var RecentUse = require("./modules/recent-use");

var SaleEchart = require("./modules/sale-echart");


var Main = PFT.Util.Class({
	container : $("#G_Body"),
	init : function(){

		this.inContainer = $('<div id="inBodyCon" class="inBodyCon"></div>');
		this.pageMain = $('<div id="pageMain" class="pageMain"></div>');
		this.rightBar = $('<div id="rightBar" class="rightBar"></div>');
		this.inContainer.append(this.pageMain).append(this.rightBar);

		this.container.append(this.inContainer);

		this.userInfo = UserInfo(this.pageMain);

		this.saleEchart = saleEchart(this.pageMain);
		this.wxShopData = wxShopData(this.pageMain);




		this.saleEchart = SaleEchart(this.pageMain);


		this.recentUse = RecentUse(this.pageMain);

	}
});


$(function(){

	new Main;

})


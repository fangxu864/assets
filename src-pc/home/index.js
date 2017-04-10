/**
 * Author: huangzhiyang
 * Date: 2017/1/12 15:44
 * Description: ""
 */
require("./index.scss");
var Common = require("./common.js");

var UserInfo = require("./modules/userinfo");

var SaleEchart = require("./modules/sale-echart");
// var WxShopData = require("./modules/wxshop-data");

var RecentUse = require("./modules/recent-use");

var PriceChange = require("./modules/price-change");
var ProductChange = require("./modules/product-change");
var PartnerChange = require("./modules/partner-change");

var SystemNotice = require("./modules/system-notice");

var AD = require("./modules/ad");

// var RecommendApp = require('./modules/recommend-app')

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
		// this.recommendApp = RecommendApp( this.pageMain );

		var DTYPE = $("#home_judge_of_dtype").val();

		if( DTYPE != 7 ){
			var priceChange = this.priceChange = PriceChange(this.rightBar);
			var productChange = this.productChange = ProductChange(this.rightBar);
			var partnerChange = this.partnerChange = PartnerChange(this.rightBar);
		}
		var systemNotice = this.systemNotice = SystemNotice(this.rightBar);
		//懒加载
		var fetch = function(){
			if(DTYPE != 7 ) {
				if(!priceChange.__hasLoaded && Common.elemViewIn($("#PriceChangeBox"),$("#G_Body"))) priceChange.fetch();
				if(!productChange.__hasLoaded && Common.elemViewIn($("#ProductChangeBox"),$("#G_Body"))) productChange.fetch();
				if(!partnerChange.__hasLoaded && Common.elemViewIn($("#PartnerChangeBox"),$("#G_Body"))) partnerChange.fetch();
			}
			if(!systemNotice.__hasLoaded && Common.elemViewIn($("#SystemNoticeBox"),$("#G_Body"))) systemNotice.fetch();
		};
		//首页兼容公共footer
		var adaptFooterPos = function(){
			var pageMain = $("#pageMain");
			var rightBar = $("#rightBar");

			var pageMainHeight = pageMain.height();
			var rightBarHeight = rightBar.height();

			var height = pageMainHeight>rightBarHeight ? pageMainHeight : rightBarHeight;

			$("#inBodyCon").css({"min-height":height});

		};
		if( DTYPE != 7 ) {
			priceChange.on("ready", function () {
				fetch();
				adaptFooterPos();
			});
			productChange.on("ready", function () {
				fetch();
				adaptFooterPos();
			});
			partnerChange.on("ready", function () {
				fetch();
				adaptFooterPos();
			});
		}
		systemNotice.on("ready",function(){
			fetch();
			adaptFooterPos();
		})




		AD(this.rightBar);



        PFT.Util.ScrollManager({
            container : "#G_Body",
            timeout : 200,
            distanceAtBottom : 17,
            scroll : function(data){
				fetch();
				adaptFooterPos();
            }
        });

		fetch();


	}
});


$(function(){

	new Main;

})

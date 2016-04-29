/**
 * Created by Administrator on 15-10-8.
 */
require("../css/terminal_16u_wx.css");
require("../css/order.item.css");
require("../css/terminal.success.css");
var Product = require("./modules/product.js");
var productList = null;
var TerminalFast = require("./modules/terminal.fast.js");
var terminalFast = null;
var TerminalNormal = require("./modules/terminal.normal.js");
var terminalNormal = null;
var TodayOrder = require("./modules/todayOrder.js");
var todayOrder = null;
var Main = RichBase.extend({
	init : function(){},
	EVENTS : {
		"tap" : {
			"#modelTab .tabItem" : "onTabItemSwitch"
		}
	},
	bootstrap : function(){
		productList = new Product({container:$("#prodListPage")});
		productList.bootstrap();
		productList.on("product.load.success",function(res){
			var title = res.list[0]["title"];
			var saleerid = res.list[0]["salerid"];
			$("#productname").text(title).attr("data-salerid",saleerid);
		});
		terminalFast = new TerminalFast();
		terminalFast.bootstrap();
		terminalNormal = new TerminalNormal({container:$("#normalPage")});
		terminalNormal.bootstrap();
		todayOrder = new TodayOrder({container:$("#todayOrderPage")});
		this.initRouter();
	},
	initRouter : function(){
		var that = this;
		this.router = new PFT.Router({
			"default" : function(){
				productList.close();
				todayOrder.close();
			},
			"openProdList" : function(){
				productList.show();
				todayOrder.close();
			},
			"todayChecked" : function(){
				todayOrder.show();
				productList.close();
			}
		})
	},
	onTabItemSwitch : function(that,e){
		var tarItem = $(e.currentTarget);
		if(tarItem.hasClass("active")) return false;
		var type = tarItem.attr("data-type");
		var tarPage = $("#mainCon").children("."+type);
		tarItem.addClass("active").siblings().removeClass("active");
		tarPage.addClass("active").show().siblings().hide().removeClass("active");
	}
});


$(function(){

	new Main().bootstrap();

})
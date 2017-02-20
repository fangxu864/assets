/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:17
 * Description: ""
 */
var webpack = require('webpack');
var path = require("path");
var env = require("../../task-webpack/getNodeENV");
var plugins = require("../../task-webpack/getPlugins")(env);
var output = require("../../task-webpack/getOutput")(env);
var ROOT_URL = "./src_mobile";
var config = require("../../task-webpack/config")({
	entry : {



		"mb.plist.b" : path.resolve(ROOT_URL,"B/plist/index.js"),

		"mb.product_detail.b" : path.resolve(ROOT_URL,"B/product-detail/index.js"),
		// "mb.write_order_spot.b" : path.resolve(ROOT_URL,"B/write-order-spot/index.js"),
		// "mb.order_pay.b" : path.resolve(ROOT_URL,"B/order-pay/index.js"),
		// "mb.order_pay_success.b":path.resolve(ROOT_URL,"B/order-pay/orderysuccess/index.js"),
		"mb.order_fill.b" : path.resolve(ROOT_URL,"B/order-fill/index.js"),
		

		// "mb.index.c" : path.resolve(ROOT_URL,"C/index/index.es6"),
		//"mb.search.c" : path.resolve(ROOT_URL,"C/search/index.js"),
		// "mb.pdetail.c" : path.resolve(ROOT_URL,"C/pdetail/index.es6"),
		// "mb.productlist.c" : path.resolve(ROOT_URL,"C/product-list/index.es6"),
		// "mb.booking.c" : path.resolve(ROOT_URL,"C/booking/index.es6"),
		//"mb.index.c" : path.resolve(ROOT_URL,"C/index/index.es6"),
		//"mb.search.c" : path.resolve(ROOT_URL,"C/search/index.js"),
		//"mb.pdetail.c" : path.resolve(ROOT_URL,"C/pdetail/index.es6"),
		// "mb.productlist.c" : path.resolve(ROOT_URL,"C/product-list/index.es6"),
		// "mb.productlist-new.c" : path.resolve(ROOT_URL,"C/product-list/rebuild/index.js"),
		//"mb.booking.c" : path.resolve(ROOT_URL,"C/booking/index.es6"),
		//"mb.select_paymode.c" : path.resolve(ROOT_URL,"C/select-paymode/index.es6"),
		//"mb.ordersuccess.c" : path.resolve(ROOT_URL,"C/ordersuccess/index.es6"),
		//"mb.bindmobile.c" : path.resolve(ROOT_URL,"C/bind-mobile/index.es6"),
		//"mb.usercenter.c" : path.resolve(ROOT_URL,"C/usercenter/index.es6"),
		// "mb.userorder.c" : path.resolve(ROOT_URL,"C/userorder/index.js"),
		// "mb.tel.msg.to.userorderdetail.c" : path.resolve(ROOT_URL,"C/userorder/msg-to-detail/index.js")
		//"mb.userorder.c" : path.resolve(ROOT_URL,"C/userorder/index.js"),
		//"mb.tel.msg.to.userorderdetail.c" : path.resolve(ROOT_URL,"C/userorder/msg-to-detail/index.js")
	},
	output : output,
	plugins : plugins
});
module.exports = config;
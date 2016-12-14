/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:17
 * Description: ""
 */
var env = require("../../task-webpack/getNodeENV");
var path = require("path");
var plugins = require("../../task-webpack/getPlugins")(env);
var output = require("../../task-webpack/getOutput")(env);
var config = require("../../task-webpack/config")({
	entry : {
		//异常订单-第三方订单入口

		// "abnormal.third.order" : "./src/abnormal-order/third-order/index.js"
		//异常订单-团购订单入口
		"abnormal.group.order" : "./src/abnormal-order/group-order/index.js"

		//"abnormal.third.order" : "./src/abnormal-order/third-order/index.js",
		//异常订单-团购订单入口
		 //"abnormal.group.order" : "./src/abnormal-order/group-order/index.js"

	},
	output : output,
	plugins : plugins
});
module.exports = config;


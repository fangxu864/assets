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
		//微信充值入口
		"m.sanya_recharge" : "./src/sanya-ad/wx-recharge/index.js",

		//广告系统-首页(广告管理页)
		"sanya_ad_index" : "./src/sanya-ad/pc/index/index.js",
        //广告系统-新增/编辑广告
        "sanya_ad_ad" : "./src/sanya-ad/pc/ad/ad.js"
	},
	output : output,
	plugins : plugins
});
module.exports = config;
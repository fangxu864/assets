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
        // //应用中心 - 首页
        // "appcenter_index" : "./src/application-center/index/index.js",
        // //应用中心 - 详情
        // "appcenter_details" : "./src/application-center/details/index.js",
        // //应用中心 - 应用费用配置列表
        // "appcenter_chargelist" : "./src/application-center/charge-list/index.js",
        // //应用中心 - 应用属性配置
        // "appcenter_appsetting" : "./src/application-center/app-setting/index.js",
        // //应用中心 - 应用费用设置
        // "appcenter_chargesetting" : "./src/application-center/charge-setting/index.js",
        // //应用中心 - 模块列表
        // "appcenter_applist" : "./src/application-center/app-list/index.js",
        // //应用中心 - 开通统计列表
        // "appcenter_appstatistics" : "./src/application-center/app-statistics/index.js",
        // //应用中心 - 开通统计详情
        // "appcenter_appstatisticsdetail" : "./src/application-center/app-statisticsdetail/index.js",
        // //应用中心 - 支付
        // "appcenter_pay" : "./src/application-center/pay/index.js",
        // "appcenter_paysuccess" : "./src/application-center/pay/success.js",
        // //应用中心 - 过期提示
        // "appcenter_expiredText" : "./src/application-center/expiredText/index.js",
        // //应用中心 - 上线引导
        // "appcenter_homeIntro" : "./src/application-center/intro/intro-home/index.js",
        //应用中心 - 资费套餐
        "app_package" : "./src/application-center/app-package/index.js"
    },
    output : output,
    plugins : plugins
});
module.exports = config;
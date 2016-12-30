/**
 * Created by Administrator on 2016/12/28.
 */

//引入公共框架
require("../home");
require("./index.scss");
//引入插件
var Class = require("COMMON/js/util.class.js");

//引入主功能模块
var RecentlyUsed_Module = require("./main_box/recentlyUsed_module");
var Mine_Module = require("./main_box/mine_module");
var OrderData_module = require("./main_box/orderData_module");
var WxData_module = require("./main_box/wxData_module");
var MarkertingApp_module = require("./main_box/markertingApp_module");

//引入侧边通知模块
var ProductionDynamics_module = require("./side_box/productionDynamics_module");
var PartnerDynamics_module = require("./side_box/partnerDynamics_module");
var UpdateNotice_module = require("./side_box/updateNotice_module");
var SystemNotice_module = require("./side_box/systemNotice_module");
var Ad_module = require("./side_box/ad_module");

var Home_content = Class({
    container : "#pft_right_box",
    init : function () {
        this.loadMainBox();
        this.loadSideBox();
    },
    EVENTS :{
    },

    loadMainBox:function () {
        new Mine_Module();
        new RecentlyUsed_Module();
        new OrderData_module();
        new WxData_module();
        new MarkertingApp_module();
    },

    loadSideBox:function () {
        new ProductionDynamics_module();
        new PartnerDynamics_module();
        new UpdateNotice_module();
        new SystemNotice_module();
        new Ad_module();
    }
});


$(function () {
    new Home_content;
});

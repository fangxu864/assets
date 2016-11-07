/**
 * Author: huangzhiyang
 * Date: 2016/7/15 16:08
 * Description: ""
 */
require("COMMON/css/base/_reset.scss");
require("COMMON/css/base/_iconfont.usually.scss");
require("COMMON/css/base/_iconfont.biz.scss");
var PFT = window["PFT"] || (window["PFT"]={});
PFT = require("./pft.common.base")(PFT);
PFT["Toast"] = require("./modules/Toast");
var Mobile = PFT["Mobile"] || (PFT["Mobile"]={});
Mobile["Toast"] = PFT["Toast"];
Mobile["Alert"] = require("./modules/alert-mobile/v1");
Mobile["Confirm"] = require("./modules/confirm-mobile");
PFT["Util"]["SetFontSize"] = require("./js/util.wx.fontsize");
PFT["Util"]["Platform"] = require("./js/util.platform.js");
PFT["Api"] = require("./Api/api.mb")(PFT.Api);

var _CustomShopConfig = require("SERVICE_M/custom-shop-config");
var CustomShopConfig = PFT["CustomShopConfig"] = new _CustomShopConfig();
var CustomWXShare = PFT["CustomWXShare"] = require("SERVICE_M/custom-wx-share");


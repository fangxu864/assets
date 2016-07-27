/**
 * Author: huangzhiyang
 * Date: 2016/7/15 16:08
 * Description: ""
 */
require("COMMON/css/base/_reset.scss");
require("COMMON/css/base/_iconfont.scss");
var PFT = window["PFT"] || (window["PFT"]={});
PFT = require("./base")(PFT);
PFT["Toast"] = require("./modules/Toast");
PFT["Util"]["SetFontSize"] = require("./js/util.wx.fontsize");
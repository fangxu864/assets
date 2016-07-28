/**
 * Author: huangzhiyang
 * Date: 2016/7/15 16:07
 * Description: ""
 */
require("./css/pft-common-pc/index.scss");
var PFT = window["PFT"] || (window["PFT"]={});
PFT = require("./pft.common.base")(PFT);
PFT["Util"]["Browser"] = require("./js/util.browser");
PFT["Util"]["STip"] = require("./js/util.simple.tip");
var PageBase = require("./pft.common.pc.base");
$(function(){ PageBase.init(); })



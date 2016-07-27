/**
 * Author: huangzhiyang
 * Date: 2016/7/15 16:07
 * Description: ""
 */
require("./css/pc-global/index.scss");
var PFT = window["PFT"] || (window["PFT"]={});
PFT = require("./pft.common.base")(PFT);
PFT["Util"]["Browser"] = require("./js/util.browser");
PFT["Util"]["STip"] = require("./js/util.simple.tip");



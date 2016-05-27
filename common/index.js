/**
 * Author: huangzhiyang
 * Date: 2016/5/24 16:31
 * Description: ""
 */
var PFT = window["PFT"] || (window["PFT"]={});
PFT.Util = PFT.Util || {};
PFT.Config = PFT.Config || {};
PFT.Util.Ajax = require("./js/util.ajax");
PFT.Util.Placeholder = require("./js/util.placeholder");
PFT.Util.UrlParse = require("./js/util.url.parse.query");
PFT.Util.Validate = require("./js/util.validate");
PFT.Util.VCode = require("./js/util.vcode");
PFT.Util.getToken = require("./js/util.get.token");
PFT.Util.Promise = require("./js/util.promise");
PFT.Config.Api = require("./js/config.api");

PFT.AJAX_ERROR_TEXT = "请求出错，请稍后重试";
PFT.AJAX_TIMEOUT_TEXT = "请求超时，请稍后重试";
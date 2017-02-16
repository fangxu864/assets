/**
 * Author: huangzhiyang
 * Date: 2016/7/27 16:26
 * Description: ""
 */
var Browser = {
	/**
	 * 获取浏览器的userAgent信息
	 *
	 * @memberOf browser
	 */
	getUserAgent: function(){
		return navigator.userAgent.toLowerCase();
	},

	name: "unknown",

	version: 0,

	ie: 0,

	firefox: 0,

	chrome: 0,

	opera: 0,

	safari: 0,

	mobileSafari: 0,

	adobeAir: 0
};
var s;
var toFixedVersion = function(ver, floatLength){
	ver= (""+ver).replace(/_/g,".");
	floatLength = floatLength || 1;
	ver = String(ver).split(".");
	ver = ver[0] + "." + (ver[1] || "0");
	ver = Number(ver).toFixed(floatLength);
	return ver;
};
var SetBrowser = function(name,ver){
	Browser.name = name;
	Browser.version = ver;
	Browser[name] = ver;
};
var ua = Browser.getUserAgent();
// 探测浏览器并存入 browser 对象
(s = ua.match(/msie ([\d.]+)/)) ? SetBrowser("ie",toFixedVersion(s[1])):
	(s = ua.match(/firefox\/([\d.]+)/)) ? SetBrowser("firefox",toFixedVersion(s[1])) :
		(s = ua.match(/chrome\/([\d.]+)/)) ? SetBrowser("chrome",toFixedVersion(s[1])) :
			(s = ua.match(/opera.([\d.]+)/)) ? SetBrowser("opera",toFixedVersion(s[1])) :
				(s = ua.match(/adobeair\/([\d.]+)/)) ? SetBrowser("adobeAir",toFixedVersion(s[1])) :
					(s = ua.match(/version\/([\d.]+).*safari/)) ? SetBrowser("safari",toFixedVersion(s[1])) : 0;

module.exports = Browser;
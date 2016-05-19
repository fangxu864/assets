/**
 * Author: huangzhiyang
 * Date: 16-5-11 下午5:23
 * Description: ""
 */
require("../css/style.scss");
var SetFontsize = require("COMMON/js/util.wx.fontsize.js");
$(function(){
	SetFontsize();
	var hostname = window.location.hostname;
	var memberid = $("#memberid").val();
	var link = "http://"+hostname+"/wx/mall/index.html?parentid="+memberid;
	var qrcode = new QRCode("maContainer", {
		text: link,
		width: 160,
		height: 160,
		colorDark : "#000000",
		colorLight : "#ffffff",
		correctLevel : QRCode.CorrectLevel.H
	});
	qrcode.makeCode(link);
})
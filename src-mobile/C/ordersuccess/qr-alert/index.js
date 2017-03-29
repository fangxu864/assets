/**
 * Author: huangzhiyang
 * Date: 2016/12/9 15:25
 * Description: ""
 */
require("./index.scss");
var Tpl = require("./index.xtpl");
var QRAlert = PFT.Util.Class({
	init : function(opt){
		this.qrcodeUrl = opt.qrcodeUrl;
		this.nickName = opt.nickName;
		this.template = PFT.Util.ParseTemplate(Tpl);
		this.show();
	},
	show : function(){
		if($("#qrcodeToastPage").length>0) return $("#qrcodeToastPage").show();
		var html = this.template({
			data : {
				qrcodeUrl : this.qrcodeUrl,
				nickName : this.nickName
			}
		})
		$("body").append(html);
		setTimeout(function(){
			$("#qrcodeToastPage").on("click",".btnGroup",function(e){
				$("#qrcodeToastPage").hide();
			})
		},50);
	}
});
module.exports = QRAlert;
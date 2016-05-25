/**
 * Author: huangzhiyang
 * Date: 2016/5/25 18:02
 * Description: ""
 */
require("../css/style.css");
var EasyDialog = require("COMMON/modules/easydialog");
var Ajax = require("COMMON/js/util.ajax");
var WinWidthHeight = require("COMMON/js/util.window.width.height");
var Main = {
	//api : "r/MsgNotify_notice/get_nts",
	api : "route/?c=MsgNotify_notice&a=get_nts",
	init : function(){
		var that = this;
		var WH = WinWidthHeight();
		var winH = WH.height;
		this.dialogHeight = winH*0.8-70;
		Ajax(this.api,{
			type : "get",
			dataType : "json",
			loading : function(){},
			complete : function(){},
			timeout : function(){},
			serverError : function(){},
			success : function(res){
				var res = res || {};
				var code = res.code;
				var msg = res.msg || "请求出错，请稍后重试";
				var data = res.data || {};
				var title = data.title || "";
				var content = data.content || "";
				if(code==200 && title && content){
					that.openDialog(title,content);
				}else{

				}
			}
		})
	},
	openDialog : function(title,content){
		var content = this.buildContent(title,content);
		EasyDialog.open({
			container : {
				header : '重要通知',
				content : content
			},
			overlay : true,
			drag : true
		})
	},
	buildContent : function(title,content){
		var that = this;
		var height = this.dialogHeight;
		return [
			'<div class="anncounceCon">',
				'<h3 class="anncounce_title">'+title+'</h3>',
				'<div style="height:'+height+'px" class="announceMainCon">'+content+'</div>',
			'</div>'
		].join("");
	}
};
window.onload = function(){
	Main.init();
}
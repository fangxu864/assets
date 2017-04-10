/**
 * Author: huangzhiyang
 * Date: 2016/9/26 10:38
 * Description: ""
 */
require("./index.scss")
var Tpl = require("./index.xtpl");
var Foot = PFT.Util.Class({
	EVENTS : {
		"click .fBtn" : "onBtnClick"
	},
	init : function(opt){
		this.container.html(Tpl);
	},
	isShow : false,
	onBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		var eventType = "";
		if(tarBtn.hasClass("cannel")){ //取消
			eventType = "cannel";
		}else if(tarBtn.hasClass("current")){ //现在
			eventType = "current";
		}else if(tarBtn.hasClass("yes")){ //确定
			eventType = "yes";
		}
		eventType && this.trigger(eventType);
	},
	show : function(){
		this.isShow = true;
		this.container.show();
	},
	hide : function(){
		this.isShow = false;
		this.container.hide();
	}
});
module.exports = Foot;
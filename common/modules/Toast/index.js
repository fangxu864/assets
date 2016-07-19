/**
 * Author: huangzhiyang
 * Date: 2016/7/15 14:58
 * Description: use in mobile
 */
require("./index.scss");
var Minix = require("COMMON/js/util.minix.params");
var tpl = require("./index.xtpl");
var Defaults = {
	content : "操作成功",  //提示文字
	duration : "1000"   //指定时间后自动关闭
};
var Toast = function(opt){
	this.opt = Minix(opt||{},Defaults);
	$("body").append(tpl);
};
Toast.prototype = {
	show : function(content,duration,callback){
		var that = this;
		if(!content) content = this.opt.content;
		if(!duration) duration = this.opt.duration;
		var container = $("#gui-toast-container");
		container.show().find(".textBox").html(content).css("zIndex","999");
		setTimeout(function(){
			that.hide();
			callback && callback();
		},duration)
	},
	hide : function(){
		var container = $("#gui-toast-container");
		container.hide().css("zIndex","-1");
	}
};
module.exports = Toast;
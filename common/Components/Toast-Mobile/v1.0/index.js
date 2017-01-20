/**
 * Author: huangzhiyang
 * Date: 2016/7/15 14:58
 * Description: use in mobile
 *
 * var toast = new Toast();
 *
 * toast.show("success","操作成功",2000,function(){
 * 		do something...
 * })
 * toast.show("success");
 *
 * toast.show("loading","努力加载中...",function(){
 * 		do something...
 * })
 * toast.show("loading");
 *
 *
 * toast.show();
 *
 */
require("./index.scss");
var tpl = require("./index.xtpl");
var Toast = function(){
	this.fn = new Function;
	if($("#gui-toast-container").length==0) $("body").append(tpl);
};
Toast.prototype = {
	show : function(type,content,duration,callback){
		var that = this;
		if(!type) type = "success";
		var container = $("#gui-toast-container");
		var textBox = container.find("."+type+"Box .textBox");
		if(!content) content = type=="success" ? "操作成功" : "请稍后...";
		if(!duration) duration = 1500;
		if(type=="success"){
			if(typeof duration=="function"){
				callback = duration;
			}else{
				callback = callback || this.fn;
			}
		}else{
			callback = typeof duration=="function" ? duration : this.fn;
		}
		container.removeClass().addClass("show").addClass(type).addClass('gui-toast-container');
		textBox.html(content);
		if(type=="success"){
			setTimeout(function(){
				that.hide();
				callback();
			},duration)
		}else{
			callback();
		}
	},
	hide : function(){
		var container = $("#gui-toast-container");
		container.removeClass("show");
	}
};
module.exports = Toast;
/**
 * Author: huangzhiyang
 * Date: 2016/6/14 18:19
 * Description: ""
 */
var box_tpl = require("./dialog.box.xtpl");
var winWidthHeight = require("COMMON/js/util.window.width.height.js");
require("./index.scss");
var Dialog = Backbone.View.extend({
	state : 0,
	initialize : function(opt){
		var that = this;
		this.List = opt.List;
		this.dialogBox = this.createDialog();
		this.mask = this.createMask();
		$("#dialogCloseBtn").on("click",function(e){
			that.close();
		})
	},
	createDialog : function(){
		if(this.dialogBox) return this.dialogBox;
		this.dialogBox = $('<div style="display:none; float:left" class="dialogBoxContainer"></div>');
		this.dialogBox.append(box_tpl);
		$("body").append(this.dialogBox);
		return this.dialogBox;
	},
	createMask : function(){
		if(this.mask) return this.mask;
		this.mask = $('<div style="display:none" class="dialogMask"></div>');
		$("body").append(this.mask);
		return this.mask;
	},
	position : function(box){
		var w = box.width();
		var h = box.height();
		var win = winWidthHeight();
		box.css({
			position : "fixed",
			left : (win.width-w)/2,
			top : (win.height-h)/2-(win.height-h)*0.1
		})
	},
	slide : function(callback){
		var slideStage = $("#dialog-slideStage");
		var step = slideStage.height();
		var slideCon = slideStage.children(".slideCon");
		var top = slideCon.css("top");
		top = top.substr(0,top.length-2)*1;
		var dir = top==0 ? -1 : 0;
		slideCon.animate({top:dir*step},100,function(){
			callback && callback()
		});
	},
	open : function(callback){
		if(this.state==1) return false;
		this.state = 1;
		this.dialogBox.show().css({zIndex:100});
		this.mask.show().css({zIndex:99});
		this.position(this.dialogBox);
		$("#dialog-slideStage").children(".slideCon").css({top:0});
		callback && callback();
	},
	close : function(callback){
		this.state = 0;
		this.dialogBox.hide().css({zIndex:-1});
		this.mask.hide().css({zIndex:-1})
		callback && callback()
	}
});
module.exports = Dialog;

/**
 * Author: huangzhiyang
 * Date: 2016/6/21 10:04
 * Description: ""
 */
var WinWidthHeight = require("COMMON/js/util.window.width.height.js");
var Drag = require("COMMON/js/util.drag.js");
var fn = new Function();
var Defaults = {
	width : "",
	height : "",
	closeBtn : true,
	header : "",
	content : "",
	footer : "",
	drag : false,
	speed : 200,
	offsetX : 0,
	offsetY : 0,
	overlay : true,
	headerHeightMin : 40,
	events : {},
	onOpenBefore : fn,
	onOpenAfter : fn,
	onCloseBefore : fn,
	onCloseAfter : fn
};
var getUid = (function(){
	var uid = 0;
	return function(){
		return uid++;
	}
})();
var Dialog = function(opt){
	var that = this;
	var opt = this.opt = $.extend(Defaults,opt||{});
	this.uid = getUid();
	this.flag = "gSimpleDialog-";
	this.id = this.flag + this.uid + "-";
	var container = this.container = $('<div></div>');
	$("body").append(container);
	container.attr({
		id : this.id + "container",
		className : this.flag + "container " + this.id+"container"
	});
	if(typeof opt.width=="number") container.width(opt.width);
	if(typeof opt.height=="number") container.height(opt.height);

	var header = this.header = $('<div></div>');
	header.attr({
		id : this.id+"header",
		className : this.flag + "header "+ this.id+"header"
	}).css({minHeight:opt.headerHeightMin}).appendTo(container);
	if(opt.header){
		var header_tpl = typeof opt.header=="function" ? opt.header() : opt.header;
		header.prepend(header_tpl);
	}
	var closeBtn = this.closeBtn = $('<div>×</div>');
	closeBtn.attr({
		id : this.id+"closeBtn",
		className : this.flag + "closeBtn " + this.id + "closeBtn"
	}).appendTo(header);
	var hh = header.height();
	closeBtn.css({width:hh,height:hh,lineHeight:hh+"px"});
	if(!opt.closeBtn) closeBtn.addClass("hidden");
	closeBtn.on("click",function(){
		that.close();
	})

	var content = this.content = $('<div></div>');
	content.attr({
		id : this.id + "content",
		className : this.flag + "content " + this.id + "content"
	}).appendTo(container);
	content.html(typeof opt.content=="function" ? opt.content() : opt.content);

	this.init(opt);
};
Dialog.prototype = {
	init : function(opt){
		var that = this;
		var events = this.events = opt.events;
		var container = this.container;
		for(var i in events){
			var _key = i.split(" ");
			var eventType = _key[0];
			var selector = _key[1];
			var handler = events[i];
			container.on(eventType,selector,function(e){
				if(typeof handler=="function"){
					handler.call(that,e);
				}else if(typeof handler=="string"){
					that[handler].call(that,e);
				}
			})
		}
		if(opt.drag){
			Drag({
				trigger : this.header[0],
				target : this.container[0]
			})
		}
		this.position();
	},
	position : function(){
		var container = this.container;
		var height = container.height();
		var width = container.width();
		var WinWH = WinWidthHeight();
		var offsetX = this.opt.offsetX;
		container.css({
			left : (WinWH.width-width)/2 + offsetX,
			top : -height + 10
		}).hide();
	},
	getMask : function(){
		var mask = $("#"+this.flag+"-mask");
		if(mask.length) return mask;
		mask = $('<div></div>');
		mask.attr({
			id : this.flag + "-mask",
			className : this.flag + "-mask"
		}).appendTo($("body"));
		return mask;
	},
	open : function(opt){
		opt = opt || {};
		var overlay = typeof opt.overlay=="undefined" ? this.opt.overlay : !!opt.overlay;
		var speed = opt.speed || this.opt.speed;
		var offsetY = opt.offsetY || this.opt.offsetY;
		var onBefore = this.opt.onOpenBefore;
		var onAfter = this.opt.onOpenAfter;
		var winH = WinWidthHeight().height;
		var containerH = this.container.height();
		this.container.show().css({zIndex:9999});
		onBefore();
		this.container.animate({
			top : (winH-containerH)/2 + offsetY
		},speed,function(){
			onAfter();
		})
		if(overlay) this.getMask().fadeIn();
	},
	close : function(opt){
		var container = this.container;
		var speed = opt.speed || this.opt.speed;
		var onBefore = this.opt.onCloseBefore;
		var onAfter = this.opt.onCloseAfter;
		var containerH = container.height();
		onBefore();
		container.animate({
			top : -(containerH+10)
		},speed,function(){
			onAfter();
			container.hide().css({zIndex:-1});
		})
		$("#"+this.flag+"-mask").fadeOut();
	}
};
module.exports = Dialog;
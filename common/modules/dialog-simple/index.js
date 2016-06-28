/**
 * Author: huangzhiyang
 * Date: 2016/6/21 10:04
 * Description: ""
 */
require("./index.scss");
var WinWidthHeight = require("COMMON/js/util.window.width.height.js");
var Drag = require("COMMON/js/util.drag.js");
var PubSub = require("COMMON/js/util.pubsub.js");
var Extend = require("COMMON/js/util.extend.js");
var fn = new Function();
var Defaults = {
	width : "",
	height : "",
	closeBtn : true,
	content : "",
	drag : false,
	speed : 200,
	offsetX : 0,
	offsetY : 0,
	overlay : true,
	headerHeightMin : 46,
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
		id : this.id + "container"
	}).addClass(this.flag + "container").addClass(this.id+"container");
	if(typeof opt.width=="number") container.width(opt.width);
	if(typeof opt.height=="number") container.height(opt.height);

	var header = this.header = $('<div></div>');
	header.attr({id : this.id+"header"})
		  .addClass(this.flag + "header").addClass(this.id+"header")
		  .css({minHeight:opt.headerHeightMin}).appendTo(container);
	if(opt.header){
		var header_tpl = typeof opt.header=="function" ? opt.header() : opt.header;
		header.prepend(header_tpl);
	}
	var content = this.content = $('<div></div>');
	content.attr({id : this.id + "content"})
		   .addClass(this.flag + "content")
		   .addClass(this.id + "content")
		   .appendTo(container)
	       .html(typeof opt.content=="function" ? opt.content() : opt.content);
	var closeBtn = this.closeBtn = $('<div>×</div>');
	closeBtn.attr({id : this.id+"closeBtn"})
		.addClass(this.flag + "closeBtn")
		.addClass(this.id + "closeBtn")
		.appendTo(container);
	var hh = header.height();
	closeBtn.css({width:hh+6,height:hh,lineHeight:hh-4+"px"});
	if(!opt.closeBtn) closeBtn.addClass("hidden");
	closeBtn.on("click",function(){
		that.close();
	})
	this.init(opt);
};
Dialog.prototype = Extend({
	init : function(opt){
		var that = this;
		var events = this.events = opt.events;
		var container = this.container;
		for(var i in events){
			//"click .parent .children" => "click:.parent .children"
			var _key = i.replace(/(\w*)\s(.*)/,function(str,p1,p2){
				return p1+":"+p2;
			}).split(":");
			(function(_key){
				var eventType = _key[0];
				var selector = _key[1];
				var handler = events[i];
				container.on(eventType,selector,function(e){
					if(typeof handler=="function"){
						handler(e);
					}else if(typeof handler=="string"){
						that.prototype[handler](e);
					}
				})
			})(_key);
		}
		setTimeout(function(){
			if(opt.drag){
				Drag({
					trigger : that.header[0],
					target : that.container[0]
				})
			}
		},10)
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
		var mask = $("#"+this.flag+"mask");
		if(mask.length) return mask;
		mask = $('<div></div>');
		mask.attr({
			id : this.flag + "mask",
			class : this.flag + "mask"
		}).appendTo($("body"));
		return mask;
	},
	open : function(opt){
		opt = opt || {};
		var that = this;
		var overlay = typeof opt.overlay=="undefined" ? this.opt.overlay : !!opt.overlay;
		var speed = opt.speed || this.opt.speed;
		var offsetY = opt.offsetY || this.opt.offsetY;
		var onBefore = opt.onBefore || this.opt.onOpenBefore;
		var onAfter = opt.onAfter || this.opt.onOpenAfter;
		var winH = WinWidthHeight().height;
		var containerH = this.container.height();
		this.position();
		this.container.show().css({zIndex:9999});
		onBefore();
		this.container.animate({
			top : (winH-containerH)/2 + offsetY
		},speed,function(){
			onAfter();
		})
		if(overlay) this.getMask().fadeIn(function(){
			that.getMask().css("zIndex",9998);
		});
	},
	close : function(opt){
		opt = opt || {};
		var container = this.container;
		var speed = opt.speed || this.opt.speed;
		var onBefore = opt.onBefore || this.opt.onCloseBefore;
		var onAfter = opt.onAfter || this.opt.onCloseAfter;
		var containerH = container.height();
		onBefore();
		container.animate({
			top : -(containerH+10)
		},speed,function(){
			onAfter();
			container.hide().css({zIndex:-1});
		})
		var mask = $("#"+this.flag+"mask");
		mask.fadeOut(function(){
			mask.css("zIndex",0)
		});
	}
},PubSub);
module.exports = Dialog;
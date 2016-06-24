/**
 * Author: huangzhiyang
 * Date: 2016/6/21 10:04
 * Description: ""
 */
var EventEmitter = require("COMMON/js/util.pubsub.js");
var Extend = require("COMMON/js/util.extend.js");
var Drag = require("COMMON/js/util.drag.js");
var fn = new Function();
var Defaults = {
	drag : false,
	headerHeightMin : 40,
	events : {}
};
var Dialog = function(opt){
	var opt = this.opt = $.extend(Defaults,opt||{});
	this.init(opt);
};
Dialog.prototype = Extend({
	init : function(opt){
		var that = this;
		var events = this.events = opt.events;
		var container = this.container = $("#gSimpleDialogContainer");
		var header = this.header = $("#gSimpleDialogContainer-header");
		var content = this.content = $("#gSimpleDialogContainer-content");
		var closeBtn = this.closeBtn = $("#gSimpleDialogContainer-closeBtn");
		if(!container.length){
			container = this.container = $('<div style="display:none" id="gSimpleDialogContainer" class="gSimpleDialogContainer"></div>');
			$("body").append(container);
		}
		if(!header.length){
			header = this.header = $('<div id="gSimpleDialogContainer-header" class="gSimpleDialogContainer-header"></div>');
			container.append(header);
		}
		header.css({"min-height":opt.headerHeightMin});
		if(!content.length){
			content = this.content = $('<div id="gSimpleDialogContainer-content" class="gSimpleDialogContainer-content"></div>');
			container.append(content);
		}
		if(!closeBtn.length){
			closeBtn = this.closeBtn = $('<div id="gSimpleDialogContainer-closeBtn" class="gSimpleDialogContainer-closeBtn"></div>');
		}
		header.append(closeBtn);
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
				trigger : opt.drag,
				target : document.getElementById("gSimpleDialogContainer")
			})
		}
	},
	open : function(opt){
		opt = opt || {};
		var onBefore = opt.onBefore || fn;
		var onAfter = opt.onAfter || fn;
		var width = opt.width;
		var height = opt.height;
		var content = typeof opt.content=="function" ? opt.content() : opt.content;
		var header = typeof opt.header=="function" ? opt.header() : opt.header;
		if(!content) content = "";
		if(!header) header = "";




	},
	close : function(opt){}
},EventEmitter);
module.exports = Dialog;
/**
 * Author: huangzhiyang
 * Date: 2016/6/21 10:04
 * Description: ""
 */
var EventEmitter = require("COMMON/js/util.pubsub.js");
var Extend = require("COMMON/js/util.extend.js");
var Defaults = {
	width : 500,
	height : 500,
	events : {},
	tpl : ""
};
var Dialog = function(opt){
	var opt = this.opt = $.extend(Defaults,opt||{});
	this.init(opt);
};
Dialog.prototype = {
	init : function(opt){
		var that = this;
		var events = this.events = opt.events;
		var container = this.container = $("#gSimpleDialogContainer");
		if(!container.length){
			container = this.container = $('<div style="display:none" id="gSimpleDialogContainer" class="gSimpleDialogContainer"></div>');
			$("body").append(container);
		}
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
	}
};
module.exports = Dialog;
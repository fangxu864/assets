/**
 * Author: huangzhiyang
 * Date: 2016/11/2 9:08
 * Description: "时间紧迫，组件api文档过几天再补上"
 */
require("./index.scss");
var Defaults = function(){
	return {
		header : "",
		height : "auto",
		content : "",
		yesBtn : false,
		noBtn : false,
		zIndex : 1,
		EVENTS : {}
	};
};
var SheetCore = PFT.Util.Class({
	init : function(opt){
		var that = this;
		this.opt = $.extend(Defaults(),opt || {});
		var header = this.opt.header, content = this.opt.content, height = this.opt.height, yesBtn = this.opt.yesBtn, noBtn = this.opt.noBtn;
		var zIndex = this.opt.zIndex,
			events = this.opt.EVENTS,
			winHeight = $(window).height(),
			conMaxHeight,
			headerEle = '.sheet-header',
			footEle = '.sheet-foot';

		if(typeof header=="function") header = header();
		if(typeof content=="function") content = content();

		if(typeof height=="number") height = height + "px";
		if(height!=="auto" && height.indexOf("%")<0){
			if(height.indexOf("px")<0) height = height + "px";
		}


		var $body = this.$body = $("body");
		var container = this.container = $('<div class="ui-sheetCoreContainer"></div>').appendTo($body);
		container.css({ height:height, zIndex:zIndex+1 });

		if(header){
			container.append('<div class="sheet-header">'+header+'</div>');
			container.addClass("fixHead");
		}
		this.content = $('<div class="sheet-content"></div>').appendTo(container);
		if(content) this.content.html(content);

		if(yesBtn || noBtn){
			var btnGroup = $('<div class="sheet-foot"></div>').appendTo(container);
			container.addClass("fixFoot");
			if(noBtn){
				var noBtn_text = "取消";
				var noBtn_handler = function(){};
				var trigger = true;
				if(typeof noBtn=="function"){
					noBtn_handler = noBtn;
				}else if(typeof noBtn=="string"){
					noBtn_text = noBtn;
				}else if(Object.prototype.toString.call(noBtn)=="[object Object]"){
					if(noBtn.text) noBtn_text = noBtn.text;
					if(noBtn.handler) noBtn_handler = noBtn.handler;
					if(typeof noBtn.trigger=="boolean") trigger = noBtn.trigger;
				}

				this.noBtn = $('<span class="btn noBtn no">'+noBtn_text+'</span>').appendTo(btnGroup);
				this.noBtn.on("click",function(e){
					e.stopPropagation();
					e.preventDefault();
					noBtn_handler.call(that,e);
					if(trigger) that.close();
				})
			}
			if(yesBtn){
				var yesBtn_text = "确定";
				var yesBtn_handler = function(){};
				var trigger = true;
				if(typeof yesBtn=="function"){
					yesBtn_handler = yesBtn;
				}else if(typeof yesBtn=="string"){
					yesBtn_text = yesBtn;
				}else if(Object.prototype.toString.call(yesBtn)=="[object Object]"){
					if(yesBtn.text) yesBtn_text = yesBtn.text;
					if(yesBtn.handler) yesBtn_handler = yesBtn.handler;
					if(typeof yesBtn.trigger=="boolean") trigger = yesBtn.trigger;
				}
				this.yesBtn = $('<span class="btn yesBtn yes">'+yesBtn_text+'</span>').appendTo(btnGroup);
				this.yesBtn.on("click",function(e){
					e.stopPropagation();
					e.preventDefault();
					yesBtn_handler.call(that,e);
					if(trigger) that.close();
				})
			}
		}

		if( height != 'auto' ) {
			container.addClass('fixheight');
		} else {
			if( header && ( yesBtn || noBtn ) ) {
				this.content.css({ maxHeight: winHeight - container.find(headerEle).height() - container.find(footEle).height() });
			} else if( header ) {
				this.content.css({ maxHeight: winHeight - container.find(headerEle).height() });
			} else if( yesBtn || noBtn ) {
				this.content.css({ maxHeight: winHeight - container.find(footEle).height() });
			} else {
				this.content.css({ maxHeight: winHeight });
			}
		}

		for(var i in events){
			(function(i){
				var matched = i.match(/([a-z]+)(\s)(.+)/);
				var eventType = matched[1];
				var selector = matched[3];
				var handler = events[i];
				if(typeof handler=="string") handler = that[handler] ? that[handler] : function(){};
				if(!handler) return;
				if(selector){
					container.on(eventType,selector,function(e){
						handler.call(that,e);
					});
				}else{
					container.on(eventType,function(e){
						handler.call(that,e);
					});
				}
			})(i);
		}

		this.mask = $("#ui-sheetMask").length ? $("#ui-sheetMask") : $('<div id="ui-sheetMask" class="ui-sheetMask"></div>').appendTo($body);
		this.mask.css({zIndex:zIndex})

	},
	setContent : function(html){
		this.container.children(".sheet-content").html(html);
	},
	find : function(selector){
		return this.container.find(selector);
	},
	show : function(){
		this.container.addClass("show");
		this.mask.addClass("show").css({zIndex:this.opt.zIndex});
		$("html,body").addClass("sheet-show");
		// this.trigger("show");
	},
	close : function(){
		this.container.removeClass("show");
		this.mask.removeClass("show");
		$("html,body").removeClass("sheet-show");
		// this.trigger("close");
	}
});
module.exports = SheetCore;
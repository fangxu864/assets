/**
 * Author: huangzhiyang
 * Date: 2016/11/29 12:06
 * Description: ""
 */
require("./index.scss");
var __UUID = 0;
var Base = require("./base.js");
var Defaults = function(){
	return {
		triggerElem : null,
		height : 200,
		width : "auto",
		options : null,
		offsetX : 0,
		offsetY : 0
	};
};
module.exports = PFT.Util.Class({extend:Base},{
	__Cache : {
		currentOption : {
			key : "",
			value : ""
		},
		data : null
	},
	init : function(opt){
		opt = this.opt = $.extend(Defaults(),opt || {});
		this.uuid = this.__getUUID();
		this.$body = $("body");
		this.triggerElem = opt.triggerElem;
		this.container = this.__createSelectDownBox();
		this.listUl = $('<ul class="pui-select-ul"></ul>').appendTo(this.container);
		this.mask = this.__createMask();
		var options = opt.options;
		if(typeof options=="function") options = options();

		this.triangleBtn = this.__setTriangle();
		this.__bindEvents();

		if(Object.prototype.toString.call(options)=="[object Array]"){
			this.__Cache.data = options;
			this.listUl.html(this.renderOptions(options));
			if(options.length>0){
				this.listUl.children().first().trigger("click");
			}
		}
	},
	__bindEvents : function(){
		var that = this;
		var container = this.container;
		var mask = this.mask;
		var triggerElem = this.triggerElem;
		triggerElem.on("click",function(e){
			triggerElem.toggleClass("on");
			if(triggerElem.hasClass("on")){
				that.show();
			}else{
				that.close();
			}
		})
		container.on("click",".pui-select-option",function(e){
			var tarItem = $(e.currentTarget);
			var key = tarItem.attr("data-key");
			var value = tarItem.find(".t").text();
			that.setValue(key);
			that.close();
			that.trigger("option.click",{key:key,value:value});
		})
		mask.on("click",function(e){
			that.close();
		})
	},
	__getUUID : function(){
		return ++__UUID;
	},
	__position : function(){
		var container = this.container;
		var triggerElem = this.triggerElem;
		var opt = this.opt;
		var offsetY = opt.offsetY;
		var offsetX = opt.offsetX;
		var offset = triggerElem.offset();
		var top = offset.top;
		var left = offset.left;
		var height = triggerElem.outerHeight();
		container.css({
			left : left + offsetX,
			top : top + height + offsetY
		})
	},
	__createSelectDownBox : function(){
		var opt = this.opt;
		var height = opt.height;
		var width = opt.width;
		var id = this.uuid;
		var triggerElem = opt.triggerElem;
		var container = $('<div id="pui-select-container-'+id+'" class="pui-select-container"></div>').appendTo(this.$body);
		container.height(height);
		if(width=="auto"){
			container.width(triggerElem.outerWidth()-2);
		}else{
			container.width(width);
		}
		return container;
	},
	__createMask : function(){
		var mask = $("#pui-select-mask");
		if(mask.length==0){
			mask = $('<div id="pui-select-mask" class="pui-select-mask"></div>').appendTo(this.$body);
		}
		return mask;
	},
	__setTriangle : function(){
		var triggerElem = this.triggerElem;
		var triangle = $('<div class="pui-select-triangleBtn"><i></i></div>');
		if(triggerElem[0].tagName.toUpperCase()=="INPUT"){
			triggerElem.parent().append(triangle);
		}else{
			triggerElem.append(triangle);
		}
		return triangle;
	},
	/**
	 * 设置选中的值到triggerElem
	 * @param key
	 * @param value
	 */
	setValueToTrigger : function(key,value){
		var triggerElem = this.triggerElem;
		triggerElem.attr("data-key",key);
		if(triggerElem[0].tagName.toUpperCase()=="INPUT"){
			triggerElem.val(value)
		}else{
			var t = triggerElem.find(".t");
			if(t.length==0) t = $('<span class="t"></span>').appendTo(triggerElem);
			t.text(value)
		}
	},
	renderOptions : function(data){
		var html = "";
		if(!data) return false;
		var uuid = this.uuid;
		for(var i=0; i<data.length; i++){
			var option = data[i];
			for(var key in option){
				var value = option[key];
				html += '<li data-key="'+key+'" id="pui-select-option-'+uuid+'-'+key+'" class="pui-select-option"><span class="t">'+value+'</span></li>';
			}
		}
		return html;
	},
	/**
	 * 设置某一option为选中状态
	 * @param key    此option的key
	 */
	setValue : function(key){
		if(!key) return false;
		var that = this;
		var value = "";
		this.container.find(".pui-select-option").each(function(){
			var item = $(this);
			var _key = item.attr("data-key");
			var _value = item.find(".t").text();
			if(_key==key){
				value = _value;
				item.addClass("active");
				that.__Cache.currentOption.key = key;
				that.__Cache.currentOption.value = value;
			}else{
				item.removeClass("active");
			}
		})
		this.setValueToTrigger(key,value);
	},
	/**
	 * 获取当前组件的值
	 * @returns {module.exports.__Cache.currentOption|{key, value}}
	 */
	getValue : function(){
		return this.__Cache.currentOption;
	},
	show : function(){
		this.container.show();
		this.__position();
		this.mask.show();
		this.triangleBtn.addClass("on");
		this.triggerElem.addClass("on");
	},
	close : function(){
		this.container.hide();
		this.mask.hide();
		this.triangleBtn.removeClass("on");
		this.triggerElem.removeClass("on");
	}
});
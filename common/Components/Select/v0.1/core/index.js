/**
 * Author: huangzhiyang
 * Date: 2016/11/28 10:59
 * Description: ""
 */
require("./index.scss");
var __UUID = 1;
module.exports = function(){
	var fn = new Function;
	var Defaults = {
		trigger : null,
		height : 300,
		width : "auto",
		data : null,
		field : {
			key : "key",
			value : "value"
		}
	};


	var Select = PFT.Util.Class({
		init : function(opt){
			opt = this.opt = $.extend(Defaults,opt || {});
			this.__cache = {};
			this.__cache.data = [];
			this.uuid = this.__getUUID();
			this.$body = $("body");
			this.container = this.__createContainer();
			this.trigger = opt.trigger;
			var data = this.opt.data;
			if(typeof data=="function") data = data();
			if(Object.prototype.toString.call(data)=="[object Array]"){
				this.__cache.data = data;
				this.listUl = $('<ul class="pui-select-ul"></ul>').appendTo(this.container);
				this.listUl.html(this.render(data));
			}
			this.__bindEvents();
		},
		__bindEvents : function(){
			var that = this;
			var opt = this.opt;
			var container = this.container;
			container.on("click",".pui-select-option",function(e){

			})
		},
		__getUUID : function(){
			return ++__UUID;
		},
		__createContainer : function(){
			var opt = this.opt;
			var height = opt.height;
			var width = opt.width;
			var id = this.uuid;
			var trigger = opt.trigger;
			var container = $('<div id="pui-select-container-'+id+'" class="pui-select-container"></div>').appendTo(this.$body);
			container.height(height);
			if(width=="auto"){
				container.width(trigger.outerWidth());
			}else{
				container.width(width);
			}
			return container;
		},
		render : function(data){
			var html = "";
			if(!data) return false;
			var field = this.opt.field;
			var _key = field.key;
			var _value = field.value;
			var uuid = this.uuid;
			for(var i=0; i<data.length; i++){
				var option = data[i];
				var key = option[_key];
				var value = option[_value];
				html += '<li data-key="'+key+'" id="pui-select-option-'+uuid+'-'+key+'" class="pui-select-option"><span class="t">'+value+'</span></li>';
			}
			return html;
		},
		show : function(){},
		close : function(){},
		getValue : function(){},
		setValue : function(){}

	});

	return Select;

}

/**
 * Author: huangzhiyang
 * Date: 2016/11/30 15:09
 * Description: ""
 */
require("./index.scss");
var Tpl = require("./index.xtpl");
var Defaults = function(){
	return{
		filter : false
	}
}
module.exports = PFT.Util.Class({
	__interval : null,
	init : function(host,opt){
		this.opt = $.extend(Defaults,opt || {});
		this.host = host;
		this.__Cache = host.__Cache;
		this.container = host.container;
		this.searchBoxContainer = $('<div class="searchBoxContainer"></div>').prependTo(this.container);
		this.searchBoxContainer.prepend(Tpl);
		this.__bindEvent();
	},
	__bindEvent : function(){
		var that = this;
		this.container.on("keyup",".searchInp",function(e){
			clearTimeout(that.__interval);
			that.__interval = setTimeout(function(){
				that.onSearchInpChange(e);
			},200)
		})
	},
	onSearchInpChange : function(e){
		var tarInp = $(e.currentTarget);
		var keyword = $.trim(tarInp.val());
		var result = this.filter(keyword);
		var html = this.host.renderOptions(result);
		this.host.listUl.html(html);
	},
	filter : function(keyword){
		var opt = this.opt;
		var __cacheData = this.__Cache.data;
		var filter = opt.filter;
		var result = [];
		if(!keyword) return __cacheData;
		if(typeof filter=="function"){
			result = filter.call(this,__cacheData,keyword);
		}else{
			for(var i=0; i<__cacheData.length; i++){
				var item = __cacheData[i];
				for(var key in item){
					var value = item[key];
					if(value.indexOf(keyword)>-1){
						result.push(item);
					}
				}
			}
		}
		return result;
	}
})
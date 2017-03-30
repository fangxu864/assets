/**
 * Author: huangzhiyang
 * Date: 2016/11/28 16:47
 * Description: ""
 */
var SelectCore = require("../core");
var Tpl = require("./index.xtpl");
require("./index.scss");
module.exports = function(){
	var fn = new Function;
	var __interval = null;
	var Defaults = {
		filter : false
	};
	return PFT.Util.Class({extend:SelectCore()},{
		init : function(opt){
			opt = $.extend(Defaults,opt || {})
			this.constructor.superClass.init(opt);
			this.searchBoxContainer = $('<div class="searchBoxContainer"></div>').prependTo(this.container);
			this.searchBoxContainer.prepend(Tpl);
			this.__bindEvent();
		},
		__bindEvent : function(){
			var that = this;
			this.container.on("keyup",".searchInp",function(e){
				clearTimeout(__interval);
				__interval = setTimeout(function(){
					that.onSearchInpChange(e);
				},200)
			})
		},
		onSearchInpChange : function(e){
			var tarInp = $(e.currentTarget);
			var keyword = $.trim(tarInp.val());
			var result = this.filter(keyword);
			var html = this.render(result);
			console.log(result)
		},
		filter : function(keyword){
			var opt = this.opt;
			var __cacheData = this.__cache.data;
			var field = opt.field;
			var valueField = field.value;
			var filter = opt.filter;
			var result = [];
			if(!keyword) return __cacheData;
			if(typeof filter=="function"){
				result = filter.call(this,__cacheData,keyword);
			}else{
				for(var i=0; i<__cacheData.length; i++){
					var item = __cacheData[i];
					var value = item[valueField];
					if(value.indexOf(keyword)>-1){
						result.push(item);
					}
				}
			}
			return result;
		}
	})







}
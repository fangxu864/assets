/**
 * Author: huangzhiyang
 * Date: 2016/12/2 15:31
 * Description: ""
 */
require("./index.scss");
var SheetCore = require("COMMON/modules/sheet-core/v1");
var City = require("./city");
var theme = require("./theme");
var type = require("./ptype");
var Filter = PFT.Util.Class({
	init : function(opt){
		var opt = opt || {};
		var data = opt.data;
		var container = $('<div id="filterBar" class="filterBar"></div>').appendTo($("body"));
		container.append('<div class="con ui-flex"></div>');
		this.theme = new City({SheetCore:SheetCore, data:data.theme, container:container, host:this});
		this.type = new City({SheetCore:SheetCore, data:data.type, container:container, host:this});
		this.city = new City({SheetCore:SheetCore, data:data.city, container:container, host:this});
		this.bindEvents();
	},
	bindEvents : function(){
		var that = this;
		this.container.on("click",".ui-filterItem-tap",function(e){
			var tarItem = $(e.currentTarget);
			var filterType = tarItem.attr("data-filter");
			that[filterType].show();
		})
	},
	renderHtml : function(data){
		var html = "";
		html += '<ul class="actionUl">';
		for(var i=0; i<data.length; i++){
			var item = data[i];
			if(Object.prototype.toString.call(item)=="[object Object]"){
				html += '<li data-key="'+item.identify+'" class="actionItem center">'+item.name+'</li>';
			}else{
				html += '<li data-key="'+item+'" class="actionItem center">'+item+'</li>';
			}
		}
		html += '</ul>';
		return html;
	}
});
module.exports = Filter;
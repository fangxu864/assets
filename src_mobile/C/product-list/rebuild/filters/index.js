/**
 * Author: huangzhiyang
 * Date: 2016/12/2 15:31
 * Description: ""
 */
require("./index.scss");
var SheetCore = require("COMMON/modules/sheet-core/v1.1");
var City = require("./city");
var Theme = require("./theme");
var Type = require("./ptype");
var Filter = PFT.Util.Class({
	init : function(opt){
		var opt = opt || {},
			data = opt.data;

		var that = this;

		that.container = $('<div id="filterBar" class="filterBar ui-filterBar"></div>').appendTo($(opt.container));
		that.container.append('<div class="con ui-flex"></div>');
		// this.theme = new Theme({SheetCore: SheetCore, data: data.theme, container: this.container.children('.con'), host: this});
		// this.type = new Type({SheetCore: SheetCore, data: data.type, container: this.container.children('.con'), host: this});
		that.city = new City({SheetCore: SheetCore, data: data.city, container: that.container.children('.con'), host: that});
		that.bindEvents();
	},
	bindEvents : function(){
		var that = this;
		this.container.on('tap', '.ui-filterItem', function(e){
			var tarItem = $(e.currentTarget);
			var filterType = tarItem.attr("data-filter");

			that.container.addClass('hide');
			that[filterType].show();
		});
	},
	renderHtml : function( data ){
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
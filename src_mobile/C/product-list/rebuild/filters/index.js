/**
 * Author: huangzhiyang
 * Date: 2016/12/2 15:31
 * Description: ""
 */
var SheetCore = require("COMMON/modules/sheet-core/v1");
var City = require("./city");
var theme = require("./theme");
var type = require("./type");
var Filter = PFT.Util.Class({
	init : function(opt){
		var opt = opt || {};
		var data = opt.data;
		var container = $('<div id="filterBar" class="filterBar"></div>').appendTo($("body"));
		container.append('<div class="con ui-flex"></div>');
		this.theme = new City({SheetCore:SheetCore, data:data.theme, container:container});
		this.type = new City({SheetCore:SheetCore, data:data.type, container:container});
		this.city = new City({SheetCore:SheetCore, data:data.city, container:container});
		this.bindEvents();
	},
	bindEvents : function(){
		var that = this;
		this.container.on("click",".ui-filterItem-tap",function(e){
			var tarItem = $(e.currentTarget);
			var filterType = tarItem.attr("data-filter");
			that[filterType].show();
		})
	}
});
module.exports = Filter;
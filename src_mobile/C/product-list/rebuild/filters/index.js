/**
 * Author: huangzhiyang
 * Date: 2016/12/2 15:31
 * Description: ""
 */
require("./index.scss");
var SheetCore = require("COMMON/modules/sheet-core/v1.1/");
var City = require("./city");
var Theme = require("./theme");
var Type = require("./ptype");
var Filter = PFT.Util.Class({
	init : function(opt){
		var opt = opt || {},
			data = opt.data;

		this.container = $('<div id="filterBar" class="filterBar ui-filterBar"></div>').appendTo($(opt.container));
		this.container.append('<div class="con ui-flex"></div>');
		this.theme = new Theme({SheetCore: SheetCore, data: data.theme, container: this.container.children('.con'), host: this, Page: opt.Page});
		this.type = new Type({SheetCore: SheetCore, data: data.type, container: this.container.children('.con'), host: this, Page: opt.Page});
		this.city = new City({SheetCore: SheetCore, data: data.city, container: this.container.children('.con'), host: this, Page: opt.Page});
		this.bindEvents();
	},
	bindEvents : function(){
		var that = this;
		this.container.on('tap', '.ui-filterItem', function(e){
			var tarItem = $(e.currentTarget);
			var filterType = tarItem.attr("data-filter");

			that.container.addClass('hide');
			that[filterType].show();
		});
	}
});
module.exports = Filter;
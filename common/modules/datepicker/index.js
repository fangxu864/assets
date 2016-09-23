/**
 * Author: huangzhiyang
 * Date: 2016/9/22 18:35
 * Description: ""
 */
require("./index.scss");
var Help = require("./help");
var CalendarCore = require("COMMON/js/calendarCore");
var Head = require("./head");
var Bd = require("./bd");
var Timepicker = require("./timepicker");
var Datepicker = PFT.Util.Class({
	init : function(opt){
		var that = this;
		opt = opt || {};

		var container = this.container = this.initContainer(opt);

		this.head = this.initHead(container);
		this.head.on("yearmonth.change",function(data){
			var to = data.to;
			this.renderDate(to,this.__cacheOpt);
		},this)

		this.bd = this.initBd(container);

		this.timepicker = this.initTimepicker(container);

		this.mask = this.initMask();

	},
	initContainer : function(opt){
		var body = $("body");
		var uuid = Help.getUUID();
		var container = typeof opt.container==="string" ? $(opt.container) : opt.container;
		if(!container){
			container = $('<div id="pftui-datepicker-container-'+uuid+'" class="pftui-datepicker-container"></div>').appendTo(body);
		}
		return container;
	},
	initHead : function(container){
		var header_dom = $('<div class="pftui-datepicker-head"></div>').appendTo(container);
		return new Head({
			container : header_dom,
			CalendarCore : CalendarCore
		});
	},
	initBd : function(container){
		var bd_dom = $('<div class="pftui-datepicker-bd"></div>').appendTo(container);
		return new Bd({
			container : bd_dom,
			CalendarCore : CalendarCore
		});
	},
	initTimepicker : function(container){
		var timepickerContainer_dom = $('<div class="pftui-timepicker-container"></div>').appendTo(container);
		return new Timepicker({container:timepickerContainer_dom});
	},
	initMask : function(){
		var mask = $("#pftui-datepicker-mask");
		if(!mask.length){
			mask = $('<div id="pftui-datepicker-mask" class="pftui-datepicker-mask"></div>');
			mask.on("click",function(e){

			})
		}
		return mask;
	},
	renderDate : function(date,opt){
		var _date = typeof date=="string" ? date : CalendarCore.getnowYearMonth();
		opt = opt || {};
		this.head.setYearmonth(_date);
		this.bd.render(_date,opt);
	},
	open : function(date,opt){
		var day = date.substring(8);
		if(day) opt["default_day"] = date;
		this.__cacheOpt = opt;
		this.renderDate(date,opt);
	}
});

module.exports = Datepicker;




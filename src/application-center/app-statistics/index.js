/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var Pagination = require("COMMON/modules/pagination-x");

var ajaxUrls = require('../common/js/ajaxurl.js');

var Datepicker = require("COMMON/Components/Datepicker/v0.1");

var Template = {
	appBox : PFT.Util.ParseTemplate(require("./tpl/tr-statistics.xtpl"))
};

var Main = PFT.Util.Class({
	static: {
		pageSize: 10
	},
	dom: {
		tbStatistics: '#tbStatistics',
		search: {
			btime: '#effectiveDate',
			etime: '#expiryDate',
			searchappname: '#searchAppName'
		}
	},
	init : function(){
		var _this = this;

		_this.pagination = new Pagination({
	        container : "#pagination",  //必须，组件容器id
	        count : 7,                //可选  连续显示分页数 建议奇数7或9
	        showTotal : true,         //可选  是否显示总页数
	        jump : true               //可选  是否显示跳到第几页
	    });

		_this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
		    // toPage :      要switch到第几页
		    // currentPage : 当前所处第几页
		    // totalPage :   当前共有几页
			_this.ajaxGetData({
				page: toPage,
				loading: function(){

				},
				success: function(res){
					_this.renderAppBox(res.data.list);

					_this.pagination.render({current: toPage, total: res.data.total});
				}
			});
		});

		_this.ajaxGetData({
			page: 1,
			loading: function(){

			},
			success: function(res){
				_this.renderAppBox(res.data.list);

				_this.pagination.render({current: 1, total: res.data.total});
			}
		});

		_this.datepicker = new Datepicker();

		//生效日期
		$(this.dom.search.btime).on('click', function() {
			var minEffectDate = _this.dateFormat( new Date(), 'yyyy-MM-dd'),
				opts = {};

			opts.defaultDate = $(this).val();
			opts.picker = $(_this.dom.search.btime);
			opts.min = minEffectDate;

			_this.showDatepicker(opts);
		});
		$(this.dom.search.etime).on('click', function() {
			var minEffectDate = $(_this.dom.search.btime).val() ? $(_this.dom.search.btime).val() : _this.dateFormat( new Date(), 'yyyy-MM-dd'),
				opts = {};

			opts.defaultDate = $(this).val();
			opts.picker = $(_this.dom.search.etime);
			opts.min = minEffectDate;

			_this.showDatepicker(opts);
		});
	},

	ajaxGetData: function( opts ){
		var fn = new Function,
			_this = this;
		var defaultOpts = {
			page: 			1,
			beginTime: 		'',
			endTime: 		'',
			searchAppName: 	'',
			success: 		fn
		};

		var opts = $.extend(true, defaultOpts, opts);


		PFT.Util.Ajax( ajaxUrls.statistics , {
			params: {
				page: 		opts.page,
				size: 		_this.static.pageSize,
				btime: 		opts.beginTime,
				etime: 		opts.endTime,
				name: 		opts.searchAppName
			},
			loading: function(){
				//加载中
			},
			success: function(res) {
				opts.success(res);
			}
		})
	},

	dateFormat: function (dateObj, fmt) {
	    var o = {
	        "M+": dateObj.getMonth() + 1, //月份
	        "d+": dateObj.getDate(), //日
	        "h+": dateObj.getHours(), //小时
	        "m+": dateObj.getMinutes(), //分
	        "s+": dateObj.getSeconds(), //秒
	        "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度
	        "S": dateObj.getMilliseconds() //毫秒
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	},

	showDatepicker: function (opts) {
		var defaultDate = opts.defaultDate ? opts.defaultDate : '',
			min 		= opts.min ? opts.min : _this.dateFormat( new Date(), 'yyyy-MM-dd');

		this.datepicker.show( defaultDate,{
		    picker : opts.picker,				//必选
		    top : 0,							//可选，相对偏移量
		    left : 0,							//可选，相对偏移量
		    min : min,							//可选，默认为空""
		    todayBeforeDisable : false,			//可选，今天之前的日期都不显示
		    todayAfterDisable : false,			//可选，今天之后的日期都不显示
		})
	},

	renderAppBox : function(data){
		var html = Template.appBox({ data: data });
		$(this.dom.tbStatistics).children('tbody').html(html);
	}
});

$(function(){
	new Main();
	// main.init();
})
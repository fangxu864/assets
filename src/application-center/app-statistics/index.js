/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var Pagination = require("COMMON/modules/pagination-x");

var ajaxUrls = require('../common/js/ajaxurl.js');

var Datepicker = require("COMMON/Components/Datepicker/v0.1");

var loading = require('COMMON/js/util.loading.pc.js');

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
			appname: '#searchAppName',
			btn: '#btnSearch'
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
				page: 			toPage,
				beginTime: 		$(_this.dom.search.btime).val(),
				endTime: 		$(_this.dom.search.etime).val(),
				searchAppName: 	$(_this.dom.search.appname).val(),
				success: function(res){
					_this.renderTable(res.data.list, {
						btime: $(_this.dom.search.btime).val(),
						etime: $(_this.dom.search.etime).val()
					});

					_this.pagination.render({current: toPage, total: res.data.total});
				}
			});
		});

		_this.ajaxGetData({
			page: 1,
			success: function(res){
				_this.renderTable(res.data.list);

				_this.pagination.render({current: 1, total: res.data.total});
			}
		});

		// 搜索
		$(_this.dom.search.btn).on('click', function() {

			_this.ajaxGetData({
				page: 			1,
				beginTime: 		$(_this.dom.search.btime).val(),
				endTime: 		$(_this.dom.search.etime).val(),
				searchAppName: 	$(_this.dom.search.appname).val(),
				success: function(res){
					if(res.data.list) {
						_this.renderTable(res.data.list, {
							btime: $(_this.dom.search.btime).val(),
							etime: $(_this.dom.search.etime).val()
						});

						_this.pagination.render({current: 1, total: res.data.total});
					} else {
						$(_this.dom.tbStatistics).children('tbody').html('<tr><td align="center" colspan="2">查无数据</td></tr>');
					}
				}
			});
		})

		_this.datepicker = new Datepicker();

		//生效日期
		$(this.dom.search.btime).on('click', function() {
			var opts = {};

			opts.defaultDate = $(this).val();
			opts.picker = $(_this.dom.search.btime);

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
			type: 'POST',
			params: {
				page: 		opts.page,
				page_size: 		_this.static.pageSize,
				btime: 		opts.beginTime,
				etime: 		opts.endTime,
				name: 		opts.searchAppName
			},
			loading: function(){
				//加载中
				var html = loading('',{
					tag: 'tr',
					id: 'listLoading',
					colspan: 2
				});
				$(_this.dom.tbStatistics).children('tbody').html(html);
			},
			success: function(res) {
				$('#listLoading').remove();

				if( res.code == 200 ) {
					opts.success && opts.success(res);
				} else {
					alert( res.code + ': ' + res.msg );
				}
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
			min 		= opts.min ? opts.min : '';

		this.datepicker.show( defaultDate,{
		    picker : opts.picker,				//必选
		    top : 0,							//可选，相对偏移量
		    left : 0,							//可选，相对偏移量
		    min : min,							//可选，默认为空""
		    todayBeforeDisable : false,			//可选，今天之前的日期都不显示
		    todayAfterDisable : false,			//可选，今天之后的日期都不显示
		})
	},

	renderTable : function( data, search ){
		var uriStr = '',
			html;

		if( !!search ) {
			if( search.btime && search.btime!='' ) {
				uriStr += '&btime=' + search.btime;
			}

			if( search.etime && search.etime!='' ) {
				uriStr += '&etime=' + search.etime;
			}
		}

		if(!!uriStr) {
			uriStr = encodeURI(uriStr);

			html = Template.appBox({ data: data, uri: uriStr });
		} else {
			html = Template.appBox({ data: data, uri:'' });
		}

		$(this.dom.tbStatistics).children('tbody').html(html);
	}
});

$(function(){
	new Main();
	// main.init();
})
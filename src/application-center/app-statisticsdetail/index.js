/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var Pagination = require("COMMON/modules/pagination-x");

var ajaxUrls = require('../common/js/ajaxurl.js');

var loading = require('COMMON/js/util.loading.pc.js');

var Template = {
	appBox : PFT.Util.ParseTemplate(require("./tpl/tr-statistics.xtpl"))
};

var Main = PFT.Util.Class({
	static: {
		pageSize: 10
	},
	dom: {
		tbStatistics: '#tbStatisticsDetail'
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
				page: 1,
				success: function(res){
					_this.renderAppBox(res.data.list);

					_this.pagination.render({current: toPage, total: res.data.total});
				}
			});
		});

		_this.ajaxGetData({
			page: 1,
			success: function(res){
				_this.renderAppBox(res.data.list);

				_this.pagination.render({current: 1, total: res.data.total});
			}
		});

	},

	getUrlParams: function() {
		var url = window.location.href,
			paramStr = url.split('?')[1],
			paramArr = paramStr.split('&'),
			module_id = paramArr[0].split('=')[1],
			key,
			begintime,
			endtime;

		if( paramArr[1] ) {
			key = paramArr[1].split('=')[0];
			if(key == 'btime') {
				begintime = paramArr[1].split('=')[1];
			} else {
				endtime = paramArr[1].split('=')[1];
			}
		}

		if( paramArr[2] ) {
			key = paramArr[2].split('=')[0];
			if(key == 'btime') {
				begintime = paramArr[2].split('=')[1];
			} else {
				endtime = paramArr[2].split('=')[1];
			}
		}

		return {
			module_id: module_id,
			begintime: begintime,
			endtime: endtime
		}
	},
	ajaxGetData: function( opts ){
		var fn = new Function,
			_this = this;
		var defaultOpts = {
			page: 			1,
			success: 		fn
		};

		var opts = $.extend(true, defaultOpts, opts);

		var urlParams = _this.getUrlParams();

		PFT.Util.Ajax( ajaxUrls.statisticsDetail , {
			type: 'POST',
			params: {
				module_id: 	urlParams.module_id,
				btime: 		urlParams.begintime ? urlParams.begintime : '',
				etime: 		urlParams.endtime ? urlParams.endtime : '',
				page: 		opts.page,
				size: 		_this.static.pageSize
			},
			loading: function(){
				//加载中
				loading('',{
					tag: 'tr',
					id: 'listLoading',
					colspan: 3
				});
			},
			success: function(res) {
				$('#listLoading').remove();

				if(res.code == 200) {
					opts.success && opts.success(res);
				} else {
					// opts.error && opts.error( res.code );
					alert( res.msg );
				}
			},
			error: function( xhr, txt ) {
				alert( txt );
			}
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
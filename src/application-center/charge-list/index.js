/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var ajaxUrls = require('../common/js/ajaxurl.js');

var Pagination = require("COMMON/modules/pagination-x");

var loading = require('COMMON/js/util.loading.pc.js');

var Toast = require('COMMON/modules/Toast');

var Template = {
	tplTb : PFT.Util.ParseTemplate(require("./tpl/tr-charge.xtpl")),
	tplOption : PFT.Util.ParseTemplate(require("./tpl/option.xtpl"))
};

var Main = PFT.Util.Class({
	static: {
		pageSize: 10
		// payMode: ['年','季度','月']
	},
	init : function(){
		var _this = this;

		// 初始化分页
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
				success: function(res){
					_this.renderTable(res.data.list);

					_this.pagination.render({current: toPage, total: res.data.total});
				}
			});
		});

		// 获取付费模式
		_this.ajaxGetMode();
		// 加载第一页
		_this.ajaxGetData({
			page: 1,
			success: function(res){
				_this.renderTable(res.data.list);

				_this.pagination.render({current: 1, total: res.data.total});
			}
		});

		// 搜索
		$('#searchCharge').on('click', function() {

			_this.ajaxGetData({
				page: 1,
				searchAppName: 	$('#searchAppName').val(),
				payMode: 		$('#searchChargeMode').val(),
				success: function(res){
					_this.renderTable(res.data.list);

					_this.pagination.render({current: 1, total: res.data.total});
				}
			});
		})
	},

	ajaxGetData: function( opts ){
		var fn = new Function,
			_this = this;

		var defaultOpts = {
			page: 			1,
			searchAppName: 	'',
			payMode: 		'',
			success: 		fn
		};

		var opts = $.extend(true, defaultOpts, opts);


		PFT.Util.Ajax( ajaxUrls.chargeList , {
			params: {
				page: 		opts.page,
				pageSize: 	_this.static.pageSize,
				name: 		opts.searchAppName,
				mode: 		opts.payMode
			},
			type: 'POST',
			loading: function(){
				loading('',{
					tag: 'tr',
					id: 'listLoading',
					colspan: 5
				});
			},
			success: function(res) {
				$('#listLoading').remove();

				if(res.code == 200) {
					opts.success(res);
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
	ajaxGetMode: function() {
		var _this = this;

		PFT.Util.Ajax( ajaxUrls.getMode , {
			type: 'POST',
			success: function(res) {

				if(res.code == 200) {
					_this.renderSelect(res.data);
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
	renderTable : function( data ){
		var html = Template.tplTb({ data: data });
		$('#tbCharge').children('tbody').html(html);
	},
	renderSelect : function( data ){
		var html = Template.tplOption({ data: data });
		$('#searchChargeMode').append(html);
	}
});

$(function(){
	new Main();
	// main.init();
})
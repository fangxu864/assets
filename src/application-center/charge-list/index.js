/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var ajaxUrls = require('../common/js/ajaxurl.js');

var Pagination = require("COMMON/modules/pagination-x");

var Template = {
	appBox : PFT.Util.ParseTemplate(require("./tpl/tr-charge.xtpl"))
};

var Main = PFT.Util.Class({
	static: {
		pageSize: 10,
		payMode: ['年','季度','月']
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
	},
	ajaxGetData: function( opts ){
		var fn = new Function,
			_this = this;
		var defaultOpts = {
			page: 			1,
			searchAppName: 	'',
			payMode: 		null,
			loading: 		fn,
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
			loading: function(){
				opts.loading();
			},
			success: function(res) {
				opts.success(res);
			}
		})
	},
	renderAppBox : function(data){
		var html = Template.appBox({ data: data });
		$('#tbCharge').children('tbody').html(html);
	}
});

$(function(){
	new Main();
	// main.init();
})
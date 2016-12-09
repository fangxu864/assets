/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var Pagination = require("COMMON/modules/pagination-x");

var Template = {
	appBox : PFT.Util.ParseTemplate(require("./tpl/tr-app.xtpl"))
};

var Main = PFT.Util.Class({
	static: {
		pageSize: 10
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

		PFT.Util.Ajax( ajaxUrls.appList , {
			params: {
				page: 		opts.page,
				pageSize: 	_this.static.pageSize
			},
			loading: function(){

			},
			success: function(res) {
				_this.renderAppBox(res.data.list);

				_this.pagination.render({current: 1, total: res.data.total});
			}
		});

		// this.renderAppBox([
		// 	{
		// 		id : "121",
		// 		appname : "微商城1",
		// 		isFree : true,
		// 		daysFreeTrial : 30,
		// 		appRecommend: '营销活动、优惠券',
		// 		appDesc: '微商城微商城微商城微商城微商城微商城微商城微商城微商城微商城'
		// 	},
		// 	{
		// 		id : "121",
		// 		appname : "微商城2",
		// 		isFree : true,
		// 		daysFreeTrial : 30,
		// 		appRecommend: '营销活动、优惠券',
		// 		appDesc: '微商城微商城微商城微商城微商城微商城微商城微商城微商城微商城'
		// 	}
		// ]);


		// this.pagination.render({current: 1, total: 10});

	},

	renderAppBox : function(data){
		var html = Template.appBox({data:data});

		$('#tbApp tbody').append(html);
	}
});

$(function(){
	new Main();
	// main.init();
})
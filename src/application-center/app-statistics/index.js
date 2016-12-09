/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var Pagination = require("COMMON/modules/pagination-x");

var Template = {
	appBox : PFT.Util.ParseTemplate(require("./tpl/tr-charge.xtpl"))
};

var Main = PFT.Util.Class({
	init : function(){
		this.renderAppBox([
			{
				appId : "121",
				appName : "微商城1",
				payMode : "月",
				chargePerCycle : "111",
				startTime: '2016-01-01',
				endTime: '2017-01-01'
			},
			{
				appId : "122",
				appName : "微商城2",
				payMode : "月",
				chargePerCycle : "111",
				startTime: '2016-01-01',
				endTime: '2017-01-01'
			},
			{
				appId : "123",
				appName : "微商城3",
				payMode : "月",
				chargePerCycle : "111",
				startTime: '2016-01-01',
				endTime: '2017-01-01'
			}
		]);

		this.pagination = new Pagination({
	        container : "#pagination",  //必须，组件容器id
	        count : 7,                //可选  连续显示分页数 建议奇数7或9
	        showTotal : true,         //可选  是否显示总页数
	        jump : true               //可选  是否显示跳到第几页
	    });

		this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
		    // toPage :      要switch到第几页
		    // currentPage : 当前所处第几页
		    // totalPage :   当前共有几页

		});
		this.pagination.render({current: 1, total: 10});

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
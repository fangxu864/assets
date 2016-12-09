/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var Pagination = require("COMMON/modules/pagination-x");

var Template = {
	appBox : PFT.Util.ParseTemplate(require("./tpl/app-box.tpl"))
};

var Main = PFT.Util.Class({
	init : function(){
		this.renderAppBox({
			id : "121",
			name : "微商城",
			iconCls : "sMall",
			priceText : ""
		});

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
		var html = Template.appBox(data);
		// console.log(html);
	}
});

$(function(){
	new Main();
	// main.init();
})
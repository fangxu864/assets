/**
 * Author: huangzhiyang
 * Date: 2016/9/12 15:14
 * Description: ""
 */
require('./index.scss');
var PaginationX = require("COMMON/modules/pagination-x");
var Calendar = require("COMMON/modules/calendar");
var Main = PFT.Util.Class({
	init : function(){
		this.attr = "3";
		var pagination = this.pagination = new PaginationX({
			container : "#paginationXContainer",
			count : 7,
			showTotal : true,
			jump : true
		});


		pagination.on("page.switch",function(toPage,currentPage,totalPage){
			this.render({current:toPage,total:totalPage});
		});

		pagination.render({current:1,total:20});
		//
		//var calendar = new Calendar();
		//calendar.on("select",function(data){
		//
		//})
		//calendar.show("2016-06-30",{   //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
		//	picker : $("#beginTimeInp"), //页面上点击某个picker弹出日历(请使用input[type=text])
		//	top : 0,                     //日历box偏移量
		//	left : 0,                    //日历box偏移量
		//	min : "2016-06-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
		//	max : "2016-07-10",          //2016-07-10往后的日期都不可选 会自动挂上disable类名
		//	onBefore : function(){},     //弹出日历前callback
		//	onAfter : function(){}       //弹出日历后callback
		//})
	}
});

$(function(){
	new Main();
})

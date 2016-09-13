/**
 * Author: huangzhiyang
 * Date: 2016/9/12 15:14
 * Description: ""
 */
var PaginationX = require("COMMON/modules/pagination-x");

var Main = {
	init : function(){

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

	}
};


$(function(){
	Main.init();
})
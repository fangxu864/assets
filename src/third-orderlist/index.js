/**
 * Author: huangzhiyang
 * Date: 2016/9/12 15:14
 * Description: ""
 */
var PaginationX = require("COMMON/modules/pagination-x");

var Main = {
	init : function(){
		this.pagination = new PaginationX({
			container : "#paginationXContainer"
		});

		this.pagination.render({current:1,total:10})

	}
};


$(function(){
	Main.init();
})
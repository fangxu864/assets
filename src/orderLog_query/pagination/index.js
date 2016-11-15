/**
 * Created by Administrator on 2016/11/15.
 */
var Pagination = require("COMMON/modules/pagination-x");

var pagination = new Pagination({
     	container: "#pagination_box",  //必须，组件容器id
 		count : 7,                //可选  连续显示分页数 建议奇数7或9
		showTotal : true,         //可选  是否显示总页数
		jump : true	              //可选  是否显示跳到第几页
 });

pagination.on("page.switch",function(toPage,currentPage,totalPage){
    		// toPage :      要switch到第几页
    	    // currentPage : 当前所处第几页
    	    // totalPage :   当前共有几页
	pagination.render({current:toPage,total:totalPage});
     });
pagination.render({current:1,total:2});



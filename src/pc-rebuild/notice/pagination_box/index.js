/**
 * Created by Administrator on 2016/12/1.
 */
//引入插件文件
var Pagination = require("COMMON/modules/pagination-x");

//实例化
pagination = new Pagination({
    container: "#pagination_box",  //必须，组件容器id
    count : 7,                //可选  连续显示分页数 建议奇数7或9
    showTotal : true,         //可选  是否显示总页数
    jump : true	              //可选  是否显示跳到第几页
});

//当页面切换时，调用的方法，page.switch是封装在插件内的自定义事件
pagination.on("page.switch",function(toPage,currentPage,totalPage){
    pagination.render({current:toPage,total:totalPage}); 	 //渲染点击的页面
});


//分页器渲染
pagination.render({current:toPage,total:totalPage});
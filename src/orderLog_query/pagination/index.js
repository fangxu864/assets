/**
 * Created by Administrator on 2016/11/15.
 */
var Pagination = require("COMMON/modules/pagination-x");

var changePage=PFT.Util.Class({
	container:"#table_box",
	EVENTS:{

	},
	init:function(){
		var pagination = new Pagination({
			container: "#pagination_box",  //必须，组件容器id
			count : 2,                //可选  连续显示分页数 建议奇数7或9
			showTotal : true,         //可选  是否显示总页数
			jump : true	              //可选  是否显示跳到第几页
		});

		pagination.on("page.switch",function(toPage,currentPage,totalPage){
			this.trigger("refreshData",toPage);
			pagination.render({current:toPage,total:totalPage});
		});
		pagination.render({current:1,total:2});
	}
});


module.exports=changePage;





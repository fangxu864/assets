console.log("我是供应商页面");

var Pagination = require("COMMON/modules/pagination-x");




pagination = new Pagination({
    container : "#pagination_wrap" , //必须，组件容器id
    // count : 7,                //可选  连续显示分页数 建议奇数7或9
    showTotal : true,         //可选  是否显示总页数
    jump : true	              //可选  是否显示跳到第几页
});
pagination.on("page.switch",function(toPage,currentPage,totalPage){
    // toPage :      要switch到第几页
    // currentPage : 当前所处第几页
    // totalPage :   当前共有几页
    pagination.render({current:toPage,total:totalPage});
    console.log(toPage);
    console.log(currentPage);
    console.log(totalPage);
    // _this.filterParamsBox["page"]=toPage;
    // var cacheKey=_this.JsonStringify(_this.filterParamsBox);
    // if(_this.dataContainer[cacheKey]){
    //     _this.dealReqData(_this.dataContainer[cacheKey]);
    // }else{
    //     _this.ajaxGetData({
    //         "params":_this.filterParamsBox,
    //         "isCacheData":true,
    //         "cacheKey":cacheKey,
    //         "isInitPagination":false
    //     });
    // }
});

pagination.render({current:1,total:10});



$("#test").on("click",function(){
	$.ajax({
		url:"/r/Mall_Poster/supplyProPosters/",
		type:"POST",
		dataType:"json",
		data:{
			"page":1,
			"pageSize":9
		},
		success:function(res){
			console.log(res);
		}
	});
});






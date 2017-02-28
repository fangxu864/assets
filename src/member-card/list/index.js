require("./index.scss");
var ListManager = require("./list-manager");
var FilterManager = require("./filter");
var PaginationManager = require("COMMON/Components/Pagination");

var Main = PFT.Util.Class({
    init : function(){
        var Filter = this.Filter = new FilterManager();
        var List = this.List = new ListManager();
        var Pagination = this.Pagination = new PaginationManager({
            container : "#paginationContainer",  //必须，组件容器id
            count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });

        //搜索模块
        Filter.on("search",function(params){
            List.fetchList(params);
        })

        //分页器模块
        Pagination.on("page.switch",function(page){
            var params = Filter.getParams();
            params["currentPage"] = page;
            List.fetchList(params);
        })

        //列表模块
        List.on("loading",function(){
            Pagination.render(null);
        })
        List.on("success",function(res){
            var currentPage = res.page;
            var totalPage = res.totalpage;
            Pagination.render({current:currentPage,total:totalPage});
        })
        List.on("refresh",function(){
            var params = Filter.getParams();
            List.fetchList(params);
        })

    }
});


$(function(){
    new Main;
})
/**
 * Created by ZhengJs on 2016/12/19.
 */
require("./index.scss");
var Pagination = require("COMMON/modules/pagination-x");
var Service = require("./product_MemberCardBasic-lands_Service.js");


var Main = {
 //声明分页器为全局变量
    pagination:null,
 //初始化————————————————————————————————————————————————————————————
    init:function () {
        this.paginationInit();
        this.pagination.render({current:1,total:10});
        this.getWholeData();
        this.eventInit()
    },
    
 //以下为结构部分——————————————————————————————————————————————————————
    //初始化分页器
    paginationInit:function () {
        var _this = this;
        _this.pagination = new Pagination({
            container: "#pagination_box",  //必须，组件容器id
            count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });

        _this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
            _this.pagination.render({current:toPage,total:totalPage}); 	 //渲染点击的页面
        });
    },
    
    //事件初始化
    eventInit:function () {

    },
    getWholeData:function () {
        var _this = this;
        Service({title:"123"},{
            success:function (data) {
                _this.Wholedata = data;
                console.log(_this.data)
            },
            empty:function () {
                console.log("empty")
            }
        })
    }
};

$(function () {
    Main.init()
});
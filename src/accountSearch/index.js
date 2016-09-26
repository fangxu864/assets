/**
 * Created by Administrator on 2016/9/26.
 */


//引入css
require("./index.scss");
//引入tpl
var filter_tpl=require("./tpl/filter.xtpl");
var total_tpl=require("./tpl/total.xtpl");
var tableCon_tpl=require("./tpl/tableCon.xtpl");



var accountSearch={
    init:function () {
        var _this=this;
        /***初始化容器盒子和内容***/
        //获取容器盒子
        this.filter_box=$(".filter_box");
        this.total_box=$(".total_box");
        this.tableCon_box=$(".tableCon_box");
        this.queryState_box=$(".queryState_box");
        //往容器盒子中添加内容
        this.filter_box.html(filter_tpl);
        this.total_box.html(total_tpl);
        this.tableCon_box.html(tableCon_tpl);


    },
    bind:function () {
        
    },
    getFilerParams:function () {
        
    },
    
    
};
$(function () {
    accountSearch.init();
})




/**
 * Created by Administrator on 2016/9/27.
 */

require("./index.scss");
//引入各种tpl
var tableCon_tpl=require("./tpl/tableCon.xtpl");


var admin_qingfen={
    init:function () {
        var _this=this;
        //获取内容盒子
        this.tableCon_box=$(".tableCon_box");
        //往盒子中添加内容
        this.tableCon_box.html(tableCon_tpl);
    },
    bind:{
        
    },
    
}

$(function () {
    admin_qingfen.init();
})

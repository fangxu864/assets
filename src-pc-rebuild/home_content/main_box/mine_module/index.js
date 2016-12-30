/**
 * Created by Administrator on 2016/12/29.
 */
var mine_xtpl = require("./index.xtpl");
var Class = require("COMMON/js/util.class.js");
//块级写法：
var mine_module=Class({
    //放入容器
    container:"#mine_module",

//绑定事件
    EVENTS:{},
    init:function(){
        console.log("mine load sucessfully");
         $("#main_box").append(mine_xtpl)
    },
});

//模块导出
module.exports=mine_module;
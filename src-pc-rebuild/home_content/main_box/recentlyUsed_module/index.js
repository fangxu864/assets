/**
 * Created by Administrator on 2016/12/29.
 */

var recently_used_xtpl = require("./index.xtpl");
var Class = require("COMMON/js/util.class.js");
//块级写法：
var recently_used_module=Class({
    //放入容器
    container:"#recentlyUsed_module",

//绑定事件
    EVENTS:{},
    init:function(){
        console.log("module_recent load sucessfully");
         $("#main_box").append(recently_used_xtpl)
    },
});

//模块导出
module.exports=recently_used_module;
/**
 * Created by Administrator on 2016/12/29.
 */
var markertingApp_xtpl = require("./index.xtpl");
var Class = require("COMMON/js/util.class.js");
//块级写法：
var markertingApp_module=Class({
    //放入容器
    container:"#markertingApp_module",

//绑定事件
    EVENTS:{
        
    },
    init:function(){
        console.log("markertingApp_module load sucessfully");
         $("#main_box").append(markertingApp_xtpl)
    },
});

//模块导出
module.exports=markertingApp_module;
/**
 * Created by Administrator on 2016/12/29.
 */
var orderData_xtpl = require("./index.xtpl");
var Class = require("COMMON/js/util.class.js");
//块级写法：
var orderData_module=Class({
    //放入容器
    container:"#orderData_module",

//绑定事件
    EVENTS:{},
    init:function(){
        console.log("orderData load sucessfully");
         $("#side_box").append(orderData_xtpl)
    },
});

//模块导出
module.exports=orderData_module;
/**
 * Created by Administrator on 2016/12/29.
 */
var wxData_xtpl = require("./index.xtpl");
var Class = require("COMMON/js/util.class.js");
//块级写法：
var wxData_module=Class({
    //放入容器
    container:"#wxData_module",

//绑定事件
    EVENTS:{},
    init:function(){
        console.log("orderData load sucessfully");
         $("#main_box").append(wxData_xtpl)
    },
});

//模块导出
module.exports=wxData_module;
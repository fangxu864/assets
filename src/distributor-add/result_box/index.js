/**
 * Created by Administrator on 2016/11/21.
 */
/**
 * Created by Administrator on 2016/11/21.
 */
require("./index.scss");
var tpl = require("./result_box.xtpl");

//块级写法\
var RESULT_BOX=PFT.Util.Class({
    //放入容器
    container:"#result_box",

//绑定事件
    EVENTS:{
        // "click #id1":"event1",
        // "click .class1":"event2"
    },

    //init()方法在实例化以后会默认执行
    init:function(){
        $("#result_box").append(tpl)
    },

//事件调用方法1
    event1:function(){

        this.selfFunctionCall1();   //可以调用自身的函数
        this.trigger("customizedEvent1",data);   //可以发布自定义事件用于在主模块监听

    },
//事件调用方法2
    event2:function(){
    },

//用于函数内部自我调用的方法
    selfFunctionCall1:function(){
    }
});

//模块导出
module.exports=RESULT_BOX;
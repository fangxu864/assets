/**
 * Created by Administrator on 2016/11/21.
 */
/**
 * Created by Administrator on 2016/11/21.
 */
require("./index.scss");
var tpl = require("./quick_box.xtpl");

//块级写法\
var QUICK_BOX=PFT.Util.Class({
    //放入容器
    container:"#quick_box",

//绑定事件
    EVENTS:{
         "click figcaption":"quickAdd",
         "click .picture_p":"clickPlatform"
    },

    //init()方法在实例化以后会默认执行
    init:function(){
        $("#quick_box").append(tpl)
    },

//事件调用方法1
    quickAdd:function(e){
        var _this=this;
        $.post("../call/jh_mem.php",
            {action:"chkAndGetDname",dname:$(e.target).attr("data-name")},
            function (req){
                if(req.ajaxStatus == "fail"){
                    alert(req.reqMsg);
                    return false
                }
                //var fakedata = {"id":"1929","dname":"\u5fae\u5929\u4e0b\uff08\u53a6\u95e8\uff09\u7f51\u7edc\u79d1\u6280\u6709\u9650\u516c\u53f8","mobile":"15859107801","passport":"200766","cname":"\u90b9\u5efa\u534e","com_type":"\u65c5\u884c\u793e","created":0,"ajaxStatus":2,"ajaxMsg":"\u5b58\u5728\u8be5\u8d26\u53f7","ajaxMobile":"15859107801"}
                _this.trigger("quickShow",req)
            },"json")
    },


    clickPlatform:function () {
        window.location.href='../alliance_join.html?id=4'
    },


//用于函数内部自我调用的方法
    selfFunctionCall1:function(){
    }
});

//模块导出
module.exports=QUICK_BOX;
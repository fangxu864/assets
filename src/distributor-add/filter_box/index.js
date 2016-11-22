/**
 * Created by Administrator on 2016/11/21.
 */
require("./index.scss");
var tpl = require("./filter_box.xtpl");

//块级写法\
var FILTER_BOX=PFT.Util.Class({
    //放入容器
    container:"#filter_box",

//绑定事件
    EVENTS:{
         "input #dis_nickname":"search",
        // "click .class1":"event2"
    },

    //init()方法在实例化以后会默认执行
    init:function(){
        $("#filter_box").append(tpl)
    },

//事件调用方法1
search:function(){
    var _this=this;
$.get("../call/jh_mem.php",
    {action:"fuzzyGetDname",dname:$("#dis_nickname").val()},
    function (req){
        var fakeReq=[{"id":"284","dname":"\u62c9\u624b\u7f51","mobile":"18789718151","passport":"200044","cname":"\u6f58\u5b5d\u73e0","com_type":"\u7535\u5546","created":0},{"id":"318","dname":"\u6765\u5f80\u5546\u65c5","mobile":"13379992424","passport":"200063","cname":"\u674e\u6653\u9633","com_type":"\u5176\u4ed6","created":0},{"id":"664","dname":"\u6ea7\u9633\u5e02\u94f6\u674f\u6811\u7968\u52a1\u4e2d\u5fc3","mobile":"15051900690","passport":"200128","cname":"\u8463\u5148\u751f","com_type":"\u5176\u4ed6","created":0},{"id":"672","dname":"\u65c5\u6e38\u4e92\u8054","mobile":"13475969093","passport":"200136","cname":"\u66f9\u5148\u751f","com_type":"\u5176\u4ed6","created":1},{"id":"680","dname":"\u4e50\u6e38\u5929\u4e0b","mobile":"15588839766","passport":"200144","cname":"\u6d4e\u5357\u4e50\u6e38\u5929\u4e0b\u4fe1\u606f\u54a8\u8be2\u6709\u9650\u516c\u53f8","com_type":"\u7535\u5546","created":0},{"id":"697","dname":"\u6d41\u6d6a\u7f51","mobile":"18950117818","passport":"200161","cname":"\u6d41\u6d6a\u7f51","com_type":"\u7535\u5546","created":0},{"id":"710","dname":"\u8fde\u660e\u4e3d","mobile":"13720735111","passport":"200174","cname":"\u8fde\u660e\u4e3d","com_type":"\u65c5\u884c\u793e","created":0},{"id":"737","dname":"\u8fbd\u5b81\u56fd\u9645\u5546\u52a1\u65c5\u884c\u793e","mobile":"18602490411","passport":"200200","cname":"\u90d1\u51ef\u6587","com_type":"\u65c5\u884c\u793e","created":0},{"id":"789","dname":"\u5415","mobile":"15005912274","passport":"200252","cname":"\u5415\u9e4f\u8f89","com_type":"\u65c5\u884c\u793e","created":0},{"id":"822","dname":"\u65c5\u6e38\u5c0f\u5e97","mobile":"15764235091","passport":"200282","cname":"\u5d14\u7389\u857e","com_type":"\u5176\u4ed6","created":0}]
        _this.trigger("showResult",fakeReq)
    },"json")
},
//事件调用方法2
event2:function(){
},

//用于函数内部自我调用的方法
selfFunctionCall1:function(){
}
});

//模块导出
module.exports=FILTER_BOX;
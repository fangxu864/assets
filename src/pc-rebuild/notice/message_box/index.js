/**
 * Created by Administrator on 2016/12/1.
 */

var message_accept_tpl = require("./message_accept.xtpl");
var message_send_tpl = require("./message_send.xtpl");
//块级写法：
var message_box=PFT.Util.Class({
    //放入容器
    container:"#notice_box",

//绑定事件
    EVENTS:{
        //已发送通知 和 收到通知
        "click #message_send":"btn_send",
        "click #message_accept":"btn_accept",

        //收到通知中: 所有通知 未读通知 已读通知
        "click #message-all":"btn_all",
        "click #message-unread":"btn_unread",
        "click #message-read":"btn_read",
    },

    //init()方法在实例化以后会默认执行
    init:function(){
        $("#message_container").empty();
        $("#message_container").append(message_send_tpl);
    },


    //内部事件
        //已发送通知 和 收到通知
    btn_send:function (e) {
        $(e.target).addClass("active_tab").siblings().removeClass("active_tab");

        $("#message_container").empty();
        $("#message_container").append(message_send_tpl);
    },

    btn_accept:function (e) {
        $(e.target).addClass("active_tab").siblings().removeClass("active_tab");

        $("#message_container").empty();
        $("#message_container").append(message_accept_tpl);
    },

        //已发送通知 和 收到通知
    btn_all:function (e) {
        $(e.target).addClass("active_type").siblings().removeClass("active_type");
    },
    btn_unread:function (e) {
        $(e.target).addClass("active_type").siblings().removeClass("active_type");
    },
    btn_read:function (e) {
        $(e.target).addClass("active_type").siblings().removeClass("active_type");
    },

        //



    //用于函数内部自我调用的方法
    selfFunctionCall1:function(){
    }
});

//模块导出
module.exports=message_box;

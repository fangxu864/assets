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

        //全选 标记为已读 删除
        "click #chooseAll":"btn_chooseAll",
        "click #mark":"btn_mark",
        "click #delete":"btn_delete",

        
    },

    //init()方法在实例化以后会默认执行
    init:function(){
        var _this = this;
        $("#message_container").empty();
        $("#message_container").append(message_send_tpl);
    },
    
    //初始化部分不能发布事件，因为顺序问题不会得到相应


    //内部事件
        //---------------------------已发送通知 和 收到通知
    btn_send:function (e) {
        var _this = this;
        $(e.target).addClass("active_tab").siblings().removeClass("active_tab");

        //清空数据，加载新模版
        $("#message_container").empty();
        $("#message_container").append(message_send_tpl);

        _this.trigger("show_message_send")
    },

    btn_accept:function (e) {
        var _this = this;
        $(e.target).addClass("active_tab").siblings().removeClass("active_tab");

        //清空
        $("#message_container").empty();
        $("#message_container").append(message_accept_tpl);

        _this.trigger("show_message_accept")
    },

        //--------------------------所有通知 未读通知 已读通知
    btn_all:function (e) {
        var _this = this;
        $(e.target).addClass("active_type").siblings().removeClass("active_type");
        $(".message_accept ul:eq(1)").empty();
        _this.trigger("message_all")

    },
    btn_unread:function (e) {
        var _this = this;
        $(e.target).addClass("active_type").siblings().removeClass("active_type");
        $(".message_accept ul:eq(1)").empty();
        _this.trigger("message_unread")
    },
    btn_read:function (e) {
        var _this = this;
        $(e.target).addClass("active_type").siblings().removeClass("active_type");
        $(".message_accept ul:eq(1)").empty();
        _this.trigger("message_read")
    },

        //----------------------------------------------全选 标记为已读 删除
    btn_chooseAll:function () {
        var isChoose = [];

        $(".content").find("li").each(function (index,Element) {
            if($(Element).find("input[type='checkbox']").attr("checked")){
                isChoose.push(1)
            }else{
                isChoose.push(0)
            }
        });

        var num = 0 ;
        var flag = 0 ;
        for(var i = 0 ; i < isChoose.length ; i++){
            num += isChoose[i];
            flag += 1;
        }

        if(num == flag){
            $(".content").find("li").each(function (index,Element) {
                $(Element).find("input[type='checkbox']").attr("checked",false)
            })
        }else{
            $(".content").find("li").each(function (index,Element) {
                $(Element).find("input[type='checkbox']").attr("checked",true)
            })
        }


    },

    btn_delete:function () {
        var _this = this;
        var deleteBox = [];
        $(".content").find("li").each(function (index,Element) {
            if($(Element).find("input[type='checkbox']").attr("checked")){
                deleteBox.push($(Element).attr("data-id"))
            }
        });

        if(deleteBox.length ==0 ){return false}
        _this.trigger("clickDelete",deleteBox)
    },
    btn_mark:function () {
        var _this = this;
        var markBox = [];
        $(".content").find("li").each(function (index,Element) {
            if($(Element).find("input[type='checkbox']").attr("checked")){
                markBox.push($(Element).attr("data-id"))
            }
        });

        if(markBox.length ==0 ){return false}
        _this.trigger("clickMark",markBox)
    }
});

//模块导出
module.exports=message_box;

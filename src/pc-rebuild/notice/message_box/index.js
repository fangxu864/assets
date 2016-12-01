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
        "click #delete":"btn_delete"
    },

    //init()方法在实例化以后会默认执行
    init:function(){
        var _this = this;
        $("#message_container").empty();
        $("#message_container").append(message_send_tpl);
    },
    
    //初始化部分不能发布事件，因为顺序问题不会得到相应


    //内部事件
        //已发送通知 和 收到通知
    btn_send:function (e) {
        //动画
        $(e.target).addClass("active_tab").siblings().removeClass("active_tab");

        //清空数据，加载新模版
        $("#message_container").empty();
        $("#message_container").append(message_send_tpl);

        //假数据
        var fakeData = [{content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"}
        ];
        var req = fakeData;

        //加载数据
        for(var i = 0 ; i<fakeData.length ; i++){
            var li = $("<li> <input type='checkbox'/> <span class='blue'>"+req[i].content+"</span> <span class='time'>"+req[i].time+"</span> </li>");
            $(".message_send ul").append(li);
        }

    },

    btn_accept:function (e) {
        $(e.target).addClass("active_tab").siblings().removeClass("active_tab");

        //清空
        $("#message_container").empty();
        $("#message_container").append(message_accept_tpl);

        //假数据
        var fakeData = [{status:"[未读]",content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {status:"[未读]",content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {status:"[已读]",content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {status:"[未读]",content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {status:"[未读]",content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {status:"[已读]",content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {status:"[未读]",content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {status:"[未读]",content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {status:"[已读]",content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},
            {status:"[未读]",content:"[2016-05-31]测试发布通知咯咯",time:"2016-05-31"},

        ];

        var req = fakeData;
        //加载数据
        for(var i = 0 ; i<fakeData.length ; i++){
            var li = $("<li> <input type='checkbox'/> <span>"+req[i].status+"</span> <span>"+req[i].content+"</span> <span class='time'>"+req[i].content+"</span> </li>");
            $(".message_accept ul:eq(1)").append(li);
        }
    },

        //已发送通知 和 收到通知
    btn_all:function (e) {
        $(e.target).addClass("active_type").siblings().removeClass("active_type");
        $(".message_accept ul:eq(1)").empty()

    },
    btn_unread:function (e) {
        $(e.target).addClass("active_type").siblings().removeClass("active_type");
        $(".message_accept ul:eq(1)").empty()
    },
    btn_read:function (e) {
        $(e.target).addClass("active_type").siblings().removeClass("active_type");
        $(".message_accept ul:eq(1)").empty()
    },

        //全选 标记为已读 删除
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



    //用于函数内部自我调用的方法
    selfFunctionCall1:function(){
    }
});

//模块导出
module.exports=message_box;

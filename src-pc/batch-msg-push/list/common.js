module.exports = {
    //在这里配置消息类型
    msgType : [{
        val : -1,
        text : "不限"
    },{
        val : 0,
        text : "通用提醒"
    },{
        val : 2,
        text : "礼券到期"
    },{
        val : 1,
        text : "礼券到期"
    }],

    //在这里配置状态值,后端有新状态加入来的话，直接在这里添加即可
    msgStatus : [{
        val : -1,
        text : "不限"
    },{
        val : 0,
        text : "关闭"
    },{
        val : 1,
        text : "启动"
    },{
        val : 2,
        text : "完成"
    }],

    //后端接口地址
    url : {
        //获取消息列表
        msgList : "/r/MsgNotify_BatNotify/getPushTaskList/"
    }


}
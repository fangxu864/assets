module.exports = {


    CheckRadioSelect : require("./CheckRadioSelect"),


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
        text : "生日祝福"
    }],

    //推送渠道
    channel : {
        0 : "微信",
        1 : "短信"
    },

    //推送方式
    sendType : {
        0 : "立即推送",
        1 : "定时推送",
        2 : "动态推送"
    },

    //在这里配置状态值,后端有新状态加入来的话，直接在这里添加即可
    msgStatus : [{
        val : -1,
        text : "全部"
    },{
        val : 0,
        text : "关闭",
        actions : [{
            action : "setup",
            text : "启动"
        },{
            action : "edit",
            text : "编辑"
        },{
            action : "pushInfo",
            text : "推送情况"
        }]
    },{
        val : 1,
        text : "启动",
        actions : [{
            action : "close",
            text : "关闭"
        },{
            action : "edit",
            text : "编辑"
        },{
            action : "pushInfo",
            text : "推送情况"
        }]
    },{
        val : 2,
        text : "完成",
        actions : [{
            action : "edit",
            text : "编辑"
        },{
            action : "pushInfo",
            text : "推送情况"
        }]
    }],

    //根据消息的状态值，得到对应的中文描述文字 
    getStatusText : function(val){
        var result = "";
        var msgStatus = this.msgStatus;
        for(var i=0,len=msgStatus.length; i<len; i++){
            var status = msgStatus[i];
            var sVal = status.val;
            var sText = status.text;
            if(sVal==val && typeof val!=="undefined"){
                result = sText;
                break;
            }
        }
        return result;
    },



    //根据消息类型的值，得到对应的中文描述文字 
    getMsgType : function(val){
        var result = "";
        var types = this.msgType;
        for(var i=0,len=types.length; i<len; i++){
            var type = types[i];
            var typeVal = type.val;
            var typeText = type.text;
            if(typeVal==val && typeof val!=="undefined"){
                result = typeText;
                break;
            }
        }
        return result;
    },

    //根据特定状态获取该状态下的消息能有什么操作
    getActionByStatus : function(status){
        var msgStatus = this.msgStatus;
        var actions = [];
        for(var i=0; i<msgStatus.length; i++){
            var st = msgStatus[i];
            var stVal = st.val;
            if(stVal==status && typeof status!=="undefined"){
                actions = st.actions;
                break;
            }
        }  
        return actions;
    },

    //获取渠道文字
    getChannelText : function(channelArr){
        var Channel = this.channel;
        var result = [];
        for(var i=0,len=channelArr.length; i<len; i++){
            var c = channelArr[i];
            if(Channel[c]) result.push(Channel[c]);
        }
        return result.join("、");
    },

    

    //后端接口地址
    url : {
        //获取消息列表
        msgList : "/r/MsgNotify_BatNotify/getPushTaskList/",
        //切换状态  开启/关闭
        taskStatus : "/r/MsgNotify_BatNotify/editTaskStatus/",
        //上传excel接口
        uploadExcel : "/r/Resource_FileUpload/upload/"
    },

    Fileupload : require("./Fileupload_Xhr2")


}
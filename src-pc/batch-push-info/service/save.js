module.exports = function(params,opt){
    opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

    return PFT.Util.Ajax("/r/MsgNotify_BatNotify/send",{
        type : "post",
        params : {
            title : params.title, //消息名称
            msg_type : params.msg_type,  //消息类型
            content : params.content,  //消息内容
            rec_type : params.rec_type,  //接收类型[系统自动0，指定会员1]
            channel : params.channel,  //推送渠道[短信1微信0]
            send_type : params.send_type, //推送类型[立即推送0，定时推送1，动态推送2]
            send_time : params.send_time, //发送时间[立即推送0，定时推送日期精确到分，动态推送单位天数]
            excel : params.excel, //保存excel
            save_type : params.save_type //保存类型  保存0，保存并执行1   //先写死
        },
        loading : function(){opt.loading()},
        complete : function(){opt.complete()},
        success : function(res){
            var code = res.code;
            var msg = res.msg || PFT.AJAX_ERROR_TEXT;
            var data = res.data;
            if(code==200){
                opt.success(data);
            }else{
                opt.fail(msg,code);
            }
        },
        timeout : function(){opt.timeout()},
        serverError : function(){opt.serverError()}
    })

}
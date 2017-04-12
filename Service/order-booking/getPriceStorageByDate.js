module.exports = function(params,opt){
    opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

    return PFT.Util.Ajax("/r/Book_Booking/getCalendarInfo/",{
        type : "post",
        params : {
            pids : params.pids,
            aid : params.aid,
            date : params.date
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
    });

}
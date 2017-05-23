module.exports = function(params,opt){
    opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

    var data = {
        pid : params.pid,
        aid : params.aid,
        date : params.date
    };
    if(params.fsid) data["fsid"] = params.fsid;

    return PFT.Util.Ajax("/r/Book_Booking/getShowInfo/",{
        type : "post",
        params : data,
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
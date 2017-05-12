module.exports = function(params,opt){
    opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);


    if(opt.debug){


        setTimeout(function(){
            opt.success({
                "58351" : {
                    js : "60",
                    ls : "80",
                    storage : 50
                },
                "58352" : {
                    js : "20",
                    ls : "50",
                    storage : 0
                },
            })
        },500)


        return false;
    }

    var data = {
        pid : params.pid,
        aid : params.aid,
        startDate : params.beginDate,
        endDate : params.endDate
    };
    if(params.fsid) data["fsid"] = params.fsid;

    return PFT.Util.Ajax("/r/Book_Booking/getPriAndStgForHotel/",{
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
    });

}
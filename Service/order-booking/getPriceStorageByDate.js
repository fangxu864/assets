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



    return PFT.Util.Ajax("/r/Book_Booking/getPriceAndStorage/",{
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
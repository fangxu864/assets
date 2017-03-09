
module.exports = function(params,opt){

    var xhr = PFT.Util.Ajax("/r/MicroPlat_Product/getCalendarPrice",{
        type : "post",
        params : {
            token : params.token,
            pid : params.pid,
            aid : params.aid,
            date : params.date
        },
        loading : opt.loading,
        complete : opt.complete,
        success : function(res){
            res = res || {};
            var code = res.code;
            var data = res.data;
            var msg = res.msg || PFT.AJAX_ERROR_TEXT;
            if(code==200){
                // if(data.length){
                    opt.success(data);
                // }else{
                    // opt.empty(data);
                // }
            }else{
                opt.fail(msg);	
            }
        }
    })

    return xhr

}


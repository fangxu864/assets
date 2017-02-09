
module.exports = function(params,opt){
    
    opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

    PFT.Util.Ajax("/r/MicroPlat_Product/getBookInfo",{
        type : "post",
        params : {
            token : params.token,
            aid : params.aid,
            pid : params.pid
        },
        loading : opt.loading,
        complete : opt.complete,
        success : function(res){
            res = res || {};
            var code = res.code;
            var data = res.data;
            var msg = res.msg || PFT.AJAX_ERROR_TEXT;
            if(code==200){
                if(data){
                    opt.success(data);
                }else{
                    opt.empty(data);
                }
            }else{
                opt.fail(msg);
            }
        }
    })
}
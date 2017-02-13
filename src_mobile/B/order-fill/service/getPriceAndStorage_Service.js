
module.exports = function(params,opt){

    PFT.Util.Ajax("/r/MicroPlat_Product/getPriceAndStorage",{
        type : "post",
        params : {
            token : params.token,
            aid : params.aid,
            date : params.date,
            pids : params.pids
        },
        loading : opt.loading,
        complete : opt.complete,
        success : function(res){
            res = res || {};
            var code = res.code;
            var data = res.data;
            var msg = res.msg || PFT.AJAX_ERROR_TEXT;
            if(code==200){
                opt.success(data);
            }else{
                opt.fail(msg);
            }
        }
    })
}
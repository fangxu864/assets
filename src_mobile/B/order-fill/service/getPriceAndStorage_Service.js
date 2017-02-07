
module.exports = function(params,opt){
    // var __DEBUG__ = true;
    // opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);
    // if(__DEBUG__){
    //     opt.loading();
    //     setTimeout(function(){
    //         opt.complete();
    //         opt.success(
    //             {"code":200,"data":{"11138":{"price":1.58,"store":0},"58052":{"price":0.12,"store":500}},"msg":""}
    //         )
    //     },100);

    //     return false;
    // }

    PFT.Util.Ajax("/r/MicroPlat_Product/getPriceAndStorage",{
        type : "post",
        params : {
            module_id : params.module_id,
            ptypeApp : params.ptypeApp,
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
}
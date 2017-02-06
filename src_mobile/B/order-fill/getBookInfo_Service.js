
module.exports = function(params,opt){
    // var __DEBUG__ = true;
    opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);
    // if(__DEBUG__){
    //     opt.loading();
    //     setTimeout(function(){
    //         opt.complete();
    //         opt.success(
    //             {
    //                 "code":200,
    //                 "data":{
    //                     "refund_rule":"0",
    //                     "refund_early_time":"0",
    //                     "reb":"50","reb_type":"0",
    //                     "cancel_cost":[],
    //                     "batch_check":"1",
    //                     "batch_day":"0",
    //                     "validTime":0,
    //                     "validType":"0",
    //                     "title":"（mm测试）江滨公园",
    //                     "p_type":"A",
    //                     "needID":"0",
    //                     "verifyTime":-1,
    //                     "tickets":[{"title":"成人票"},{"title":"阿萨德票"},{"title":"阿萨德票"},{"title":"阿萨德票"},{"title":"阿萨德票"}]},
    //                     "msg":""
    //             }
    //         )
    //     },100);

    //     return false;
    // }

    PFT.Util.Ajax("/r/MicroPlat_Product/getBookInfo",{
        type : "post",
        params : {
            token : PFT.Util.getToken(),
            aid : this.aid,
            pid : this.pid
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
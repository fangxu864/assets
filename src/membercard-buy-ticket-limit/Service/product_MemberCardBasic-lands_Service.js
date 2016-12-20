
module.exports = function(params,opt){

    opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);
    if(opt.__DEBUG__){
        opt.loading();
        setTimeout(function(){
            opt.complete();
            opt.success()
        },1000);

        return false;
    }

    PFT.Util.Ajax("/r/product_MemberCardBasic/Lands",{
        type : "post",
        params : {
            title : params.title,
        },
        loading : opt.loading,
        complete : opt.complete,
        success : function(res){
            res = res || {};
            var code = res.code;
            var data = res.data;
            var msg = res.msg || PFT.AJAX_ERROR_TEXT;
            if(code==200){
                if(data.total){
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
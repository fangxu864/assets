

module.exports = function(params,opt){

    PFT.Util.Ajax("/r/MicroPlat_Member/updateLinkman",{
        type : "post",
        params : {
            token : params.token,
            ordername : params.ordername,
            ordertel : params.ordertel,
            idcard : params.idcard,
            type : params.type
        },
        loading : opt.loading,
        complete : opt.complete,
        success : function(res){
            res = res || {};
            var code = res.code;
            var data = res.data;
            var msg = res.msg || PFT.AJAX_ERROR_TEXT;
            if(code==200 || code==201){
                opt.success(res);
            }else{
                opt.fail(msg);
            }
        }
    })
}


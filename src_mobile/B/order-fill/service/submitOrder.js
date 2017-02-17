
module.exports = function(params,opt){

    PFT.Util.Ajax("/r/MicroPlat_Order/order/",{
        type : "post",
        params : {
            token : params.token,
            pid : params.pid,
            aid : params.aid,
            tnum : params.tnum,
            begintime : params.begintime,
            contacttel : params.contacttel,
            ordername : params.ordername,
            paymode : params.paymode,
            idcards : params.idcards, 
            tourists : params.tourists,
            zoneid : params.zoneid,
            roundid : params.roundid,
            venusid : params.venusid,
            link : params.link

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
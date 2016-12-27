/**
 * Created by Administrator on 2016/12/6.
 */
module.exports = function (params,opt) {
    PFT.Util.Ajax("/r/Notice_Notice/setNoticeStatus",{
        type : "post",
        params : {
            nid : params.nid,
            status : params.status
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
};
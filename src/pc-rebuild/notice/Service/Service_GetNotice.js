/**
 * Created by Administrator on 2016/12/6.
 */
module.exports = function (params,opt) {
    PFT.Util.Ajax("/r/Notice_Notice/getNoticeList",{
        type : "post",
        params : {
            page : params.page || "",
            size : params.size || "",
            // allPage : params.allPage || "",
            state : params.state,
            action : params.action
        },
        loading : opt.loading,
        complete : opt.complete,
        success : function(res){
            res = res || {};
            var code = res.code;
            var data = res.data;
            var msg = res.msg || PFT.AJAX_ERROR_TEXT;
            if(code==200){
                if(data.length){
                    opt.success(data);
                }else{
                    opt.empty(data);
                }
            }else{
                opt.fail(msg);
            }
        }
    })
};
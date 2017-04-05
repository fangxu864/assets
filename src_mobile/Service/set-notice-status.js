/**
 * Author: ZhengJiashen
 * Date: 2016/12/6
 * Description: 修改系统通知状态  /r/Notice_Notice/setNoticeStatus
 * params : {
 * 		nid : "",       要操作对象的ID数组
 * 		status : "",    1已读 2删除
 * }
 */
module.exports = function(params,opt){

    opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

    if(__DEBUG__){
        opt.loading();
        setTimeout(function(){
            opt.complete();
            opt.success("fakeData")
        },1000);

        return false;
    }

    PFT.Util.Ajax("/r/Notice_Notice/setNoticeStatus",{
        type : "post",
        params : {
            pid : params.pid,
            aid : params.aid,
            date : params.date,
            token : PFT.Util.getToken()
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
}
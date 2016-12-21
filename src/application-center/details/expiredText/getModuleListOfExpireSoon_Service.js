/**
 * Created by Administrator on 2016/12/21.
 */

module.exports = function(params,opt){
    var __DEBUG__ = false;
    opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);
    if(__DEBUG__){
        opt.loading();
        setTimeout(function(){
            opt.complete();
            opt.success({
                "code":200,
                "data":[
                    {
                        "name":"微商城",//快过期的模块名称
                        "expire_time":"2016年12月16日"//过期时间
                    },
                    {
                        "name":"测试2",
                        "expire_time":"2017年01月12日"
                    }
                ],
                "msg":"查询成功"
            })
        },100);

        return false;
    }

    PFT.Util.Ajax("/r/AppCenter_ModuleList/getModuleListOfExpireSoon",{
        type : "post",
        params : {},
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
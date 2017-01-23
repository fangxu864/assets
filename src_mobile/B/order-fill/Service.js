
module.exports = function(params,opt){
    var __DEBUG__ = true;
    opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);
    if(__DEBUG__){
        opt.loading();
        setTimeout(function(){
            opt.complete();
            opt.success(
                {
                    "code": 200,
                    "data": {
                        "payWay": {
                            "ali": 0,  // 支付宝   [1可用 0不可用]
                            "wx": 1,   // 微信支付 [1可用 0不可用]
                            "uni": 1   // 银联     [1可用 0不可用]
                        },
                        "detail": {
                            "pid": "11138",
                            "ptype": "A",
                            "landTitle": "（mm测试）江滨公园",
                            "totalmoney": 0.06,
                            "ordername": "联系人",
                            "ordertel": "13405556666",
                            "tickets": [
                                {
                                    "title": "成人票",
                                    "num": "2"
                                }
                            ],
                            "extra": {
                                "date": "2017-01-31~2017-01-31"
                            }
                        },
                        "payParams": {
                            "subject": "（mm测试）江滨公园成人票",
                            "expireTime": "120",
                            "outTradeNo": 4002978,
                            "buyId": "3385",
                            "domain": "http://123624.12301.local/",
                            "appid": ""
                        },
                        "ptype": "A"
                    },
                    "msg": ""
                }
            )
        },100);

        return false;
    }

    PFT.Util.Ajax("/r/AppCenter_ModuleDetail/getAppDetail",{
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
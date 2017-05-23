module.exports = {
    AJAX_TYPE : "post",
    AJAX_TIMEOUT : 10 * 1000,
    Api : {
        getCityCodeForOrder : function(){
            return "/r/product_Product/getCityCodeForOrder/";
        },
        getThemeForOrder : function(){
            return "/r/product_Product/getThemeForOrder/";
        },
        getProListForOrder : function(){
            return "/r/product_Product/getProListForOrder/";
        },
        realTimePrice : function(){
            return "/r/product_Product/realTimePrice/";
        },
        //年卡类型产品 - 获取虚拟卡数量
        getVirtualStorage : function(){
            return "/r/product_AnnualCard/getVirtualStorage/";
        }
    },
    getFsid : function(){
        var fixDisSwitchor = $("#fixDisSwitchor");
        if(!fixDisSwitchor.length) return false;
        return fixDisSwitchor.attr("data-id");
    },
    getFsaccount : function(){
        var fixDisSwitchor = $("#fixDisSwitchor");
        if(!fixDisSwitchor.length) return false;
        return fixDisSwitchor.attr("data-account");
    },
    getFsname : function(){
        var fixDisSwitchor = $("#fixDisSwitchor");
        if(!fixDisSwitchor.length) return false;
        return fixDisSwitchor.attr("data-name");
    },
    fetch : function(params,opt){
        opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

        // var Ajax = require("COMMON/js/util.ajax.js");
        var Ajax = PFT.Util.Ajax;

        Ajax(this.Api.getProListForOrder(),{
            type : "get",
            ttimeout : 10 * 1000,
            params : params,
            loading : function(){
                opt.loading();
            },
            complete : function(){
                opt.complete();
            },
            success : function(res){
                var code = res.code;
                var msg = res.msg || PFT.AJAX_ERROR_TEXT;
                var data = res.data;
                var lands = data.lands;
                var Util = PFT.Util;
                var isEmptyObject = Util.isEmptyObject;
                var isArray = Util.isArray;
                var isObject = Util.isObject;
                if(code==200){
                    if(isObject(lands) && isEmptyObject(lands)){
                        opt.empty(data);
                    }else if(isArray(lands) && lands.length==0){
                        opt.empty(data);
                    }else{
                        opt.success(data);
                    }
                }else{
                    opt.fail(msg,code);
                }
            },
            timeout : function(){opt.timeout()},
            serverError : function(){
                opt.serverError();
            }
        })


    }
}
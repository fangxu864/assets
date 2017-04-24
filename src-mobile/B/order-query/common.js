var Alert = require("COMMON/Components/Alert-Mobile/v1.0");

//各模块公用的方法、配置、api接口地址  都定义在这里
module.exports = { 
    pageSize : 10,
    ajaxType : "post",
    ttimeout : 10 * 1000, //超时时间
    serverError : function(xhr,errorText){
        if(errorText=="timeout"){
            Alert(errorText+": "+PFT.AJAX_TIMEOUT_TEXT);
        }else{
            Alert(errorText+": "+PFT.AJAX_ERROR_TEXT);
        }
    },
    api : {
        list : "/r/MicroPlat_Order/orderQuery/",
    },
    isObject : function(obj){
        return Object.prototype.toString.call(obj)==="[object Object]";
    },
    isArray : function(arr){
        return Object.prototype.toString.call(arr)==="[object Array]";
    },
    forEach : function(objOrArr,fn,cxt){
        var Util = PFT.Util;
        fn = typeof fn==="function" ? fn : function(){};
        cxt = cxt || this;
        if(this.isObject(objOrArr)){
            for(var i in objOrArr){
                var res = fn.call(cxt,objOrArr[i],i);
                if(res===false) break;
            }
        }else if(this.isArray(objOrArr)){
            for(var i=0,len=objOrArr.length; i<len; i++){
                var res = fn.call(cxt,objOrArr[i],i);
                if(res===false) break;
            }
        }
    },
    getToken : function(){
        var token = $.trim($("#csrf_token"));
        return token || "";
    },
    getObjectKeyCount : function(obj){
        if(!PFT.Util.isObject(obj)) return null;
        var count = 0;
        for(var i in obj) count += 1;
        return count;
    }
}
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
        if(this.isArray(obj)) return obj.length;
        if(!this.isObject(obj)) return null;
        var count = 0;
        for(var i in obj) count += 1;
        return count;
    },
    getLoadingHtml : function(text,opt){
        text = text || "请稍后...";
        opt = opt || {}
        var tag = opt.tag || "div";
        if(tag=="td") tag = "tr";
        var width = opt.width ? (opt.width+"px") : "100%";
        var height = opt.height || 150;
        var loadingImg = opt.loadingImg || {};
        var imgWidth = loadingImg.width || 24;
        var top = loadingImg.top || 0;
        var className = opt.className || "";
        var td_colspan = opt.colspan || 1;
        var id = opt.id || "";
        var html = "";
        var css = opt.css || {};
        var style = "";
        for(var i in css) style += i+":"+css[i]+"; ";
        var imgSrc = '//static.12301.cc/assets/build/images/gloading.gif';
        html += '<'+tag+' id="'+id+'" style="width:'+width+'; height:'+height+'px; line-height:'+height+'px; text-align:center; '+style+'" class="'+className+'">';
        if(tag=="tr"||tag=="td") html += '<td style="text-align:center" colspan="'+td_colspan+'">';
        html += 	'<img style="width:'+imgWidth+'px; position:relative; top:'+top+'px; vertical-align:middle; margin-right:5px" src="'+imgSrc+'"/>';
        html +=     '<span class="t">'+text+'</span>';
        if(tag=="tr"||tag=="td") html += '</td>';
        html += '</'+tag+'>';
        return html;
    }
}
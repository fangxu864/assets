var Alert = require("COMMON/Components/Alert-Mobile/v1.0");

//各模块公用的方法、配置、api接口地址  都定义在这里
module.exports = { 
    pageSize : 5,
    ajaxType : "post",
    ttimeout : 10 * 1000, //超时时间
    paymode : { //支付方式,0余额，1在线，2授信，3自供自销，4现场支付
        0 : "余额支付",
        1 : "在线支付",
        2 : "授信支付",
        3 : "自供自销",
        4 : "现场支付",
        9 : "现金支付"
    },
    dateType_Text : { //按日期搜索时，日期值对应的文字
         0 : "下单时间",
         1 : "预计游玩时间",
         2 : "验证时间"
    },
    tabItem : [{
        status : "-1",
        text : "全部"
    },{
        status : "0",
        text : "未验证"
    },{
        status : "7",
        text : "部分验证"
    },{
        status : "1",
        text : "已验证"
    },{
        status : "3",
        text : "已取消"
    },{
        status : "2",
        text : "已过期"
    }],
    statusText : {
        0 : {
			name : "未使用",
			color:"#3eba40"
		},
		1 : {
			name : "已使用",
			color:"#f37138"
		},
		2 : {
			name : "已过期",
			color:"#e12424"
		},
		3 : {
			name : "已取消",
			color:"#f37138"
		},
		4 : {
			name : "凭证码被替代",
			color:"#f37138"
		},
		5 : {
			name : "被终端撤销(已取消)",
			color:"#f37138"
		},
		6 : {
			name : "被终端撤销(已使用)",
			color:"#f37138"
		},
		7 : {
			name : "已部分使用",
			color:"#f37138"
		},
		9 : {
			name : "已删除",
			color:"#f37138"
		},
		101 : {
			name : "退票中",
			color : "#e12424"
		}
    },
    serverError : function(xhr,errorText){
        if(errorText=="timeout"){
            Alert(errorText+": "+PFT.AJAX_TIMEOUT_TEXT);
        }else{
            Alert(errorText+": "+PFT.AJAX_ERROR_TEXT);
        }
    },
    api : {
        list : "/r/MicroPlat_Order/orderQuery/",
        orderDetail:"/r/MicroPlat_Order/orderDetail",
        operatingRecord:"/r/MicroPlat_Order/operatingRecord"
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
        var token = $.trim($("#csrf_token").val());
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
    },
    clone : function(obj,deep){
        if(obj==null || typeof obj!=="object") return obj;  //过滤掉null、function 、基本类型变量  剩下Array Object
        var isArray = this.isArray;
        var isObject = this.isObject;
        var clone = function(obj,deep){
            var result = {}, value;
            for(var name in obj){
                value = obj[name];

                if(value===obj) continue;

                if((isArray(value) || isObject(value)) && deep){
                    result[name] = clone(value,deep)
                }else{
                    result[name] = obj[name];
                }
            }
            return result;
        };

        return clone(obj,deep);

    },
    //所有的操作都需要登录后才能操作，如果后端返回102，就是未登录或登录状态过期
    //前端在这里统一处理这种情况
    unLogin : function(){
        winodw.location.href = "login.html";
    }
}
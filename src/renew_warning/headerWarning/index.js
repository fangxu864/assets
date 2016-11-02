/**
 * Created by Administrator on 2016/10/28.
 */
//引入modules
var LoopTip=require("./loopTip");
var Dialog=require("./dialog/dialog.js");
//引入tpl
var loopTip_tpl=require("./loopTip/loopTip.xtpl");


var HeaderWarning={
    init:function () {
        var _this=this;
        var value_of_overTime=$("#value_of_overTime").val();  //-1(已过期),0(临近过期),1未过期
        // var value_of_overTime=0;  //-1(已过期),0(临近过期),1未过期
        var isloopTip=value_of_overTime=="-1"||value_of_overTime=="0"?true:false;
        var isDialog=true;
        if(isloopTip){
            _this.loopTip();
        }
        if(isDialog){
            // _this.removeCookie("isDialog");
            if(value_of_overTime=="0"){
                var isDialog_cookie=_this.getCookie("isDialog");
                if(isDialog_cookie=="false") return false;
                _this.setCookie("isDialog",false,1000*60*60*12)
            }
            _this.dialog=new Dialog;
            _this.dialog.open();
            _this.dialog.show_dialog_con(_this.dialogCon[value_of_overTime]);
        }
    },
    loopTip:function () {
        if ($("#siteLocationBar .subnav").length>0){
            $("#siteLocationBar .subnav").eq(0).css("position","relative").append(loopTip_tpl)
                .find(".loop_box").css({"top":"-13px"})
                .find(".xufei_box").css("padding-top","0px")
        }else if($("#special_w").length>0){
            $("#special_w .subnav").eq(0).css("position","relative").append(loopTip_tpl);
        }else if($("#siteLocationBar .siteLocationBarCon").length>0){
            $("#siteLocationBar .siteLocationBarCon").eq(0).css("position","relative").append(loopTip_tpl)
                .find(".loop_box").css({"top":"-2px"})
                .find(".xufei_box").css("padding-top","0px")
        }

        var loop_tip=new LoopTip({
            "container":$("#loopTip_box"),
            "content":"您好，您的票付通账户将于2016年11月11日到期，为避免影响您的正常使用，请提前续费或联系客服。（电话：18065144515）"
        });
    },
    dialogCon:{
        "-1":{
            "title":"账户已到期！",
            "content":" 您好，您的票付通账户已到期，系统将于2016年12月01日起对到期账户进行功能使用限制，为避免影响您的正常使用，请尽快续费或联系客服。（电话：18065144515   QQ：2853986222）",
            "isBtn_close":false
        },
        "0":{
            "title":"账户即将到期！",
            "content":" 您好，您的票付通账户将于2016年11月11日到期，为避免影响您的正常使用，请提前续费或联系客服。（电话：18065144515）",
            "isBtn_close":true
        }
    },
    //处理cookie的函数
    setCookie:function (name, value, time) {
        var oDate=new Date();
        oDate.setTime(oDate.getTime()+time);
        document.cookie=name+'='+encodeURIComponent(value)+';expires='+oDate.toUTCString();
    },
    getCookie:function (name) {
        var arr=document.cookie.split('; ');
        var i=0;
        for(i=0;i<arr.length;i++)
        {
            //arr2->['username', 'abc']
            var arr2=arr[i].split('=');

            if(arr2[0]==name)
            {
                var getC = decodeURIComponent(arr2[1]);
                return getC;
            }
        }

        return '';
    },
    removeCookie:function (name) {
        this.setCookie(name, '1', -1);
    }
};


$(function () {
    HeaderWarning.init()
});


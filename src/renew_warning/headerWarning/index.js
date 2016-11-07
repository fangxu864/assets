/**
 * Created by Administrator on 2016/10/28.
 */
//引入modules
var LoopTip=require("./loopTip");
var Dialog=require("./dialog/dialog.js");

var ParseTemplate=require("COMMON/js/util.parseTemplate.js");
//引入tpl
var loopTip_tpl=require("./loopTip/loopTip.xtpl");
loopTip_tpl=ParseTemplate(loopTip_tpl)({data:{"host":location.host}});


var HeaderWarning={
    init:function () {
        var _this=this;
        var judge_of_overTime=$("#judge_of_overTime").val();  //-1(已过期),0(临近过期),1未过期
        this.judge_of_overTime=judge_of_overTime;
        var judge_of_dtype=$("#judge_of_dtype").val();  //6会员
        // var judge_of_overTime=0;  //-1(已过期),0(临近过期),1未过期
        // var isloopTip=judge_of_overTime=="-1"||judge_of_overTime=="0"?true:false;
        // var isloopTip=judge_of_overTime=="0"||judge_of_dtype=="6"?true:false;
        var isloopTip=true;   //过渡期
        var isDialog=judge_of_dtype=="6"?false:true;
        if(isloopTip){
            _this.loopTip();
        }
        if(isDialog){
            // _this.removeCookie("isDialog");
            // if(judge_of_overTime=="0"){                   //
            if(judge_of_overTime=="0"||judge_of_overTime=="-1"){         //过渡期
                var isDialog_cookie=_this.getCookie("isDialog");
                if(isDialog_cookie=="false") return false;
                _this.setCookie("isDialog",false,1000*60*60*12)
            }
            _this.dialog=new Dialog;
            _this.dialog.open();
            _this.dialog.show_dialog_con(_this.dialogCon[judge_of_overTime]);
        }
    },
    loopTip:function () {
        var _this=this;
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
            "content":_this.loopTipCon[_this.judge_of_overTime]
        });
    },
    dialogCon:{
        "-1":{
            "title":"账户已到期！",
            "content":" 您好，您的票付通账户已到期，系统将于2016年12月01日起对到期账户进行功能使用限制，为避免影响您的正常使用，请尽快续费或联系客服。（电话：18065144515   QQ：2853986222）",
            // "isBtn_close":false
            "isBtn_close":true    //过渡期
        },
        "0":{
            "title":"账户即将到期！",
            "content":" 您好，您的票付通账户将于"+$("#value_of_overTime").val()+"到期，为避免影响您的正常使用，请提前续费或联系客服。（电话：18065144515）",
            "isBtn_close":true
        }
    },
    loopTipCon:{
        "0":"您好，您的票付通账户将于"+$("#value_of_overTime").val()+"到期，为避免影响您的正常使用，请提前续费或联系客服。（电话：18065144515）",
        "-1":" 您好，您的票付通账户已到期，系统将于2016年12月01日起对到期账户进行功能使用限制，为避免影响您的正常使用，请尽快续费或联系客服。（电话：18065144515   QQ：2853986222）"
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


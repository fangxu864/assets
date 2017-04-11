require("./index.scss");
var Tpl=require("./tpl/index.xtpl");
var Service=require("./service-success.js");
var Alert=PFT.Mobile.Alert;
var Toast=new PFT.Mobile.Toast();
var Main=PFT.Util.Class({
    container:"#bodyContainer",
    init: function(){
        this.ordernum=$("#ordernumHidInp").val() || "";
        var paymode= this.paymode=$("#paymodeHidInp").val() || "";
        //console.log(this.paymode)
        document.title=this.paymode==1? "支付成功":"下单成功";
        Service(this.ordernum,{
            loading:function(){
                Toast.show("loading","努力加载中...");
            },
            complete:function(){
                Toast.hide("loading","努力加载中...");
            },
            success:function(data){
                var host=PFT.Util.UrlParse()["h"];
                var search=window.location.host;
                var render=PFT.Util.ParseTemplate(Tpl);
                data["paymode"]=paymode;
                data["h"]=host;
                if(search.indexOf("local")>-1){
                    com="12301.local";
                }else if(search.indexOf("test")>-1){
                    com="12301.test";
                }else if(search.indexOf("dev.com")>-1){
                    com="12301dev.com";
                }else{
                    com="12301.cc";
                }
                data["url"]=com;
                var html=render({data:data});
               // console.log(data)
                $("#bodyContainer").html(html);
            },
            fail:function(msg){
                Alert(msg);
            }
        })
    }
});

$(function(){
    new Main();
})
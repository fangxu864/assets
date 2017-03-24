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
                data["paymode"]=paymode;
                var render=PFT.Util.ParseTemplate(Tpl);
                var html=render({data:data});
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
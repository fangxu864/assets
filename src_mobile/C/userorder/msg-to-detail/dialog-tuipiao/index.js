
/**
 * Created by Administrator on 2016/11/10.
 */
//引入tpl
var dialog_tuipiao_tpl=require("./dialog-tuipiao.xtpl");
//引入css
require("./index.scss");

var Dialog_tuipiao=PFT.Util.Class({
    container : "#dialog_box",
    EVENTS : {
        "click #dialog_tuipiao .mask" : "close",
        "click #dialog_tuipiao .dialog_con .line .btn_no" : "close",
        "click #dialog_tuipiao .dialog_con .line .btn_yes" : "onBtnYesClick",
        "click #dialog_tuipiao .dialog_con .line .btn_sendCode" : "onBtnSendCodeClick"
    },
    init : function(opt){
        var _this=this;
        $("#dialog_box").append(dialog_tuipiao_tpl);
    },
    open:function (ordernum) {
        var Con=$(this.container.selector);
        Con.find(".dialog_con").animate({"bottom":0+"px"},500,"swing");
        // Con.find(".mask").fadeTo("slow",0.5);
        Con.find(".mask").addClass("open");
        // this.ajaxGetVcode(ordernum);
        this.OrderNum=ordernum;
    },
    close:function () {
        var Con=$(this.container.selector);
        Con.find(".dialog_con").animate({"bottom":-200+"px"},500,"swing");
        // Con.find(".mask").fadeOut(500);
        Con.find(".mask").removeClass("open");
        Con.find("#dialog_tuipiao .dialog_con .line4").html("")
    },
    onBtnSendCodeClick:function (e) {
        var tarBtn=$(e.currentTarget);
        if(tarBtn.hasClass("disabled")) return false;
        this.ajaxGetVcode(tarBtn,this.OrderNum);
    },
    onBtnYesClick:function (e) {
        var _this=this;
        var Con=$(this.container.selector);
        var vcode=Con.find("input.vcode").val();
        var re=/^\d{6}$/;
        if(!re.test(vcode)){
            Con.find("#dialog_tuipiao .dialog_con .line4").html('<span class="tip_error">*请输入正确的6位数字验证码...</span>');
            return false
        }
        var orderNum=this.OrderNum;
        if(orderNum==""){
            PFT.Mobile.Alert("订单号不存在！");
            return false
        }
        $.ajax({
            url: "/api/index.php?c=Mall_Member&a=cancelOrderBySms",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: { //参数值
                "ordernum": orderNum ,
                "vcode":vcode,
                "token" : PFT.Util.getToken()
            },
            type: "post",   //请求方式
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                //请求成功时处理
                if(res.code==200){
                    PFT.Mobile.Alert("退票成功！");
                    Con.find("#dialog_tuipiao .dialog_con .line4").html('<span class="tip_success">*退票成功</span>');
                    _this.close();
                    window.location.reload();
                }else{
                    Con.find("#dialog_tuipiao .dialog_con .line4").html('<span class="tip_error">*'+res.msg+'</span>')
                }
            },
            complete: function() {
                //请求完成的处理
            },
            error: function() {
                //请求出错处理
            }
        });
    },
    OrderNum:"",
    //获取验证码
    ajaxGetVcode:function (tarBtn,ordernum) {
        var _this=$(this.container.selector);
        $.ajax({
            url: "/api/index.php?c=Mall_Member&a=sendVcodeForCancleOrder",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: { //参数值
                "ordernum": ordernum ,
                "token" : PFT.Util.getToken()
            },
            type: "post",   //请求方式
            beforeSend: function() {
                //请求前的处理
                var num=60;
                tarBtn.addClass("disabled").text(num+"s后重发");
                clearInterval(timer);
                var timer=setInterval(function () {
                    if(num>0){
                        num--;
                        tarBtn.text(num+"s后重发")
                    }else{
                        clearInterval(timer);
                        tarBtn.removeClass("disabled").text("重新发送");
                    }
                },1000)
            },
            success: function(res) {
                //请求成功时处理
                if(res.code==200){
                    _this.find("#dialog_tuipiao .dialog_con .line4").html('<span class="tip_success">*验证码已发送</span>');
                }else{
                    _this.find("#dialog_tuipiao .dialog_con .line4").html('<span class="tip_error">*'+res.msg+'</span>')
                }
            },
            complete: function() {
                //请求完成的处理
            },
            error: function() {
                //请求出错处理
            }
        });
        
    }
});


module.exports=Dialog_tuipiao;
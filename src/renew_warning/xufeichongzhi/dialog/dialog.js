/**
 * Created by Administrator on 2016/10/28.
 */

//引入css
require("./dialog.scss");
//引入tpl
var dialog_con_tpl=require("./dialog_con.xtpl");
var dialog_querying_tpl=require("./dialog_querying.xtpl");
var querySuccess_tpl=require("../tpl/querySuccess.xtpl");
//引入插件
var DialogSimple=require("COMMON/modules/dialog-simple");

function Dialog(){
    var _this=this;
    this.Dialog_simple=new DialogSimple({
        width : 500,
        height : 500,
        closeBtn : true,
        content : "<div id='dialog_box'></div>",
        drag : true,
        speed : 200,
        offsetX : 0,
        offsetY : 0,
        overlay : true,
        headerHeightMin : 46,
        events : {
            "click .btn_close":function () {
                _this.Dialog_simple.close()
            }
        },
        onCloseAfter : function () {
            _this.setInterval_own.clear()
        }
    });
    this.Dialog_box=$("#dialog_box")
}
Dialog.prototype={
    open:function () {
        this.Dialog_simple.open()
    },
    close:function () {
        this.Dialog_simple.close();
    },
    show_dialog_con:function (data) {
        var list=data;
        var _this=this;
        var html=_this.template({data:list});
        this.Dialog_box.html(html);
        this.open();
        _this.ajaxGetVcode(list)
    },
    template:PFT.Util.ParseTemplate(dialog_con_tpl),
    ajaxGetVcode:function (data) {
        var _this=this;
        $.ajax({
            url: data.url,    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: { "meal": data.typeid },    //参数值
            type: "post",   //请求方式
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                //请求成功时处理
                if(res.code==200){
                    $("#payCode_box").html("");
                    new QRCode("payCode_box",{
                        text:res.data.qrUrl,
                        width:200,
                        height:200,
                        colorDark:"#000000",
                        colorLight:"#ffffff",
                        correctLevel:QRCode.CorrectLevel.H
                    });
                    _this.setInterval_own.clear();
                    _this.setInterval_own.count(_this.ajaxLoop , res.data.outTradeNo , _this , 1000);
                }else{
                    alert(res.msg)
                }
            },
            complete: function() {
            },
            error: function() {
                //请求出错处理
            }
        });
    },
    ajaxLoop:function (data) {
        var _this=this;
        $.ajax({
            url: "/r/Member_Renew/isRenewComplete",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: { "outTradeNo": data },    //参数值
            type: "post",   //请求方式
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                //请求成功时处理
                if(res.code==200){
                    if(res.data.payStatus==1) {
                        _this.setInterval_own.clear();
                        // $("#payCode_box").html("");
                        _this.close();
                        $(".con_box").hide();
                        $(".queryState_box").html(querySuccess_tpl);
                    }
                }
            },
            complete: function() {
            },
            error: function() {
                //请求出错处理
            }
        });
    },
    //自定义的setInterval
    setInterval_own:{
        timer:-1,
        count:function(func,data,that,time){
            var _this=this;
            _this.clear();
            this.timer=setTimeout(function () {
                func.call(that,data);
                _this.count(func,data,that,time)
            },time);
        },
        clear:function () {
            var _this=this;
            clearTimeout(_this.timer)
        }
    }
};

module.exports=Dialog;
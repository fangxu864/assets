/**
 * Created by Administrator on 2016/10/28.
 */

//引入css
require("./dialog.scss");
//引入tpl
var dialog_con_tpl=require("./dialog_con.xtpl");
var dialog_querying_tpl=require("./dialog_querying.xtpl");
//引入插件
var DialogSimple=require("COMMON/modules/dialog-simple");
var ParseTemplate = require("COMMON/js/util.parseTemplate.js");

function Dialog(){
    var _this=this;
    this.Dialog_simple=new DialogSimple({
        width : 500,
        closeBtn : false,
        content : "",
        drag : true,
        speed : 200,
        offsetX : 0,
        offsetY : 0,
        overlay : true,
        headerHeightMin : 46,
        events : {
            "click .btn_close" : function () {
                _this.Dialog_simple.close()
            },
            "click .btn_ok" : function () {
                _this.Dialog_simple.close();
                window.location.reload();
            }
        },
        onCloseAfter : function () {
            clearTimeout(_this.loopAjaxTimer);
        }
    });

    this.Dialog_box = this.Dialog_simple.container.find(".gSimpleDialog-content")
}

Dialog.prototype={

    /**
     * @method 弹框的打开
     */
    open:function () {
        this.Dialog_simple.open()
    },


    /**
     * @method 弹框的关闭
     */
    close:function () {
        this.Dialog_simple.close();
    },


    /**
     * @method 弹框的渲染、打开
     * @param data
     */
    show_dialog_con:function (data) {
        var list=data;
        var _this=this;
        var html=_this.template({data:list});
        this.Dialog_box.html(html);
        this.open();
        _this.ajaxGetVcode(list)
    },


    /**
     * @method 微信和支付宝支付时弹框内容模板
     */
    template: ParseTemplate(dialog_con_tpl),


    /**
     * @method 获取微信或支付宝二维码
     * @param data
     */
    ajaxGetVcode:function (data) {
        var _this=this;
        $.ajax({
            url: data.url,    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "out_trade_no": location.href.match(/ordernum\=(\d+)/)[1] ,
                "is_qr" : 1 ,
                "subject": $("#pNameText").text(),
                "pay_type":2

            },    //参数值
            type: "post",   //请求方式
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                //请求成功时处理
                if(res.code==200){
                    var payCodeBox = $("#payCode_box");
                    payCodeBox.html("");
                    new QRCode("payCode_box",{
                        text:res.data.qrUrl,
                        width:200,
                        height:200,
                        colorDark:"#000000",
                        colorLight:"#ffffff",
                        correctLevel:QRCode.CorrectLevel.H,
                        src : "//staticfile.12301.cc/weixinpay.png"
                    });
                    //二维码中间增加微信小图标
                    payCodeBox.append("<div class='center-img-wx'></div>");
                    _this.ajaxLoop( res.data.outTradeNo , 15000);
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


    /**
     * @method 微信和支付宝支付时的轮询
     * @param ordernum 交易订单流水号
     * @param time 请求的间隔时间
     */
    ajaxLoop:function (ordernum , time) {
        var _this=this;
        _this.loopAjaxTimer = setTimeout(function () {
            $.ajax({
                url: "http://" + _this.getHost() + "/r/pay_MobilePay/payResultCheck/",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                data: {  //参数值
                    "ordernum": ordernum ,
                    "pay_scen": 1
                },
                type: "post",   //请求方式
                beforeSend: function() {
                    //请求前的处理
                },
                success: function(res) {
                    //请求成功时处理
                    if(res.code == 200){
                        $("#payCode_box").html('<div class="payOk">支付成功！</div>');
                        _this.Dialog_box.find(".dialog_con .line.line5").html('<span class="btn btn_ok">确认</span>')
                    }else if(res.code == 400){
                        _this.ajaxLoop(ordernum ,3000);
                    }
                },
                complete: function() {
                },
                error: function() {
                    //请求出错处理
                }
            });
        },time)
    },


    /**
     * @method 获取host
     */
    getHost: function () {
        var host = {
            "12301.test" : "www.12301.test",
            "12301dev.com" : "www.12301dev.com",
            "12301.cc" : location.host
        };
        for( var key in host ){
            if( location.host.search(key) > -1 ){
                return host[key];
            }
        }
    }
};

module.exports=Dialog;
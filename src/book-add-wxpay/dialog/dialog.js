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
        closeBtn : true,
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
            }
        },
        onCloseAfter : function () {
            _this.setInterval_own.clear()
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
                "subject": $("#pNameText").text()

            },    //参数值
            type: "post",   //请求方式
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                //请求成功时处理
                if(res.status == "ok"){
                    $("#payCode_box").html("");
                    new QRCode("payCode_box",{
                        text:res.data,
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


    /**
     * @method 微信和支付宝支付时的轮询
     * @param data
     */
    ajaxLoop:function (data) {
        var _this=this;
        $.ajax({
            url: "/call/jh_prod.php",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "action" : "CheckOrderPay" ,
                "orderid": location.href.match(/ordernum\=(\d+)/)[1]
            },    //参数值
            type: "get",   //请求方式
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                //请求成功时处理
                if(res == 1 ){
                    _this.setInterval_own.clear();
                    alert("支付成功！");
                    window.location.reload();
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
     * @method 自定义的setInterval函数
     */
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
/**
 * Created by fangxu  on 2016/10/26.
 */

//引入tpl
//引入modules
var DialogS=require("./dialog/dialog.js");
//jq的订阅发布
require("./jqPubSub.js");


var Recharge={

    /**
     * @function  init
     */
    init:function(){
        var _this=this;
        //初始化模块
        this.Dialoga=new DialogS;
        this.bind();
    },

    /**
     * @function 事件绑定
     */
    bind:function () {
        var _this=this;
        //支付类型
        //微信
        $.subscribe("onWxPay",function () {
            _this.Dialoga.show_dialog_con({
                "url": "http://" + location.host + "/r/pay_MobilePay/order/",
                "title":"微信二维码支付",
                "account":"票付通",
                "money": $(".totalPay .orange").text().match(/[\d\.]+/)[0]
            });
        });
        // //重新登录
        // $("body").on("click",".btn_login_renew",function () {
        //     $("#siteLogoutBtn").click();
        // })
    },

};
$(function(){
    Recharge.init()
});








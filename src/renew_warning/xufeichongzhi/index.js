/**
 * Created by fangxu  on 2016/10/26.
 */

//引入css
require("./index.scss");
//引入tpl
var querying_tpl=require("./tpl/querying.xtpl");
var querySuccess_tpl=require("./tpl/querySuccess.xtpl");
var queryFail_tpl=require("./tpl/queryFail.xtpl");
var packageType_tpl=require("./tpl/packageType.xtpl");
//引入modules
var DialogS=require("./dialog/dialog.js");



var Recharge={
    init:function(){
        var _this=this;
        //获取盒子
        this.queryState_box=$(".queryState_box");
        this.con_box=$(".con_box");
        //初始化模块
        this.Dialoga=new DialogS;
        this.bind();
        _this.ajaxGetData()
    },
    bind:function () {
        var _this=this;
        //套餐类型
        $(".con_box").on("click",".package_type",function () {
            $(".package_type").removeClass("active");
            $(this).addClass("active")
        });
        //支付类型
        //微信
        $(".wx_pay").on("click",function () {
            _this.Dialoga.show_dialog_con({
                "url":"/r/pay_WxPay/renew/",
                "title":"微信二维码支付",
                "account":"票付通",
                "money":$(".package_type.active").attr("money"),
                "typeid":$(".package_type.active").attr("typeid")
            });
        });
        //支付宝
        $(".ali_pay").on("click",function () {
            _this.Dialoga.show_dialog_con({
                "url":"/r/pay_Alipay/renew/",
                "title":"支付宝二维码支付",
                "account":"票付通",
                "money":$(".package_type.active").attr("money"),
                "typeid":$(".package_type.active").attr("typeid")
            });
        })
        //重新登录
        $("body").on("click",".btn_login_renew",function () {
            $("#siteLogoutBtn").click();
        })
    },
    ajaxGetData:function () {
        var _this=this;
        $.ajax({
            url: "/r/Member_Renew/getRenewMeal/",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: { },    //参数值
            type: "post",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
                _this.queryState_box.show().html(querying_tpl);
                _this.con_box.hide()
            },
            success: function(res) {
                //请求成功时处理
                if(res.code==200){
                    var list=res.data;
                    var html=_this.template({data:list});
                    $(".package_box").html(html);
                    _this.con_box.show();
                    _this.queryState_box.hide()
                }else{
                    alert(res.msg)
                }
            },
            complete: function(res,status) {
                //请求完成的处理
                if(status=="timeout"){
                    alert("请求超时")
                }
            },
            error: function() {
                //请求出错处理
            }
        });
    },
    template:PFT.Util.ParseTemplate(packageType_tpl)
};
$(function(){
    Recharge.init()
});








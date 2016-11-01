/**
 * Created by fangxu  on 2016/10/26.
 */

//引入css
require("./index.scss");
//引入tpl
var querying_tpl=require("./tpl/querying.xtpl");
var querySuccess_tpl=require("./tpl/querySuccess.xtpl");
var queryFail_tpl=require("./tpl/queryFail.xtpl");
//引入modules
var DialogS=require("./dialog/dialog.js");



var Recharge={
    init:function(){
        var _this=this;
        //获取盒子
        this.queryState_box=$(".queryState_box");
        //装填盒子
        this.queryState_box.html(querySuccess_tpl);
        //初始化模块
        this.Dialoga=new DialogS;
        this.bind();
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
                "title":"微信二维码支付",
                "account":"票付通",
                "money":"9800"
            });
        });
        //支付宝
        $(".ali_pay").on("click",function () {
            _this.Dialoga.show_dialog_con({
                "title":"支付宝二维码支付",
                "account":"票付通",
                "money":"9800"
            });
        })
    }
};
$(function(){
    Recharge.init()
});








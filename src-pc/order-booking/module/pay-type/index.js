require("./index.scss");
var Tpl = require("./index.xtpl");
var Template = PFT.Util.ParseTemplate(Tpl);

var Message = require("pft-ui-component/Message");

var Domain = typeof PFT_DOMAIN=="function" ? PFT_DOMAIN() : "";

//充值页面
var rechargePage = Domain + "recharge.html";

var PayType = PFT.Util.Class({
    cacheDate : null,
    EVENTS : {
        "click .typeItem .text" : "onTypeItemClick",
        "click .typeItem .label" : "onTypeItemClick"
    },
    onTypeItemClick : function(e){
        var tarItem = $(e.currentTarget).parent();
        if(tarItem.hasClass("active")) return false;
        if(tarItem.hasClass("disable")) return Message.error("余额不足以支付本次订单",1500);
        tarItem.addClass("active").siblings().removeClass("active");
    },
    render : function(data){

        //paymode : 0余额支付，1在线支付，2授信支付，3自供自销，4现场支付

        //先判断onsite_pay, onsite_pay==1表示现场支付  如果onsite_pay==1,则余下字段不做判断，直接显示现场支付
        //如果不是现在支付，再判断self字段  self==1表示自供自销，余下字段不做判断，直接显示：自供自销，不需支付
        //credit: 授信余额，当credit=="unlimit"表示不限

        //测试数据
        // data = {
        //     fragment : {
        //         pay : {
        //             onsite_pay : 0,
        //             self : 0,
        //             credit : 0.02,
        //             remain : 0.01
        //         }
        //     }
        // }

        this.cacheDate = data;

        this.container.html(Template(data));
        return this;
    },
    refresh : function(totalMoney){
        var pay = this.cacheDate.fragment.pay;
        //如果是现场支付或自供应的
        if(pay.onsite_pay==1 || pay.self==1) return false; 
        if(isNaN(totalMoney)) return false;
        totalMoney = totalMoney * 1;
        var credit = pay.credit;
        var remain = pay.remain * 1;

        var listUl = this.container.find(".payTypeListUl");
        var options = listUl.children();
        var tarOption = listUl.children(".active");
        var creditOption = listUl.children(".credit"); //授信
        var remainOption = listUl.children(".remain"); //帐户余额
        var onlineOption = listUl.children(".online"); //在线支付

        //判断是否超出授信余额
        if(credit!=="unlimit" && totalMoney>credit*1){
            creditOption.addClass("disable").removeClass("active")
            .find(".rechargeBox").remove().end()
            .append('<span class="rechargeBox">余额不足</span>');
        }else{
            creditOption.removeClass("disable").find(".rechargeBox").remove();
        }

        //判断是否超出帐户余额
        if(totalMoney>remain){
            remainOption.addClass("disable").removeClass("active")
            .find(".rechargeBox").remove().end()
            .append('<span class="rechargeBox">余额不足<a class="rechargeLink" href="'+rechargePage+'">充值</a></span>');
        }else{ 
            remainOption.removeClass("disable").find(".rechargeBox").remove();
        }

        if(tarOption.hasClass("credit") && creditOption.hasClass("disable")){ //如果当前选中的是授信余额, 并且授信余额不够
            if(!remainOption.hasClass("disable")){ //但帐户余额足够
                remainOption.addClass("active");
            }else{ //连帐户余额也不够，那只能线上支付
                onlineOption.addClass("active");
            }
        }

        //同上逻辑
        if(tarOption.hasClass("remain") && remainOption.hasClass("disable")){ //如果当前选中的是帐户余额, 并且帐户余额不够
            if(!creditOption.hasClass("disable")){ //但授信余额足够
                creditOption.addClass("active");
            }else{ //连授信余额也不够，那只能线上支付
                onlineOption.addClass("active");
            }
        }

    },
    getSubmitData : function(){
        var pay = this.cacheDate.fragment.pay;
        if(pay.onsite_pay==1) return 4;
        if(pay.self==1) return 3;
        return this.container.find(".typeItem").filter(function(){
            return $(this).hasClass("active");
        }).attr("data-paymode");
    }
});

module.exports = PayType;
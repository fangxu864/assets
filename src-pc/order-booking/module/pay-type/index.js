require("./index.scss");
var Tpl = require("./index.xtpl");
var Template = PFT.Util.ParseTemplate(Tpl);

var Message = require("pft-ui-component/Message");

var PayType = PFT.Util.Class({
    cacheDate : null,
    EVENTS : {
        "click .typeItem" : "onTypeItemClick"
    },
    onTypeItemClick : function(e){
        var tarItem = $(e.currentTarget);
        if(tarItem.hasClass("active")) return false;
        if(tarItem.hasClass("disable")) return Message.error("余额不足以支付本次订单");
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
        //             credit : 500,
        //             remain : 300
        //         }
        //     }
        // }

        this.cacheDate = data;

        //http://images.12301.cc/icon/check.png
        this.container.html(Template(data));
        return this;
    },
    refresh : function(totalMoney){
        var pay = this.cacheDate.fragment.pay;
        //如果是现场支付或自供应的
        if(pay.onsite_pay==1 || pay.self) return false;        
        if(isNaN(totalMoney)) return false;
        totalMoney = totalMoney * 1;
        var credit = pay.credit;
        var remain = pay.remain;

        var listUl = this.container.find(".payTypeListUl");
        var options = listUl.children();
        var tarOption = listUl.children(".active");



        if(tarOption.hasClass("online")) return false; //如果当前选择的是在线支付

        if(tarOption.hasClass("credit")){ //当前选中的是授信余额
            //如果该帐户的授信余额为不限
            if(credit=="unlimit") return false;
            //如果授信额度刚好足以支付本次订单
            if(credit*1>=totalMoney) return false;
            tarOption.addClass("disable");
            listUl.children(".online").trigger("click");
        }else if(tarOption.hasClass("remain")){ //帐户余额
            if(remain*1>=totalMoney) return false;
            
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
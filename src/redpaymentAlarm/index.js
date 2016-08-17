/**
 * Created by Administrator on 2016/8/16.
 */
var tpl=require("./index.xtpl")
require("./index.scss")
var Dialog = require("COMMON/modules/dialog-simple");
var Mixin = require("COMMON/js/util.mix");
var Pubsub =require("COMMON/js/util.pubsub");

var RedpaymentAlarm =function (obj) {
        this.Dialog = new Dialog();
        this.init(obj)


};
RedpaymentAlarm.prototype = Mixin({
     type:"",
    init:function (obj) {
        var that = this;
        this.dialog = new obj.Dialog({
            width:380,
            content:tpl,
            drag:true,
            speed:100,
            events:{
                "click .repaymentAlarmBtn" : function () {
                    alert("123");
                    that.open();
                }
     },


            onReady:function () {

            }
        })

    },
    open:function (obj) {
        var that =this;
        this.dialog.open({
            onAfter:function () {
                var dialog_submitBtn =$(".repaymentAlarmBtn");
                dialog_submitBtn.attr("data-typenum",that.type)
            }

        })
    }
},Pubsub );


$(function () {
    alert("123");
    var obj = $(".repayAlarmContain");
    RedpaymentAlarm(obj)

})
/**
 * Created by Administrator on 2016/8/16.
 */
var tpl=require("./index.xtpl")
require("./index.scss")
var Dialog = require("COMMON/modules/dialog-simple");
var Mixin = require("COMMON/js/util.mix");
var Pubsub =require("COMMON/js/util.pubsub");

var RedpaymentAlarm =function () {
     this.init();

};
RedpaymentAlarm.prototype = Mixin({
     type:"ffff",
    init:function () {
        var that = this;
        this.dialog = new Dialog({
            width:300,
            height:300,
            content:tpl,
            drag:true,
            speed:100,
            events:{
                "click .repaymentAlarmBtn" : function () {
                }

     },


            onReady:function () {

            }
        })
        this.dialog.open();

    },





    open:function (opt) {
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
    // var obj = $(".repayAlarmContain");









    new RedpaymentAlarm()

})
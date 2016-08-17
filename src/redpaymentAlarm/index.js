/**
 * Created by Administrator on 2016/8/16.
 */
var tpl=require("./index.xtpl")
require("./index.scss")
var Dialog= require("COMMON/modules/dialog-simple");
var Mixin = require("COMMON/js/util.mix");
var Pubsub =require("COMMON/js/util.pubsub");
var RedpaymentAlarm=function (opt) {
           this.init(opt);
        Dialog = new Dialog;


};
RedpaymentAlarm.prototype = Mixin({
    type:"",
    init:function (opt) {
        var that = this;
        this.dialog = new opt.Dialog({
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
    open:function () {
        var that =this;
        this.dialog.open({

        })
    }
},Pubsub );
// var Main = function(){
//     var that = this;
//     this.dialog = new Dialog({
//         width : 750,
//         content : tpl,
//         drag : true,
//         speed : 100,
//         events : {
//             "click .repaymentAlarmBtn":function () {
//                 alert("1213")
//             }
//
//         },
//         onReady : function(){
//
//         }
//     })
// };

$(function () {
      new RedpaymentAlarm();

})
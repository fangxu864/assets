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
     type:"",
    init:function () {
        var that = this;
        this.dialog = new Dialog({
            width:450,
            height:330,
            content:tpl,
            drag:true,
            speed:100,
            events:{
                "click .repayAlarmSure" : function () {
                  that.dialog.close();

                },
                "click .repayAlarmCancel":function(){
                  that.dialog.close() ;
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
                var dialog_submitBtn =$("#repaymentAlarmBtn");
                dialog_submitBtn.attr("data-typenum",that.type)
            }

        })
    }
},Pubsub );

var addFunction= {
       changecolor:function () {

            $("#AlarmChangeColorRed").click(function(){
               alert($("#AlarmChangeColorRed").css("background"))
                if($("#AlarmChangeColorRed").css("background")=="red"||$("#AlarmChangeColorRed").css("background")=="#ccc"){
                    $("#AlarmChangeColorRed").css("background","#ccc")
                    $("#AlarmChangeColorBlack").css("background","#333333")
                }
            })
           $("#AlarmChangeColorBlack").click(function () {
               if($(this).css("background")=="#333333"){
                   $("#AlarmChangeColorRed").css("background","red");
                   $("#AlarmChangeColorBlack").css("background","#ccc");
               }
           })

       }
}


$(function () {
addFunction.changecolor();
$("#repaymentAlarm").click(function(){

       new RedpaymentAlarm()
})




})
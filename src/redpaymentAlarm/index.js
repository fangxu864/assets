/**
 * Created by Administrator on 2016/8/16.
 */
require("./index.xtpl")
require("./index.scss")
var Mixin = require("COMMON/js/util.mix");
var Pubsub =require("COMMON/js/util.pubsub");
var RedpaymentAlarm=function (opt) {
    this.init(opt)
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
},PubSub)

$(function () {
    new RedpaymentAlarm();
})
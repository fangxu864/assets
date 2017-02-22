/**
 * Created by Administrator on 2017/2/17.
 */
require("./index.scss");
var Class = require("COMMON/js/util.class.js");
var baseContainerTpl = require("./baseContainer.xtpl");

var Refund = Class({
    container : 'refundApplyWrap' ,
    init :function () {
        console.log($("#refundApplyWrap"));
        console.log(this.container[0].id);
        this.container.append(baseContainerTpl)
    }

});

$(function () {
    new Refund
});
// var tpl = require("./index.xtpl");
// $(function () {
//
//     frame = document.createElement('IFRAME');
//     $(frame).hide();
//     document.body.appendChild(frame);
//
//     frame.contentWindow.document.write(tpl);
//     frame.contentWindow.document.close();
//     frame.contentWindow.close();
//     frame.contentWindow.focus();
//     frame.contentWindow.print();
// })

//通用代码
var observer = {
    //订阅
    addSubscriber: function (callback) {
        this.subscribers[this.subscribers.length] = callback;
    },
    //退订
    removeSubscriber: function (callback) {
        for (var i = 0; i < this.subscribers.length; i++) {
            if (this.subscribers[i] === callback) {
                delete (this.subscribers[i]);
            }
        }
    },
    //发布
    publish: function (what) {
        for (var i = 0; i < this.subscribers.length; i++) {
            if (typeof this.subscribers[i] === 'function') {
                this.subscribers[i](what);
            }
        }
    },
    // 将对象o具有观察者功能
    make: function (o) {
        for (var i in this) {
            o[i] = this[i];
            o.subscribers = [];
        }
    }
};

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



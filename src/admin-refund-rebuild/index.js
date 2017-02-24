/**
 * Created by Administrator on 2017/2/17.
 */
require("./index.scss");
require("./jqPubSub.js");


var Filter = require("./modules/filter/filter.js");
var tableCon = require("./modules/table-con/table-con.js");

var State = {
    common : 1
};

$(function () {
    var common = 1 ;
    //title
    $("#refundApplyWrap").append('<div class="topTitleBox">提现申请列表</div>');
    //filter
    Filter.init(State);
    //tableCon
    tableCon.init(State)


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

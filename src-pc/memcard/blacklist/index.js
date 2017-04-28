/**
 * Created by Administrator on 2017/4/28.
 */

//-------------css--------------
require("./index.scss");

//-------------tpl--------------
var frameTpl = require("./tpl/frameTpl.xtpl");

//-----------modules------------
var renderNav = require("../common/nav/index.js");

var blackList = PFT.Util.Class({

    init: function () {
        var _this = this;
        this.container = $("#GBlacklistWrap");
        this.container.html(frameTpl);
        renderNav("2" , this.container.find(".nav-box"));
    }


});

$(function () {
    new blackList();
});

/**
 * Created by Administrator on 2017/5/4.
 */

//---------css--------
require("./index.scss");

//---------tpl--------
var frameTpl = require("./tpl/frame.xtpl");

//--------modules-----
var renderNav = require("./nav/index.js");
var Detail = require("./detail/index.js");

var packServe = PFT.Util.Class({

    init: function () {
        var _this = this;
        this.container = $("#G-package-serve-wrap");
        this.container.html(frameTpl);
        renderNav("6" , _this.container.find(".sec-nav-box"));
        new Detail();
    }

});

$(function () {
    new packServe();
});

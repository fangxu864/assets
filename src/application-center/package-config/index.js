
//---------css--------
require("./index.scss");
//---------tpl--------
var frameTpl = require("./tpl/frame.xtpl");
//--------modules-----
var renderNav = require("./nav/index.js");

var packConfig = PFT.Util.Class({
    
    init: function () {
        this.container = $("#G-package-config-wrap");
        this.container.html(frameTpl);
        renderNav("1",this.container.find(".title-box"));
    }
    
    
});


$(function () {
   new packConfig();
});


//---------css--------
require("./index.scss");
//---------tpl--------
var frameTpl = require("./index.xtpl");
//--------modules-----
var renderNav = require("../nav/index.js");
var config = require("../config/index.js");
//套餐管理模块
var Manage = PFT.Util.Class({

    init: function () {
        var _this =  this;
        $(function () {
            _this.container = $("#G-package-manage-wrap");
            _this.bind()
        });
    },

    bind: function () {
        var _this = this;
        this.container.on("click",'.add-btn', function () {
            _this.hide();
            config.show();
        })
    },

    show: function () {
        console.log(this.container)
        this.container.html(frameTpl);
        renderNav("1",this.container.find(".title-box"));
        this.container.show();
    },
    hide: function () {
        this.container.hide();
    }
    
    
});

module.exports = new Manage();
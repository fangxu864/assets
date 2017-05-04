
//---------css--------
require("./index.scss");
//---------tpl--------
var frameTpl = require("./index.xtpl");
//--------modules-----
var renderNav = require("../nav/index.js");

//套餐管理模块
var Manage = PFT.Util.Class({
    

    init: function () {
        var _this =  this;

        // $(function () {
            _this.container = $("#G-package-manage-wrap");
            setTimeout(function () {
                _this.bind();
            },0);
        // });
       
    },

    bind: function () {
        var _this = this;
        _this.config = require("../config/index.js");
       
        this.container.on("click",'.add-btn', function () {
            _this.hide();
            _this.config.show();
        })
    },

    show: function () {
        this.container.html(frameTpl);
        renderNav("1",this.container.find(".title-box"));
        this.container.show();
    },
    hide: function () {
        this.container.hide();
    }
    
    
});

module.exports = new Manage();
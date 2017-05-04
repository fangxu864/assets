
//---------css--------
require("./index.scss");
//---------tpl--------
var frameTpl = require("./index.xtpl");
//--------modules-----

//套餐配置模块
var Config = PFT.Util.Class({

    init: function () {
        var _this =  this;


        // $(function () {
            _this.container = $("#G-package-config-wrap");
            // setTimeout(function () {
                _this.bind();
            // },0);

        // });

    },
    
    bind: function () {
        var _this = this;
        _this.manage = require("../manage/index.js");
        console.log( _this.manage);
        this.container.on("click",'.save-btn', function () {
            _this.hide();
            _this.manage.show();
        });
    },

    show: function () {
        this.container.html(frameTpl);
        this.container.show();
    },
    hide: function () {
        this.container.hide();
    }
    
});

module.exports = new Config();

//---------css--------
require("./index.scss");
//---------tpl--------
var frameTpl = require("./index.xtpl");
//--------modules-----

//套餐配置模块
var Config = PFT.Util.Class({

    init: function () {
        this.bind()
    },
    
    bind: function () {
        
    },

    show: function () {
        this.container = $("#G-package-config-wrap");
        this.container.html(frameTpl);
        this.container.show();
    },
    hide: function () {
        this.container.hide();
    }
    
});

module.exports = new Config();
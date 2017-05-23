require("./index.scss");
var Filter = require("./module/filter/index.js");
var DC = require("./module/dataCenter/index.js");
var Mcon = require("./module/content/index.js");

var Main = {
    init: function () {
        //引进各个模块
        this.bind();
    },

    bind: function () {
        var _this = this;
        Filter.on("filterSearch" , function (param) {
            DC.getMainData(param);
        });
        Mcon.on("existUpdate" , function () {
            DC.delCurCache();
        })
    }
};

$(function () {
    Main.init();
});
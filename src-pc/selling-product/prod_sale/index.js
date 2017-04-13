require("./index.scss");
var Filter = require("./module/filter/index.js");
var Pagination = require("./module/pagination/pagination.js");
var DC = require("./module/dataCenter/index.js");

var Main = {
    init: function () {
        //引进各个模块
        this.filter = new Filter();
        this.pag = new Pagination();
        this.dc = new DC();
        this.bind();
    },

    bind: function () {
        var _this = this;
        this.filter.on("filterSearch" , function (param) {
            _this.dc.getMainData(param);
        })
    }
};

$(function () {
    Main.init();
});
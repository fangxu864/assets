/**
 * Created by Administrator on 2016/7/14.
 */
require("./index.scss");
var tpl = require("./index.xtpl");
var Filter = {
    container : $("#filterContainer"),
    initialize : function () {
        this.container.html(tpl);
    }
};


module.exports = Filter;
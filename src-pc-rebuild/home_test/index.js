/**
 * Created by Administrator on 2016/12/28.
 */

//引入公共框架
require("../home");
//引入插件
var Class = require("COMMON/js/util.class.js");
//引入本页tpl
var tpl = require("./index.xtpl");
//引入本页css
require("./index.scss");


var Home_test = Class({
    container : "#pft_right_box",
    init : function () {
        $(this.container).html(tpl)
    },
    EVENTS :{
    }
});


$(function () {
    new Home_test;
});

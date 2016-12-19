/**
 * Created by Administrator on 2016/12/19.
 */

var Class = require("COMMON/js/util.class.js");
var pft_footer_tpl = require("./index.xtpl");
var Pft_footer = Class({
    container : "#pft_footer_box",
    init : function () {
        $(this.container).html(pft_footer_tpl);
    },
    EVENTS :{
    }
});

module.exports = Pft_footer;

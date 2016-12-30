/**
 * Author: huangzhiyang
 * Date: 2016/12/15 15:24
 * Description: ""
 */
require ("./index.scss");

var Pft_header = require("./modules/pft_header_box");
var Pft_left = require("./modules/pft_left_box");
var Pft_footer = require("./modules/pft_footer_box");
var Class = require("COMMON/js/util.class.js");


var Main =  Class({
    container : "#body",
    init : function () {
        new Pft_header();
        new Pft_footer();
        new Pft_left();
    },
    EVENTS :{
    }
});

module.exports = (function(){
    $(function () {
        new Main();
    });
}());



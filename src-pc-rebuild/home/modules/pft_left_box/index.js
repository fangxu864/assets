/**
 * Created by Administrator on 2016/12/19.
 */

var Class = require("COMMON/js/util.class.js");
var pft_left_tpl = require("./index.xtpl");
var Pft_left = Class({
    container : "#pft_left_box",
    init : function () {
        var _this = this ;
        $(_this.container).html(pft_left_tpl);
        $(_this.container).find(".menu_box").css("height" , $(_this.container).height() - 60 + "px");
        $(window).on("resize",function () {
            $(_this.container).find(".menu_box").css("height" , $(_this.container).height() - 60 + "px");
        })
    },
    EVENTS :{
    }
});


module.exports = Pft_left;

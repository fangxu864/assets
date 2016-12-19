/**
 * Created by Administrator on 2016/12/19.
 */

var Class = require("COMMON/js/util.class.js");
var pft_header_tpl = require("./index.xtpl");
var Pft_header = Class({
    container : "#pft_header_box",
    init : function () {
        $(this.container).html(pft_header_tpl);
    },
    EVENTS :{
        "click .change_btn_box .change_btn" : "onChangeBtnClick"
    },
    onChangeBtnClick : function (e) {
        var tarBtn = $(e.currentTarget);
        //收缩
        if(tarBtn.hasClass("icon-icxiangyousuojin24px")){
            tarBtn.removeClass("icon-icxiangyousuojin24px")
                .addClass("icon-icxiangzuosuojin24px");
            $(".pft_left_box").animate({"width":"85px"} ,200 ,"swing" );
            $(".pft_right_box").animate({"left":"85px"} ,200 ,"swing" );
            $(".pft_header_box ul.lt li .logo_box").animate({"width":"50px"} ,200 ,"swing" );
            $(".pft_header_box ul.lt li.change_btn_box").animate({"margin-left":"20px"} ,200 ,"swing" );
            $(".pft_left_box .user_info_box .user_name_box").hide();
            $(".pft_left_box .menu_box ul.menu_ul li span.txt").hide();
            $(".pft_left_box .menu_box ul.menu_ul li span.arrow").hide();
        }
        //展开
        else{
            tarBtn.removeClass("icon-icxiangzuosuojin24px")
                .addClass("icon-icxiangyousuojin24px");
            $(".pft_left_box").animate({"width":"204px"} ,200 ,"swing" );
            $(".pft_right_box").animate({"left":"204px"} ,200 ,"swing" );
            $(".pft_header_box ul.lt li .logo_box").animate({"width":"128px"} ,200 ,"swing" );
            $(".pft_header_box ul.lt li.change_btn_box").animate({"margin-left":"60px"} ,200 ,"swing" );
            // $(".pft_left_box .menu_box ul.menu_ul li").off("mouseover.show_data_title")
            $(".pft_left_box .user_info_box .user_name_box").show();
            $(".pft_left_box .menu_box ul.menu_ul li span.txt").show();
            $(".pft_left_box .menu_box ul.menu_ul li span.arrow").show();
        }
    }
});


module.exports = Pft_header;
/**
 * Created by fangxu on 2017/5/19.
 */

//-------------css--------------
require("./index.scss");
//-------------tpl--------------
var indexTpl = require("./index.xtpl");
//-----------通用插件-----------
var Message = require("pft-ui-component/Message");
var Pagination = require("COMMON/modules/pagination-x");
var Select = require("COMMON/modules/select");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
var DatePicker = require("COMMON/modules/datepicker");
var tips = require("COMMON/modules/tips/index.js");
var Tips = new tips ();
//-----------自建模块-----------

var register = PFT.Util.Class({
    init : function () {
        this.container = $("#registerWrap .register-bottom");
        this.container.html(indexTpl);
        this.bind();
    },

    bind: function () {
        var _this = this;
        var CON = this.container;

        CON.on("click", ".register-bottom .self-radio" ,function () {
            $(this).addClass("checked").siblings(".self-radio").removeClass("checked");
            $(this).children("input[type = radio]").prop("checked" ,true)
        });

        CON.on("click" , ".register-bottom .self-checkbox" ,function (e) {
            $(this).toggleClass("checked");
            var curState = $(this).children("input[type = checkbox]").prop("checked");
            $(this).children("input[type = checkbox]").prop("checked" , !curState)
        });

        CON.on("click" ,".register-btn" ,function () {
            alert($("#form-test").serialize())
        })
    }
});

$(function () {
   new register();
});
/**
 * Created by Administrator on 2017/4/28.
 */

//-------------css--------------
require("./index.scss");

//-------------tpl--------------
var frameTpl = require("./tpl/frame.xtpl");

//-----------modules------------
var renderNav = require("../common/nav/index.js");
var Pagination = require("COMMON/modules/pagination-x");
var Dialog = require("./dialog/dialog.js");

var buyTicket = PFT.Util.Class({

    init: function () {
        var _this = this;
        this.container = $("#GBuyTicketWrap");
        this.container.html(frameTpl);
        renderNav("3" , this.container.find(".nav-box"));
        this.pagination = new Pagination({
            container : _this.container.find(".record-pag-box") , //必须，组件容器id
            count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });
        this.pagination.render({current:1,total:10});
        this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
            _this.pagination.render({current:toPage,total:totalPage});
        });
        this.bind()
    },

    bind: function () {
        var _this = this ;
        this.container.on("click" ,".filter-box .leading-in" ,function (e) {
            Dialog.leadingInShow();
        });
        this.container.on("click" ,".table-box .edit-btn" ,function (e) {
            Dialog.editShow();

        })
    }


});

$(function () {
    new buyTicket();
});

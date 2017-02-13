var Modals = require("./tpl/entry.xtpl");
require("./index.scss");
var Select = require("COMMON/modules/select");
var Pagination = require("COMMON/modules/pagination-x");
var ParseTemplate = require("COMMON/js/util.parseTemplate");
var Template = {
    tr: ParseTemplate(require('./tpl/tr.xtpl')),
}
var Main = PFT.Util.Class({
    container: "#content",

    dom: {
        div: {
            content: '#content',
            // entryDiv: '.u-input_box,.u-div',
            lid: '.u-span.lid'
        },
        table: {
            tbody: '#tbody'
        },
        btn: {
            entryBtn: '#entryBtn',
            searchBtn: '#sch_btn',
            clearBtn: '#content .u-div .clearCardInpBtn',
            modalClearBtn: '.clearCardInpBtn',
            // readCardBtn: '.m-modal .readCard',
            saveBtn: '#entry_modal .save',
            saveNewBtn: '#entryModal .saveNew',
            editBtn: '#tbody .crd_operation .u-btn_edit',
            editSaveBtn: '#editModal .save',
            fillCardBtn: '#tbody .crd_operation .u-btn_fillCard',
            delBtn: '#tbody .crd_operation .u-btn_del',
            delConfBtn: '#delModal .confirm',
            lossConfBtn: '.m-modal.loss .confirm',
            changeConfBtn: '#changeModal .save',


        },
        span: {
            editModalSpan_title: '#editModal .u-span_title',
        },
        modal: {
            modalBg: '.m-modal_bg',
            entryModalbg: '#entryModal',
            editModal: '#editModal',
        },
        inp: {
            phyInp: '.u-input_box .u-input.phy_no',
            modalCardInp: '.u-input_box .card_no',
            editPhy_inp: '#editModal .phy_no',
            editCard_inp: '#editModal .card_no',
            sch_inp: '#sch_inp',
            modalUInp: '.m-modal_bg .u-input',
            salerInp: '#saler_inp',

        }
    },
    init: function () {
        var _this = this;
        $(this.dom.div.content).append(Modals);
        _this.getMoreLid();
        var pagination = this.pagination = new Pagination({
            container: "#paginationWrap", //必须，组件容器id
            // count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal: true, //可选  是否显示总页数
            jump: true //可选  是否显示跳到第几页
        });
        pagination.on("page.switch", function (toPage, currentPage, totalPage) {
            // toPage :      要switch到第几页 currentPage : 当前所处第几页 totalPage :   当前共有几页
            pagination.render({
                current: currentPage,
                topage: toPage
            });
            $('html,body').animate({
                scrollTop: $('.g-index').offset().top
            }, 300);
            _this.getCardList(toPage);
        })
    },
    EVENTS: {
        'click #arrowDown': 'changePro',
        'click #entryBtn': 'getLid',
        'keyup #sch_inp': 'onFlashCard',
        'keyup .u-input.phy_no': 'onModalFlashCard',
        'click #sch_btn': 'getSchCardList',
        'click #gSelectDownBox_1 li': 'getSalerIdSetCookie',
        'click .m-modal_changeCard .save': 'onChangeCardSubmit',
        'click .m-modal_bg .close':'resetModalForm'

    },
    getLid: function () {
        var _this = this;
        var salerName = $(this.dom.inp.salerInp).attr("data-title");
        $(this.dom.div.lid).text(salerName);
        $(this.dom.inp.phyInp).val("");
        $(this.dom.modal.entryModalbg).show();
    },
    //初始化产品列表
    getMoreLid: function () {
        var _this = this;
        var select = new Select({
            source: "/r/product_Product/getLandInfoByApplyId",
            ajaxType: "POST",
            ajaxParams: {

            },
            isFillContent: false,
            filterType: "ajax",  //指定过滤方式为ajax
            field: {
                id: "id",
                name: "title",
                keyword: "land_name"
            },
            trigger: $("#saler_inp"),
            filter: true,
            adaptor: function (res) {
                var saler_inp = $("#saler_inp")
                var reslut = { code: 200 };
                var list = res.data;
                if (!list) {
                    return reslut;
                }
                var newList = [];
                for (var i = 0; i < list.length; i++) {
                    list[i].id = list[i].salerid;
                    list[i].title = list[i].title
                    newList.push(list[i]);
                }
                reslut["data"] = newList;
                var getCookie = _this.getCookie();
                var i = '<i class="iconfont down">&#xe673;</span>'
                if (getCookie.salerid == undefined) {
                    _this.setCookie(list[0].id, list[0].title);
                    saler_inp.attr({ "data-id": list[0].id, "data-title": list[0].title }).val(list[0].title);
                } else {
                    _this.setCookie(getCookie.salerid, getCookie.title);
                    saler_inp.attr({ "data-id": getCookie.salerid, "data-title": getCookie.title }).val(getCookie.title);
                }
                _this.getCardList(1);
                return reslut;
            },
        })
    },

    //获取cookie
    getCookie: function () {
        var cookie = document.cookie.split(";");
        for (var i = 0; i < cookie.length; i++) {
            var data = {}
            if (cookie[i].indexOf("salerid=") != -1) {
                var salerid = cookie[i].substr(8, 6);
            }
            if (cookie[i].indexOf("title=") != -1) {
                var title = cookie[i].substr(7, cookie[i].length - 6);
            }
        }
        data = { "salerid": salerid, "title": title }
        return data;
    },
    //设置cookie
    setCookie: function (salerid, title) {
        // console.log(salerid+"+"+title)
        var exp = new Date();
        exp.setTime(exp.getTime() + 5 * 60 * 60 * 1000);
        expGMT = exp.toGMTString();
        document.cookie = "salerid=" + salerid + ";expires=" + expGMT;
        document.cookie = "title=" + title + ";expires=" + expGMT;
    },

    //点击更换产品
    changePro: function () {
        $(this.dom.inp.salerInp).click();
    },
    //重置模态框底下的所有表单
    resetModalForm: function () {
        var _this = this;
        $(this.dom.modal.modalBg).hide();
        _this.onCloseModalClean();
    },
    //重置表单
    onCloseModalClean: function () {
        var _this = this;
        var span = '使用箱号或手牌上印制的卡号';
        $(this.dom.btn.modalClearBtn).hide();
        $(this.dom.btn.readCardBtn).text("");
        $(this.dom.inp.modalCardInp).text(span);
        $(this.dom.inp.modalUInp).val("");
    },
    //获取搜索列表
    getSchCardList: function () {
        var _this = this;
        _this.getCardList(1);
        $(this.dom.inp.phyInp).val("");
    },
    getSalerIdSetCookie: function () {
        var _this = this;
        var salerid = $(this.dom.inp.salerInp).attr("data-id");
        var title = $(this.dom.inp.salerInp).attr("data-title");
        _this.setCookie(salerid, title);
        _this.getCardList(1);
    },
    getCardList: function (toPage) {
        var _this = this,
            saler_inp = $(this.dom.inp.saler_inp).attr("data-id"),
            physicsNo = $(this.dom.inp.sch_inp).val(),
            status = $(".u-input_radio.status:checked").val(),
            color = $(".u-input_radio.color:checked").val(),
            request = "查询",
            tbody = $(this.dom.table.tbody),
            page = $("#paginationWrap");
        (!toPage) ? 1 : toPage;
        PFT.Util.Ajax(
            "/r/product_HotSpringCard/searchHotSpringCard", {
                type: "POST",
                dataType: "json",
                params: {
                    "physicsOrVisible": physicsNo,
                    "status": status,
                    "color": color,
                    "page": toPage,
                    "salerid": saler_inp,
                },
                loading: function () {
                    page.hide();
                    tbody.html("<tr><td colspan='6'>加载中,请稍后...</td></tr>");
                },
                success: function (res) {
                    if (res.code == 200) {
                        _this.renderCardList(res.data);
                         _this.cardEdit(request);
                         _this.pagination.render({ current: toPage ,topage:toPage,total:res.data.total});
                         page.attr("data-curr",_this.pagination.getCurrentPage())

                    } else {
                        tbody.html("<tr><td colspan='6'>" + res.msg + "</td></tr>")
                    }
                }
            })
    },
    //获取卡片列表及渲染数据
    renderCardList: function (list) {
        var tbody = $(this.dom.table.tbody);
        var cardList = Template.tr({ data: list });
        tbody.html(cardList);
       
    },
    //手牌编辑模态框
    cardEdit: function (request) {
        var _this = this;
        var editSaveBtn = $(this.dom.btn.editSaveBtn);
        var salerName = $(this.dom.inp.saler_inp).attr("data-title");
        $(this.dom.div.lid).text(salerName);
        $(this.dom.btn.editBtn + "," + this.dom.btn.fillCardBtn).on("click", function (e) {

            var that = $(e.currentTarget);
            var parent = that.parent();
            var title = $(_this.dom.span.editModalSpan_title);
            var phy_no = parent.attr("data-pn");
            var card_no = parent.attr("data-vn");
            var color = parent.attr("data-cl");
            var presuming_id = parent.attr("data-preid");
            var phyInp = $(_this.dom.inp.editPhy_inp);
            var cardInp = $(_this.dom.inp.cardInp);
            var editModal = $(_this.dom.modal.editModal);
            var cardBg = $(_this.dom.modal.editModal + " .cardBg");
            var url;
            if (that.hasClass("u-btn_fillCard")) {
                title.text("补卡");
                cardInp.attr({ "readonly": true }).css("background", "#eee");
                url = "replacePhysics";
            } else {
                title.text("编辑");
                cardInp.removeAttr("readonly").css("background", "#fff");
                url = "editCard";
            }
            editSaveBtn.attr({ "data-oldpn": phy_no, "data-oldcolor": color, "data-oldcrd": card_no, "data-preid": presuming_id, "data-req": request, "data-url": url })
            editModal.show();
            phyInp.val(phy_no);
            cardInp.val(card_no);
            if (color == "1") {
                cardBg.val("1");
            } else if (color == "2") {
                cardBg.val("2")
            } else {
                cardBg.val("-1");
            }
        })
    },
    //提交编辑
    onModalEditSubmit: function () {
        var _this = this,
            reg = /^[0-9a-zA-Z]+$/,
            phy_no = $(this.dom.inp.editPhy_inp),
            card_no = $(this.dom.inp.editCard_inp),
            colorBg = $(this.dom.modal.editModal),
            editSaveBtn=$(this.dom.btn.editSaveBtn);
            oldPhyVal=editSaveBtn.attr("data-oldpn"),
            oldColor=editSaveBtn.attr("data-oldcolor"),
            oldCard=editSaveBtn.attr("data-oldcrd"),
            req=editSaveBtn.attr("data-req"),
            presuming_id=editSaveBtn.attr("data-preid"),
            url=editSaveBtn.attr("data-url"),
            lid=$(this.dom.inp.saler_inp).attr("data-id"),
            phyVal=phy_no.val(),
            cardVal=card_no.val(),
            color=colorBg.val(),
            sch_inp=$(this.dom.inp.sch_inp),
            sch_inpVal=sch_inp.val(),
            currentPage=$("#paginationWrap").attr("data-curr");
        (req=="edit") ? sch_inp.val(phyVal) : _this.onSearchclearBtn();
        if(reg.test(phyVal.cardVal)){
            PFT.Util.Ajax(
            "/r/product_HotSpringCard/"+url,
            {

            })
        }

    },
  

})

$(function () {
    new Main();
})
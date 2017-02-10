var entry_modal = require("./tpl/entry.xtpl");
require("./index.scss");
var Select = require("COMMON/modules/select");
var Pagination = require("COMMON/modules/pagination-x");

var Main = PFT.Util.Class({
    container: "",
    EVENTS: {

    },
    dom: {
        div: {
            content: '#content',
            entryDiv: '.u-input_box,.u-div',
            lid: '.u-span.lid'
        },
        table: {
            tbody: '#tbody'
        },
        btn: {
            entryBtn: '#entryBtn',
            searchBtn: '#sch_btn',
            clearBtn: '.g-content .u-div .clearCardInpBtn',
            modalClearBtn: '.m-modal .u-input_box .clearCardInpBtn',
            readCardBtn: '.m-modal .readCard',
            saveBtn: '.m-modal_entring .save',
            saveNewBtn: '.m-modal_entring .saveNew',
            editSaveBtn: '.m-modal_edit .save',
            delBtn: '#tbody .crd_operation .u-btn_del',
            delConfBtn: '.m-modal.del .confirm',
            lossConfBtn: '.m-modal.loss .confirm',
            changeConfBtn: '.m-modal_changeCard .save'

        },
        modal: {
            modalBg: 'm-modal_bg',
            entryModalbg: '#entryModal',

        },
        inp: {
            phyInp: '.u-input_box .u-input.phy_no',
            sch_inp: '#sch_inp',
            modalUInp: '.m-modal_bg .u-input',
            modalCardInp: '.m-modal .u-input_box .card_no',
            salerInp: '#saler_inp'
        }
    },
    init: function () {
        var _this = this;
        $(this.dom.div.content).append(entry_modal);
        _this.getMoreLid();
    },
    getMoreLid: function () {
        var _this = this;
        var salerName = $(this.dom.inp.salerInp).attr("data-title");
        $(this.dom.div.lid).text(salerName);
        $(this.dom.inp.phyInp).val("");
        $(this.dom.modal.entryModalbg).show();
    },

})

$(function () {
    new Main();
})




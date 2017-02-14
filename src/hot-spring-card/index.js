var Modals = require("./tpl/entry.xtpl");
require("./index.scss");
var Select = require("COMMON/modules/select");
var Pagination = require("COMMON/modules/pagination-x");
var ParseTemplate = require("COMMON/js/util.parseTemplate");
var Template = {
    tr: ParseTemplate(require('./tpl/tr.xtpl')),
    info: ParseTemplate(require('./tpl/infotr.xtpl'))
}
var Main = PFT.Util.Class({
    container: "#content",

    dom: {
        div: {
            content: '#content',
            // entryDiv: '.u-input_box,.u-div',
            entry_lid: '#entryModal .u-span.lid',
            edit_lid: '#editModal .u-span.lid',
            status_conent: '#lossModal .u-modal_content'
        },
        table: {
            tbody: '#tbody'
        },
        btn: {
            entryBtn: '#entryBtn',
            searchBtn: '#sch_btn',
            clearBtn: '#content .clearCardInpBtn',
            modalClearBtn: '.clearCardInpBtn',
             readCardBtn: '.m-modal .readCard',
            saveBtn: '#entry_modal .save',
            saveNewBtn: '#entryModal .saveNew',
            editSaveBtn: '#editModal .save',
            editBtn: '#tbody .crd_operation .u-btn_edit',
            fillCardBtn: '#tbody .crd_operation .u-btn_fillCard',
            delBtn: '#tbody .crd_operation .u-btn_del',
            statusBtn: '#tbody .crd_operation .status',
            delConfBtn: '#delModal .confirm',
            lossConfBtn: '.m-modal.loss .confirm',
            changeConfBtn: '#changeModal .save',
            setStatusBtn: '#lossModal .confirm',


        },
        span: {
            editModalSpan_title: '#editModal .u-span_title',
        },
        modal: {
            modalBg: '.m-modal_bg',
            entryModalbg: '#entryModal',
            editModal: '#editModal',
            statusModal: '#lossModal',
            delModal: '#delModal'
        },
        inp: {
            phyInp: '.u-input_box .u-input.phy_no',
            modalCardInp: '.m-modal_bg .card_no',
            entryPhy_inp: '#entryModal .phy_no',
            entryCard_inp: '#entryModal .u-input.card_no',
            editPhy_inp: '#editModal .phy_no',
            editCard_inp: '#editModal .u-input.card_no',
            sch_inp: '#sch_inp',
            modalUInp: '.m-modal_bg .u-input',
            saler_inp: '#saler_inp',

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
        });
        _this.onChangePro();
        _this.onSchInpKeyUp();
        _this.onModalCardInpKeyup();
        _this.checkReplaceVisible();
    },
    EVENTS: {
        'click #arrowDown': 'changePro',
        'click #entryBtn': 'getLid',
        'keyup .u-input.phy_no': 'onModalFlashCard',
        'click #sch_btn': 'getSchCardList',
        //'click #gSelectDownBox_1 li': 'getSalerIdSetCookie',
        'click .m-modal_changeCard .save': 'onChangeCardSubmit',
        'click .m-modal_bg .close': 'resetModalForm',
        'click #entryModal .save': 'saveEntry',
        'click #entryModal .saveNew': 'saveNewEntry',
        'click #editModal .save': 'onModalEditSubmit',


    },
    //物理卡号搜索
    onSchInpKeyUp: function () {
        var _this = this;
        $(this.dom.inp.sch_inp).on("keyup", function (e) {
            var tarInp = $(e.currentPage);
            var tarInpVal = tarInp.val();
            var clearBtn = tarInp.siblings(".clearCardInpBtn");
            var keycode = e.keyCode;
            tarInpVal ? clearBtn.show() : clearBtn.hide();
            if (keycode != 13) return false;
            _this.getCardInfo();

        })
    },
    //模态框中物理卡号检测唯一性
    onModalCardInpKeyup: function () {
        var _this = this;
        $("#content .phy_no").on("keyup", function (e) {
            var tarInp = $(e.currentTarget);
            var clearBtn = tarInp.siblings(".clearCardInpBtn");
            var tarInpVal = tarInp.val();
            var tarType = tarInp.attr("data-type");
            var keycode = e.keyCode;
            tarInpVal ? clearBtn.show() : clearBtn.hide();
            if (keycode != 13) return false;
            _this.checkPhysicsCard(tarInpVal);
        })
    },
    //检测物理卡号唯一性
    checkPhysicsCard: function (physicsNo) {
        var _this = this,
            cardInfo = "";
        PFT.Util.Ajax(
            "/r/product_HotSpringCard/checkPhysicsCard",
            {
                type: "POST",
                dataType: "json",
                params: {
                    "physics_no": physicsNo,
                },
                success: function (res) {
                    if (res.code == 200) {
                        cardInfo = ' <span class="crd_card_no ">' + res.msg + '</span>';
                    } else {
                        cardInfo = '<span class="crd_card_no" style="color:red;">' + res.msg + '</span>';
                    }
                    $(".readCard").html(cardInfo);
                }
            })

    },
    //检测手牌号
    checkReplaceVisible: function () {
        var _this = this;
        $(this.dom.inp.modalCardInp).on("change", function (e) {
            var entryCardVal;
            var data;
            var tarInp = $(e.currentTarget);
            var tarInpVal = tarInp.val();
            var type = tarInp.attr("data-type");
            var span_des = tarInp.siblings(".u-span_des");
            var url = "checkVisibleNo";
            var lid = $(_this.dom.inp.saler_inp).attr("data-id");
            var presuming_id = $(_this.dom.btn.changeConfBtn).attr("data-preid");
            var oldVisi = $(_this.dom.btn.changeConfBtn).attr("data-vn");
            var reg = /^[0-9a-zA-Z]+$/;
            var span = '检查是否含有空格';
            entryCardVal = tarInpVal;
            if (type == "change") {
                url = "checkReplaceVisible";
                data = {
                    "old_visible": oldVisi,
                    "new_visible": entryCardVal,
                    "presuming_id": presuming_id
                }
            } else {
                data = {
                    "visible_no": entryCardVal,
                    "salerid": lid
                }
            }
            if (reg.test(entryCardVal)) {
                _this.onSubmitCheck(entryCardVal, url, data, tarInp);
            } else {
                span_des.text(span);
            }
        })
    },
    //提交前检测
    onSubmitCheck: function (entryCard, url, data, tarInp) {
        var reg = /^[0-9a-zA-Z]+$/;
        var lid = $("#saler_inp").attr("data-id");
        var span_des = tarInp.siblings(".u-span_des");
        if (reg.test(entryCard)) {
            PFT.Util.Ajax(
                "/r/product_HotSpringCard/" + url,
                {
                    type: "POST",
                    params: data,
                    success: function (res) {
                        span_des.text(res.msg)
                    },
                });
        } else {
            return false;
        }
    },
    //手牌录入
    getLid: function () {
        var _this = this;
        var salerName = $(this.dom.inp.saler_inp).attr("data-title");
        $(this.dom.div.entry_lid).text(salerName);
        $(this.dom.inp.phyInp).val("");
        $(this.dom.modal.entryModalbg).show();
    },
    //保存提交
    saveEntry: function () {
        var _this = this;
        _this.onModalEntrySubmit();
        $(this.dom.modal.entryModalbg).hide();
    },
    //保存并继续录入
    saveNewEntry: function () {
        var _this = this;
        _this.onModalEntrySubmit();
    },
    //提交录入
    onModalEntrySubmit: function () {
        var _this = this;
        var reg = /^[0-9a-zA-Z]+$/;
        var colorBg = $(this.dom.modal.entryModalbg + " .cardBg");
        var salerid = $(this.dom.inp.saler_inp).attr("data-id");
        var phyVal = $(this.dom.inp.entryPhy_inp).val();
        var carVal = $(this.dom.inp.entryCard_inp).val();
        var color = colorBg.val();
        var currentPage = $("#paginationWrap").attr("data-curr");
        if (!currentPage) currentPage = 1;
        if (reg.test(phyVal, carVal)) {
            PFT.Util.Ajax(
                "/r/product_HotSpringCard/createHotSpringCard",
                {
                    type: "POST",
                    params: {
                        "physics_no": phyVal,
                        "visible_no": carVal,
                        "color": color,
                        "salerid": salerid
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            PFT.Util.STip("success", res.msg, 4000);
                            _this.onCloseModalClean();
                            _this.getCardList(currentPage);
                        } else {
                            PFT.Util.STip("fail", res.msg, 4000);

                        }
                    },
                }
            );
        } else {
            return PFT.Util.STip("fail", "添加失败,请检查是否有字段为空", 4000);
        }
    },

    //手牌编辑模态框
    cardEdit: function (request) {
        var _this = this;
        var editSaveBtn = $(this.dom.btn.editSaveBtn);
        var salerName = $(this.dom.inp.saler_inp).attr("data-title");
        $(this.dom.div.edit_lid).text(salerName);
        $(this.dom.btn.editBtn + "," + this.dom.btn.fillCardBtn).on("click", function (e) {
            var that = $(e.currentTarget);
            var parent = that.parent();
            var title = $(_this.dom.span.editModalSpan_title);
            var phy_no = parent.attr("data-pn");
            var card_no = parent.attr("data-vn");
            var color = parent.attr("data-cl");
            var presuming_id = parent.attr("data-preid");
            var phyInp = $(_this.dom.inp.editPhy_inp);
            var cardInp = $(_this.dom.inp.editCard_inp);
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
            colorBg = $(this.dom.modal.editModal + " .cardBg"),
            editSaveBtn = $(this.dom.btn.editSaveBtn);
        oldPhyVal = editSaveBtn.attr("data-oldpn"),
            oldColor = editSaveBtn.attr("data-oldcolor"),
            oldCard = editSaveBtn.attr("data-oldcrd"),
            req = editSaveBtn.attr("data-req"),
            presuming_id = editSaveBtn.attr("data-preid"),
            url = editSaveBtn.attr("data-url"),
            lid = $(this.dom.inp.saler_inp).attr("data-id"),
            phyVal = phy_no.val(),
            cardVal = card_no.val(),
            color = colorBg.val(),
            sch_inp = $(this.dom.inp.sch_inp),
            sch_inpVal = sch_inp.val(),
            currentPage = $("#paginationWrap").attr("data-curr");
        (req == "edit") ? sch_inp.val(phyVal) : _this.onSearchClearBtn();
        if (reg.test(phyVal.cardVal)) {
            PFT.Util.Ajax(
                "/r/product_HotSpringCard/" + url,
                {
                    type: "POST",
                    params: {
                        "new_physics": phyVal,
                        "new_color": color,
                        "new_visible": cardVal,
                        "salerid": lid,
                        "old_physics": oldPhyVal,
                        "old_visible": oldCard,
                        "old_color": oldColor,
                        "presuming_id": presuming_id
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            $(_this.dom.modal.editModal).hide();
                            _this.onCloseModalClean();
                            PFT.Util.STip("success", res.msg, 4000);
                            _this.getCardList(currentPage);
                        } else {
                            PFT.Util.STip("fail", res.msg, 4000);
                        }
                    }
                });
        } else {
            return PFT.Util.STip("fail", "添加失败,请检查是否有字段为空", 4000)
        }

    },

    //更新产品状态(挂失,取消挂失等)
    statusUpdate: function (request) {
        var _this = this;
        $(this.dom.btn.statusBtn).on("click", function (e) {
            var tarBtn = $(e.currentTarget);
            var phyNo = tarBtn.parent().attr("data-pn");
            var presuming_id = tarBtn.parent().attr("data-preid");
            var status = tarBtn.attr("data-status");
            var text = tarBtn.text();
            var contentTxt = "确定要" + text + "?";
            var url = "";
            switch (status) {
                case "1":
                    //取消挂失
                    url = "recoverForbid";
                    break;
                case "2":
                    //解除禁用
                    url = "recoverCard";
                    break;
                case "3":
                    //挂失
                    url = "lossCard";
                    break;
                case "4":
                    //禁用
                    url = "forbidCard";
                    break;
            }

            $(_this.dom.div.status_conent).text(contentTxt);
            $(_this.dom.modal.statusModal).show();
            $(_this.dom.btn.setStatusBtn).attr({ "data-pn": phyNo, "data-status": status, "data-request": request, "data-preid": presuming_id, "data-url": url });

        })
        _this.onSetStatusConf();
    },
    //提交更新动作
    onSetStatusConf: function () {
        var _this = this;
        $(this.dom.btn.setStatusBtn).off("click")
        $(this.dom.btn.setStatusBtn).on("click", function (e) {
            var tartBtn = $(e.currentTarget),
                status = tartBtn.attr("data-status"),
                request = tartBtn.attr("data-request"),
                url = tartBtn.attr("data-url"),
                presuming_id = tartBtn.attr("data-preid");
            var opt = { "status": status, "request": request, "url": url, "presuming_id": presuming_id }
            _this.subStatusUpdate(opt);

        })
    },
    //提交更新请求
    subStatusUpdate: function (opt) {
        var _this = this;
        var curr = $("#paginationWrap").attr("data-curr");
        // console.log(opt.request)
        PFT.Util.Ajax(
            "/r/product_HotSpringCard/" + opt.url,
            {
                type: "POST",
                dataType: "json",
                params: {
                    "presuming_id": opt.presuming_id
                },
                loading: function () {
                    $(_this.dom.modal.statusModal).hide();
                },
                success: function (res) {
                    if (res.code == 200) {
                        PFT.Util.STip("success", res.msg, 4000);
                        (opt.request == "select") ? _this.getCardList(curr) : _this.getCardInfo(1);

                    } else {
                        PFT.Util.STip("fail", res.msg, 4000);
                    }
                }
            }
        )

    },
    //删除手牌
    delCard: function () {
        var _this = this;
        $("#tbody").on("click", ".u-btn_del", function (e) {
            var tarBtn = $(e.currentTarget),
                phyNo = tarBtn.parent().attr("data-pn");
            preid = tarBtn.parent().attr("data-preid");
            $(_this.dom.modal.delModal).show();
            $(_this.dom.btn.delConfBtn).attr({ "data-pn": phyNo, "data-preid": preid });

        })
        _this.confDel();
    },
    //提交删除手牌请求
    confDel: function () {
        var _this = this;
         var delConfBtn = $(_this.dom.btn.delConfBtn);
        var curr = $("#paginationWrap").attr("data-curr");
        delConfBtn.off("click");
        delConfBtn.on("click", function (e) {
            var tarBtn=$(e.currentTarget);
            var preid = tarBtn.attr("data-preid");
            PFT.Util.Ajax(
                "/r/product_HotSpringCard/deleteCard",
                {
                    type: "POST",
                    dataType: "json",
                    params: {
                        "presuming_id": preid
                    },
                    success: function (res) {
                        $(_this.dom.modal.delModal).hide();
                        if (res.code == 200) {
                            PFT.Util.STip("success", "删除成功", 4000);
                            _this.getCardList(curr);
                        } else {
                            PFT.Util.STip("fail", res.msg, 4000);
                        }
                    }
                })
        })

    },
    //刷卡获取卡片信息
    getCardInfo: function () {
        var _this = this,
            physicsNo = $(this.dom.inp.sch_inp).val(),
            request = "edit",
            tbody = $("#tbody"),
            salerid = $(this.dom.inp.saler_inp).attr("data-id");
        $("#paginationWrap").hide();
        PFT.Util.Ajax(
            "/r/product_HotSpringCard/getCardInfo",
            {
                type: "POST",
                dataType: "json",
                params: {
                    "physics_no": physicsNo,
                },
                loading: function () {
                    tbody.html("<tr><td colspan='6'>加载中,请稍后...</td></tr>");
                },
                success: function (res) {
                    if (res.code == 200) {
                        _this.renderGetCardInfo(res.data);
                        _this.cardEdit();
                        _this.delCard();
                        _this.statusUpdate(request);
                    } else {
                        tbody.html("<tr><td colspan='6'>" + res.msg + "</td></tr>")
                    }
                }
            })

    },
    //渲染获取物理卡号信息
    renderGetCardInfo: function (arr) {
        var tbody = $(this.dom.table.tbody);
        var cardInfo = Template.info({ arr: arr });
        tbody.html(cardInfo);
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
    //切换产品
    onChangePro: function () {
        var _this = this;
        $("#gSelectDownBox_1").on("click", "li", function () {
            _this.getSalerIdSetCookie();
        })
    },
    //点击更换产品
    changePro: function () {
        $(this.dom.inp.saler_inp).click();
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

    },
    //获取关联产品并设置cookie
    getSalerIdSetCookie: function () {
        var _this = this;
        var salerid = $(this.dom.inp.saler_inp).attr("data-id");
        var title = $(this.dom.inp.saler_inp).attr("data-title");
        _this.setCookie(salerid, title);
        _this.getCardList(1);
    },
    //获取手牌列表
    getCardList: function (toPage) {
        var _this = this,
            saler_inp = $(this.dom.inp.saler_inp).attr("data-id"),
            physicsNo = $(this.dom.inp.sch_inp).val(),
            status = $(".u-input_radio.status:checked").val(),
            color = $(".u-input_radio.color:checked").val(),
            request = "select",
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
                        var data = res.data;
                        _this.renderCardList(data);
                        _this.cardEdit(request);
                        _this.statusUpdate(request);
                        _this.delCard();
                        _this.pagination.render({ current: toPage, topage: toPage, total: res.data.total });
                        page.attr("data-curr", _this.pagination.getCurrentPage())

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
    //点击搜索框清除按钮
    onSearchClearBtn: function () {
        $(this.dom.inp.sch_inp).focus().val("");
        $(this.dom.btn.clearBtn).hide();
    },
    //模态框中的搜索框点击清除按钮
    onModalClearBtn: function(){
        
    }
})

$(function () {
    new Main();
})

require("./index.scss");
var tpl = require("./index.xtpl");
var Api = require("../../common/api.js");
var ReadPhysicsCard = require("../../common/ReadPhysicsCard.js")
$(".inpNum").after(tpl);
var MainView = Backbone.View.extend({
    el: $("form"),
    events: {
        "click input[type='submit']": "onAddBtnClick",

        "keydown .inpNum": "onCardInpKeyDown",
        "click #clearCardInpBtn": "onClearCardInpBtnClick"
    },
    initialize: function () {
        var that = this;
        this.submitBtn = $(".btn>.inpbtn[type='submit']");
        this.ReadPhysicsCard = new ReadPhysicsCard({ id: "readCardObj" });
        this.cardInp = $(".inpNum");
        this.phyNo = $("input[name='physics_no']");
        this.visiNo = $("input[name='visible_no']");
    },
    onAddBtnClick: function (e) {
        //var InpVal = this.cardInp.val();      
        var that = this;
        var phyVal = that.phyNo.val();
        var visiVal = that.visiNo.val();
        var reg = /^[A-Za-z0-9]+$/;
        console.log((reg.test(visiVal) + "+" + reg.test(phyVal)));
        if (phyVal === "" && visiVal !== "") {
            alert("物理卡号不能为空");
            if (!reg.test(visiVal)) {
                alert("实体卡号仅允许字母与数字,不能有空格");
                that.phyNo.focus();
                return false;
            }
            return false;
        } else if (visiVal === "" && phyVal !== "") {
            alert("实体卡号不能为空");
            if (!reg.test(phyVal)) {
                console.log((reg.test(visiVal) + "+" + reg.test(phyVal)));
                alert("物理卡号仅允许字母与数字,不能有空格");
                that.visiNo.focus();
                return false;
            }
            return false;
        } else {
            if (!reg.test(phyVal) && phyVal !== "") {
                alert("物理卡号仅允许字母与数字,不能有空格");
                that.phyNo.focus();
                return false;
            } else if (!reg.test(visiVal) && visiVal !== "") {
                console.log((reg.test(visiVal) + "+" + reg.test(phyVal)));
                alert("实体卡号仅允许字母与数字,不能有空格");
                that.visiNo.focus();
                return false;
            }
            else if (!reg.test(phyVal) && !reg.test(visiVal) || reg.test(phyVal && reg.test(visiVal))) {
                if (phyVal === "" && visiVal !== "") {
                    alert("物理卡号不能为空");
                    if (!reg.test(visiVal) && visiVal !== "") {
                        console.log((reg.test(visiVal) + "+" + reg.test(phyVal)));
                        alert("实体卡号仅允许字母与数字,不能有空格");
                        that.phyNo.focus();
                        return false;
                    }
                    return false;
                } else if (visiVal === "" && phyVal !== "") {
                    alert("实体卡号不能为空");
                    if (!reg.test(phyVal) && phyVal !== "") {
                        alert("物理卡号仅允许字母与数字,不能有空格");
                        that.visiNo.focus();
                        return false;
                    }
                    return false;
                } else if (visiVal === "" && phyVal === "") {
                    return true;
                }
            }
        };
    },

    onClearCardInpBtnClick: function (e) {
        var clearBtn = $(e.currentTarget);
        var txtInp = clearBtn.parents(".rt").prev();
        txtInp.val("").focus();
        clearBtn.hide();
    },
    onCardInpKeyDown: function (e) {
        var tarInp = $(e.currentTarget);
        var clearBtn = tarInp.next().find(".clearCardInpBtn");
        var val = tarInp.val();
        var keycode = e.keyCode;
        val ? clearBtn.show() : clearBtn.hide();
        if (keycode == 13) return false;
    }
})
$(function () {
    new MainView();
})
/**
 * Created by Administrator on 2015/5/25.
 */
var UtilClass = require("COMMON/js/util.class");

var TabSwitch = UtilClass({
    statics: {
        state: {
            "0": "正常",
            "1": "挂失",
            "2": "禁用",
            "3": "冻结",
            "4": "废弃"
        },
        searchInpVal: "会员名称/卡号/手机号/联系人姓名"
    },
    EVENTS: {
        "click #stateUl,.stateLi":"onStateTabClick",
        "focus #searchInp":"onSearchInpFocus",
        "blur #searchInp":"onSearchInpBlur",
        "keyup #searchInp":"onSearchInpKeyup"
    },
    init: function (opt) {
        var that = this;
        console.log(opt.container);
        this.container = $(opt.container) || $("body");
        this.tableBodys = this.container.find(".tbody");
        this.pagingCons = $("#pagingWrap").children();
        this.List = opt.List;       
        this.searchDeleteBtn = $("#searchDeleteBtn");
        $("#stateUl").on("click", ".stateLi", function (e) {
            that.onStateTabClick(that, e);
        });
        $("#formLoading").hide();
        $("#stateUl").find(".stateLi").first().trigger("click");
        $("#searchInp").val(this.statics.searchInpVal);
    },

  
    onStateTabClick: function (that,e) {
        var tarTab = $(e.currentTarget);
        var state = tarTab.attr("data-state");
        var List = that.List;
        if (typeof state === "undefined" || tarTab.hasClass("active")) return false;
        tarTab.addClass("active").siblings().removeClass("active");
        that.tableBodys.removeClass("active");
        that.pagingCons.removeClass("active");
        var tarTbody = $("#tbody_" + state).addClass("active");
        var tarPagingCon = $("#pagingCon_" + state).addClass("active");
        var tarList = tarTab.data("list");
        console.log(tarTbody+"+"+tarPagingCon+"+"+tarList+"+"+List)
        if (!tarList && List) {
            tarList = new List({
                "container": tarTbody,
                "tbodyContainer": tarTbody,
                "pagingContainer": tarPagingCon,
                "state": state
            });
            tarTab.data("list", tarList);
        } else if (tarList && tarTab.hasClass("dirty")) {
            tarList.getList({ state: state })
         console.log("here");
        }
        $('#pagingCon_0').addClass('active');
    },
    onSearchBtnClick: function (e) {
        var keyword = $("#searchInp").val();
        var tarTab = $("#stateUl").children(".active");
        var begintime = $("#begintime");
        var endtime = $("#endtime");
        var begin = $("#begintime").val();
        var end = $("#endtime").val();
        var list = tarTab.data("list");
        var state = tarTab.attr("data-state");
        var orgVal = that.statics.searchInpVal;
        keyword = keyword || "";
        if (keyword === orgVal && begin !== "" && end !== "") {
            if (end < begin) {
                alert("请选择正确的开卡截止日期");
                endtime.val("");
                return false;
            }
            keyword = "";

        } else if (keyword === orgVal && begin === "" && end === "") {
            keyword = "";
        } else if (keyword !== orgVal && begin !== "" && end !== "") {
            keyword = keyword; end = ""; begin = "";
        } else if (keyword === orgVal && begin !== "" && end === "") {
            endtime.attr("placeholder", "请选择开卡截止日期 !");
        } else if (keyword === orgVal && begin === "" && end !== "") {
            begintime.attr("placeholder", "请选择开卡起始日期 !");
        } else if (keyword !== orgVal && begin !== "" && end === "" || keyword !== orgVal && begin === "" && end !== "") {
            keyword = keyword;
            begin = "";
            end = "";
        }

        (keyword != orgVal) && typeof state !== "undefined" && list && list.getList && list.getList({ state: state, keyword: keyword, begin: begin, end: end });
        return false;
    },
    onSearchInpFocus: function (e) {
        var tarInp = $(e.currentTarget);
        var orgVal = that.statics.searchInpVal;
        tarInp.addClass("focus");
        if (tarInp.val() == orgVal) tarInp.val("");
    },
    onSearchInpBlur: function (e) {
        var tarInp = $(e.currentTarget);
        var orgVal = that.statics.searchInpVal;
        tarInp.removeClass("focus");
        if (!tarInp.val()) tarInp.val(orgVal);
    },
    onSearchInpKeyup: function (e) {
        var tarInp = $(e.currentTarget);
        var keycode = e.keyCode;
        if (keycode != 13) return false;
        var keyword = tarInp.val();
        if (keyword && keyword != that.statics.searchInpVal) {
            var tarTab = $("#stateUl").children(".active");
            var list = tarTab.data("list");
            var state = tarTab.attr("data-state");
            (typeof state !== "undefined") && list && list.getList && list.getList({ state: state, keyword: keyword, begin: begin, end: end });
        }
    },
    onDeleteBtnClick: function (e) {
        var tarTab = $("#stateUl").children(".active");
        var list = tarTab.data("list");
        var state = tarTab.attr("data-state");
        var begintime = $("#begintime");
        var endtime = $("#endtime");
        begintime.attr("placeholder", "");
        endtime.attr("placeholder", "");
        $("#searchInp").val("").focus();
        (typeof state !== "undefined") && list && list.getList && list.getList({ state: state, keyword: "" });
        return false;
    }
});


module.exports = TabSwitch;
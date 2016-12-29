/**
 * Created by Administrator on 2015/5/25.
 */
var UtilClass = require("COMMON/js/util.class");


var LimitInpCtrl = UtilClass({
    statics: {
        isPositiveNum: function (count) {
            count = String(count);
            var type = "^[0-9]*[1-9][0-9]*$";
            var re = new RegExp(type);
            if (count.match(re) == null) {
                return false;
            }
            return true;
        }
    },
    EVENTS: {
        "click": {
            ".saveBtn": "onSaveBtnClick"
        },
        "focus": {
            "input": "onInputFocus"
        },
        "blur": {
            "input": "onInputBlur"
        },
        "keyup": {
            "input": "onInputEnter"
        }
    },
    init: function (opt) {

        var container = this.container = opt.container || $("body");
        var tarInp = this.tarInp = container.find("input:text");
        var tarBtn = this.tarBtn = container.find(".btn");
        var perTxt = this.perTxt = container.find(".per");
        var btnWidth = this.btnWidth = this.tarBtn.width();
        tarBtn.width(0).hide();
    },
    onInputFocus: function (that, e) {
        var btn = that.tarBtn;
        var perTxt = that.perTxt;
        var btnWidth = that.btnWidth;
        that.lastVal = $(e.currentTarget).val();
        that.container.addClass("focus");
        perTxt.hide();
        btn.show().animate({ width: btnWidth });
        that.fire("onInputFocus", that, e);
    },
    onInputBlur: function (that, e) {
        var btn = that.tarBtn;
        var perTxt = that.perTxt;
        var val = $(e.currentTarget);
        that.container.removeClass("focus");
        btn.animate({ width: 0 }, "normal", function () {
            btn.hide();
            perTxt.show();
        });
        that.fire("onInputBlur", that, e);
    },
    onInputEnter: function (that, e) {
        that.fire("onInputEnter", that, e);
    },

    onSaveBtnClick: function (that, e) {
        that.fire("onSaveBtnClick", that, e);
    }
});

var List = UtilClass({
    statics: {
        api: "call/jh_card.php",
        pagesize: 12,
        template: "",
        state: {
            "0": "正常",
            "1": "挂失",
            "2": "禁用",
            "3": "冻结",
            "4": "废弃"
        },
        getStateNum: function (stateTxt) {
            if (!stateTxt) return false;
            var state = this.state;
            for (var i in state) {
                if (stateTxt == state[i]) return i;
            }
        },
        totalPage: 0,
        isPositiveNum: function (count) {
            count = String(count);
            var type = "^[0-9]*[1-9][0-9]*$";
            var re = new RegExp(type);
            if (count.match(re) == null) {
                return false;
            }
            return true;
        }
    },
    EVENTS: {
        "click": {
            //			".do .guashi" : "onGuashiBtnClick",
            ".do .doBtn": "onDobtnClick"
        }
    },
    init: function (opt) {
        var that = this;
        var tbodyContainer = this.tbodyContainer = opt.tbodyContainer;
        var pagingContainer = this.pagingContainer = opt.pagingContainer;
        var loadingMask = this.loadingMask = $("#formLoading");
        var state = this.state = opt.state;
        if (!tbodyContainer || !pagingContainer || typeof state == "undefined") return false;
        //绑定分页的各种点击事件
        pagingContainer.on("click", ".ui-paging-item", function (e) {
            var target = $(e.currentTarget);
            that.onPagingItemClick(target)
        });
        pagingContainer.on("click", ".ui-paging-prev,.ui-paging-next", function (e) {
            var target = $(e.currentTarget);
            that.onPagingNextPrevClick(target)
        });
        pagingContainer.on("click", ".ui-paging-goto", function (e) {
            var target = $(e.currentTarget);
            that.onPagingItemClick(target)
        });
        pagingContainer.on("keyup", ".ui-paging-which input", function (e) {
            var target = $(e.currentTarget);
            var keycode = e.keyCode;
            if (keycode != 13) return false;
            that.onPagingItemClick(target);
        });

        this.on("dirty", function () {
            $("#stateUl").children(".active").j
        })

        this.statics.template = $("#htmlTemplate").html();
        this.getList({ state: state })
    },
    limitInpInit: function (LimitInpCtrl) {
        var that = this;
        var isPositiveNum = that.statics.isPositiveNum;
        if (!LimitInpCtrl) return false;
        this.tbodyContainer.find(".limitCol .limitColCon").each(function () {
            new LimitInpCtrl({ container: $(this) })
                .on("onSaveBtnClick", function (obj, e) {
                    that.limitInpSave(that, obj, e);
                })
                .on("onInputEnter", function (obj, e) {
                    var keycode = e.keyCode;
                    var saveBtn = $(e.currentTarget).parent().children(".saveBtn");
                    if (keycode != 13) return false;
                    saveBtn.trigger("click");
                })
                .on("onInputBlur", function (obj, e) {
                    var tarInp = $(e.currentTarget);
                    var val = tarInp.val();
                    var lastVal = obj.lastVal;
                    if (val != "不限" && !isPositiveNum(val)) {
                        alert("请输入数值或'不限'两个字");
                        tarInp.val(lastVal);
                    }
                })
        });
    },
    limitInpSave: function (that, obj, e) {
        var tarBtn = $(e.currentTarget);
        var lastVal = obj.lastVal;
        var tarInp = tarBtn.parent().children("input");
        var tr = tarBtn.parents(".lineTr");
        var val = tarInp.val();
        var cid = tr.attr("data-cid");
        var did = tr.attr("data-did");
        var config_id = tr.attr("data-configid");
        var isPositiveNum = that.statics.isPositiveNum;
        var url = that.statics.api;
        if (val != "不限" && !isPositiveNum(val)) {
            alert("请输入数值或'不限'两个字");
            tarInp.val(lastVal);
            return false;
        }
        val = val == "不限" ? -1 : val;
        var param = tarInp.attr("data-param");
        var data = {};
        data["action"] = "edit_conf";
        data[param] = val;
        data["cid"] = cid;
        data["did"] = did;
        data["config_id"] = config_id;
        PFT.Ajax({
            url: url,
            type: "post",
            data: data,
            loading: function () { },
            removeLoading: function () { },
            timeout: function () { console && console.log("保存超时") },
            serverError: function () { console && console.log("保存出错") }
        }, function (res) {
            if (res.status == "success") {
                PFT_GLOBAL.U.Alert("success", '<p style="width:150px">修改成功</p>');
            } else {
                var msg = res.msg || "修改失败，请稍后重试";
                PFT_GLOBAL.U.Alert("fail", '<p style="width:150px">' + msg + '</p>');
            }
        })
    },
    //根据当前是什么状态值 显示相应的操作按钮
    getDosBySate: function (state, did) {
        //"0" : "正常","1" : "挂失", "2" : "禁用","3" : "冻结", "4" : "废弃"
        if (typeof state == "undefined") return false;
        var result = "";
        if (state == 0) {
            result = '<a href="repayment.html?did=' + did + '">授信/预存</a><a style="margin-left:8px" class="doBtn guashi" data-toState="1" href="javascript:void(0)">挂失</a><a class="doBtn jinyong" data-toState="2" href="javascript:void(0)">禁用</a>';
        } else if (state == 1) {
            result = '<a href="repayment.html?did=' + did + '">授信/预存</a><a style="margin-left:8px" class="buka" href="member_card.html?fid=' + did + '">补卡</a><a data-toState="0" class="doBtn huifu" style="margin-left:8px;" href="javascript:void(0)">恢复</a>';
        } else if (state == 2) {
            result = '<a href="repayment.html?did=' + did + '">授信/预存</a><a style="margin-left:8px" class="doBtn qiyong"  data-toState="0" href="javascript:void(0)">启用</a>';
        }
        return result;
    },
    //点击操作按钮时回调事件
    onDobtnClick: function (that, e) {
        var tarBtn = $(e.currentTarget);
        var password;
        if (tarBtn.hasClass("jinyong")) {
            var result = confirm("确定要禁用此会员吗？");
            if (result) {
                password = "";
            } else {
                return false;
            }
        } else {
            password = prompt("请输入此会员的消费密码", "");
            if (!password) return false;
        }
        var tarBtnTxt = tarBtn.text();
        var tr = tarBtn.parents(".lineTr");
        var cid = tr.attr("data-cid");
        var did = tr.attr("data-did");
        var toState = tarBtn.attr("data-tostate");
        var changeAfterStateTxt = that.getDosBySate(toState, did);
        var curTab = $("#stateUl").children(".active");
        var loading = function () {
            tarBtn.text("操作中..");
        };
        var removeLoading = function () {
            tarBtn.text(tarBtnTxt);
        };
        that.changeState({
            cid: cid,
            did: did,
            toState: toState,
            loading: loading,
            password: password,
            removeLoading: removeLoading,
            success: function (res) {
                if (curTab.attr("data-state") == "") {
                    tarBtn.parent().prev().text(that.statics.state[toState]);
                    tarBtn.parent().html(changeAfterStateTxt);
                } else {
                    tr.remove();
                    $("#stateUl").children(":first").addClass("dirty");
                }
                $("#stateUl").children("[data-state=" + toState + "]").addClass("dirty");
            }
        })
    },
    changeState: function (opt) {
        var fn = new Function;
        var opt = opt || {};
        var cid = opt.cid;
        var did = opt.did;
        var toState = opt.toState;
        var password = opt.password;
        var url = this.statics.api;
        var loading = opt.loading || fn;
        var removeLoading = opt.removeLoading || fn;
        var success = opt.success || fn;
        var fail = opt.fail || fn;
        var timeout = opt.timeout || fn;
        var serverError = opt.serverError || fn;
        if (!cid || !did || !toState) return false;
        PFT.Ajax({
            url: url,
            type: "post",
            data: {
                action: "chstatus",
                cid: cid,
                did: did,
                password: password,
                status: toState
            },
            loading: function () { loading() },
            removeLoading: function () { removeLoading() },
            timeout: function () { timeout() },
            serverError: function () { serverError() }
        }, function (res) {
            if (res.status == "success") {
                PFT_GLOBAL.U.Alert("success", '<p style="width:150px">操作成功</p>');
                success(res);
            } else {
                var msg = res.msg || "操作失败";
                PFT_GLOBAL.U.Alert("fail", '<p style="width:180px">' + msg + '</p>');
                fail(res);
            }
        })
    },
    onPagingItemClick: function (target) {
        var page = "";
        var state = this.state;
        var container = this.pagingContainer;
        var isPositiveNum = this.statics.isPositiveNum;
        if (target.hasClass("ui-paging-goto") || target.parent().hasClass("ui-paging-which")) {
            page = container.find(".ui-paging-which input").val();
            if (isPositiveNum(page)) this.getList({ page: page, state: state });
        } else {
            page = target.text();
            target.addClass("ui-paging-current").siblings().removeClass("ui-paging-current");
            this.getList({ page: page, state: state })
        }
    },
    onPagingNextPrevClick: function (target) {
        var container = this.pagingContainer;
        var curPage = container.find(".ui-paging-current").text();
        var state = this.state;
        var totalPage = this.statics.totalPage;
        curPage = Number(curPage);
        if (target.hasClass("ui-paging-prev") && curPage != 1) {
            this.getList({ page: curPage - 1, state: state })
        } else if (target.hasClass("ui-paging-next") && curPage != totalPage) {
            this.getList({ page: curPage + 1, state: state })
        }
    },
    //挂失
    onGuashiBtnClick: function (that, e) {
        var tarBtn = $(e.currentTarget);
        var tr = tarBtn.parents(".lineTr");
        var cid = tr.attr("data-cid");
        var did = tr.attr("data-did");
        var url = that.statics.api;
        var result = window.confirm("确定是否挂失？");
        if (!result) return false;
        if (!cid || !did) {
            console && console.log("缺省cid或did");
            return false;
        }
        var stateNum = that.statics.getStateNum("挂失");
        PFT.Ajax({
            url: url,
            type: "post",
            data: {
                action: "chstatus",
                cid: cid,
                did: did,
                status: stateNum
            },
            loading: function () { },
            removeLoading: function () { },
            timeout: function () { },
            serverError: function () { }
        }, function (res) {
            if (res.status == "success") {
                PFT_GLOBAL.U.Alert("success", '<p style="width:150px">挂失成功</p>');
                $("#stateUl").children("active").trigger("click");
            } else {
                PFT_GLOBAL.U.Alert("fail", '<p style="width:150px">挂失失败</p>');
            }
        })
    },

    getList: function (opt) {
        var that = this;
        var opt = opt || {};
        var state = opt.state;
        var page = opt.page || 1;
        var keyword = opt.keyword || "";
        var begin_time = opt.begin;
        var end_time = opt.end;
        var tbody = this.tbodyContainer;
        var url = this.statics.api;
        var pagesize = this.statics.pagesize;
        var loadingMask = this.loadingMask;
        var tpl = this.statics.template;
        var stateTxt = this.statics.state;
        var tarTab = $("#stateUl .active");
        if (typeof state == "undefined") return false;
        PFT.Ajax({
            url: url,
            type: "get",
            dataType: "json",
            data: {
                action: "list",
                currentPage: page,
                pageSize: pagesize,
                status: state,
                keyword: keyword,
                begin: begin_time,
                end: end_time
            },
            loading: function () { loadingMask.show() },
            removeLoading: function () { loadingMask.hide() },
            timeout: function () { console && console.log("请求call/jh_card.php接口超时") },
            serverError: function () { console && console.log("请求call/jh_card.php接口出错") }
        }, function (res) {
            var list = res.list;
            var curPage = res.page;
            var totalPage = res.totalpage;
            var html = "";
            if (list) {
                if (list.length) {
                    for (var i in list) {
                        var item = list[i];
                        var daily_buy_limit = item["daily_buy_limit"];
                        var buy_num_limit = item["buy_num_limit"];
                        var buy_interval = item["buy_interval"];
                        var status = item["status"];
                        var did = item["did"];

                        // var ordertime=item["ordertime"];//新增的上次使用时间

                        if (daily_buy_limit == -1) item["daily_buy_limit"] = "不限";
                        if (buy_num_limit == -1) item["buy_num_limit"] = "不限";
                        if (buy_interval == -1) item["buy_interval"] = "不限";
                        item["doTxt"] = that.getDosBySate(status, item["did"]);
                        item["status"] = stateTxt[status];

                        html += that.parseTemplate(tpl, item);

                    }
                    tarTab.removeClass("dirty");
                } else {
                    html = '<tr><td class="td col status empty" colspan="4">没有会员</td></tr>';
                }
                tbody.html(html);
                that.statics.totalPage = Number(totalPage);
                that.refreshPaging(curPage, totalPage);
                setTimeout(function () {
                    LimitInpCtrl && that.limitInpInit(LimitInpCtrl);
                    that.tbodyContainer.find(".tooltip").tooltipster();
                }, 10)
            } else {
                console && console.log("服务器返回数据格式出错")
            }
        })
    },
    refreshPaging: function (curPage, totalPage) {
        var pagingCon = this.pagingContainer;
        var curPage = Number(curPage);
        var pageCount = Number(totalPage);
        if (pageCount >= curPage && pageCount != 1) {
            var html = Paging.render({
                currentPage: curPage,
                pageCount: pageCount,
                link: "#",
                template: PAGING_TEMPLATE
            });
            $('#pagingCon_0').html(html)
            //			pagingCon.html(html)
        } else {
            //var html = Paging.render({
            //	currentPage : 1,
            //	pageCount: 10,
            //	link : "#",
            //	template : PAGING_TEMPLATE
            //});
            pagingCon.html("")
        }
    }
});



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
       /* "click": {
            //			"#stateUl .stateLi" : "onStateTabClick",
            "#searchBtn": "onSearchBtnClick",
            "#searchDeleteBtn": "onDeleteBtnClick"
        },
        "focus": {
            "#searchInp": "onSearchInpFocus"
        },
        "blur": {
            "#searchInp": "onSearchInpBlur"
        },
        "keyup": {
            "#searchInp": "onSearchInpKeyup"
        }*/
        "click #stateUl .stateLi":"onStateTabClick",
        "focus #searchInp":"onSearchInpFocus",
        "blur #searchInp":"onSearchInpBlur",
        "keyup #searchInp":"onSearchInpKeyup"
    },
    init: function (opt) {
        var that = this;
        console.log(opt);
        this.container = opt.container || $("body");
        this.tableBodys = this.container.find(".tbody");
        this.pagingCons = $("#pagingWrap").children();
        this.List = opt.List;
        this.searchDeleteBtn = $("#searchDeleteBtn");
        $("#stateUl").on("click", ".stateLi", function (e) {
            that.onStateTabClick(that, e);
        })
        $("#formLoading").hide();
        $("#stateUl").find(".stateLi").first().trigger("click");
        $("#searchInp").val(this.statics.searchInpVal);
    },

/*
    onStateTabClick: function (that, e) {
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
        if (!tarList && List) {
            tarList = new List({
                container: tarTbody,
                tbodyContainer: tarTbody,
                pagingContainer: tarPagingCon,
                state: state
            });
            tarTab.data("list", tarList);
        } else if (tarList && tarTab.hasClass("dirty")) {
            tarList.getList({ state: state })
        }
        $('#pagingCon_0').addClass('active');
    },
    onSearchBtnClick: function (that, e) {
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
    onSearchInpFocus: function (that, e) {
        var tarInp = $(e.currentTarget);
        var orgVal = that.statics.searchInpVal;
        tarInp.addClass("focus");
        if (tarInp.val() == orgVal) tarInp.val("");
    },
    onSearchInpBlur: function (that, e) {
        var tarInp = $(e.currentTarget);
        var orgVal = that.statics.searchInpVal;
        tarInp.removeClass("focus");
        if (!tarInp.val()) tarInp.val(orgVal);
    },
    onSearchInpKeyup: function (that, e) {
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
    onDeleteBtnClick: function (that, e) {
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
    }*/
});


module.exports = TabSwitch;
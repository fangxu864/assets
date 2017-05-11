/**
 * Created by Administrator on 15-12-2.
 */
var ModifyDialog = require("./modify.dialog.js");
var modifyDialog = null;
var Api = require("./api.js");
var api = new Api();
var AJAX_TIMEOUT_NUM = 5 * 60 * 1000; //5分钟超时，够了吧？？？？

var Message = require('pft-ui-component/Message');

var ListDoAction = RichBase.extend({
    EVENTS: {
        "click": {
            ".doBtn": "onDoBtnClick"
        }
    },
    init: function () {
        var that = this;
        this.container = $("#resultListUl");
        modifyDialog = new ModifyDialog();
        modifyDialog.on("ticket.modify", function (data) {
            that.modifyTicket(data.tarBtn, data.ordernum);
        })
    },
    onDoBtnClick: function (that, e) {
        var tarBtn = $(e.currentTarget);
        var ordernum = tarBtn.attr("data-ordernum");
        var action = tarBtn.attr("data-action");
        if (!ordernum || !action || tarBtn.hasClass("loading")) return false;

        switch( action ) {
            case "orderAlter": //修改
                modifyDialog.open(tarBtn, ordernum);
                break;

            case "orderCancel": //取消
                that.cancelOrder(tarBtn, ordernum);
                break;

            case "orderResend": //重发短信
                that.resendMsg(tarBtn, ordernum);
                break;

            case "orderFinish": // 完结已过期订单
                that.finishExpiredOrder( tarBtn, ordernum );
                break;
        }

        // if (action == "orderAlter") { //修改
        //     modifyDialog.open(tarBtn, ordernum);
        // } else if (action == "orderCancel") { //取消
        //     that.cancelOrder(tarBtn, ordernum);
        // } else if (action == "orderResend") { //重发短信
        //     that.resendMsg(tarBtn, ordernum);
        // }
    },

    // 完结已过期订单
    finishExpiredOrder: function( tarBtn, ordernum ) {
        Message.confirm('完结该笔过期订单后，订单金额可提现，该订单不可再操作验证和取消', function( result ){
            if( result ) {
                PFT.Ajax({
                    url: "",
                    type: "get",
                    dataType: "json",
                    ttimeout : AJAX_TIMEOUT_NUM,
                    data: {
                        ordernum: ordernum
                    },
                    loading: function () {
                        tarBtn.text("正在处理...").addClass("loading");
                    },
                    removeLoading: function () {
                        tarBtn.text("完结").removeClass("loading");
                    },
                    timeout: function (res) {
                        alert("请求超时，请稍后重试")
                    },
                    serverError: function (res) {
                        alert("请求出错，请稍后重试")
                    }
                }, function (res) {
                    if(res.outcome==1){ //审核成功
                        PFT.Help.AlertTo("success", '<p style="width:120px;">操作成功</p>');
                        var parent = tarBtn.parent();
                        tarBtn.parents(".col").siblings('.col_5').find(".tdCon").html("<em style='color:#bdbdbd'>已完结</em>");
                        tarBtn.siblings(".orderAlipay").remove();
                        tarBtn.siblings(".orderAlter").remove();
                        tarBtn.siblings(".orderCheck").remove();
                        tarBtn.siblings(".orderResend").remove();
                        tarBtn.siblings(".orderCancel").remove();
                        tarBtn.remove();
                        parent.children(".doBtn").first().prevAll("br").remove();
                        $("#listItem_" + ordernum).addClass("disable");
                        that.fire("cancelOrder.success");
                    }else if(res.outcome==-2){ //此订单取消需要审核，需要等待供应商审核结果才能知晓取消是否成功
                        var msg = res.msg || "此订单取消需审核，已向供应商发出取消订单申请，请等待供应商的审核结果";
                        var parent = tarBtn.parent();
                        tarBtn.parents(".col").siblings('.col_5').find(".tdCon").append("<span class='status' style='color: #f07845'>完结中</span>");
                        tarBtn.siblings(".orderAlter").remove();
                        tarBtn.siblings(".orderResend").remove();
                        tarBtn.siblings(".orderCancel").remove();
                        tarBtn.remove();
                        parent.children(".doBtn").first().prevAll("br").remove();
                        alert(msg);
                    }else{
                        var txt = res.msg || "";
                        PFT.Help.AlertTo("fail", '<p style="width:300px;">操作失败 ' + txt + '</p>');
                    }
                })
            } else {
                return false;
            }
        });
    },

    //取消订单
    cancelOrder: function (tarBtn, ordernum) {
        var that = this;
        if(tarBtn.hasClass("loading")) return false;
		if(!confirm("确定要取消此订单吗？")) return false;
		PFT.Ajax({
			url: "call/handle.php?from=order_cancel",
			type: "get",
			dataType: "json",
			data: {
				ordernum: ordernum
			},
			loading: function () {
				tarBtn.html("正在取消...").addClass("loading");
			},
			removeLoading: function () {
				tarBtn.html("取消").removeClass("loading");
			},
			timeout: function (res) {
				alert("请求超时，请稍后重试")
			},
			serverError: function (res) {
				alert("请求出错，请稍后重试")
			}
		}, function (res) {
			if(res.outcome==1){ //审核成功
				PFT.Help.AlertTo("success", '<p style="width:120px;">操作成功</p>');
				var parent = tarBtn.parent();
				tarBtn.parents(".col").siblings('.col_5').find(".tdCon").html("<em style='color:#bdbdbd'>已取消</em>");
				tarBtn.siblings(".orderAlipay").remove();
				tarBtn.siblings(".orderAlter").remove();
				tarBtn.siblings(".orderCheck").remove();
				tarBtn.siblings(".orderResend").remove();
                tarBtn.siblings(".orderFinish").remove();
				tarBtn.remove();
				parent.children(".doBtn").first().prevAll("br").remove();
				$("#listItem_" + ordernum).addClass("disable");
				that.fire("cancelOrder.success");
			}else if(res.outcome==-2){ //此订单取消需要审核，需要等待供应商审核结果才能知晓取消是否成功
				var msg = res.msg || "此订单取消需审核，已向供应商发出取消订单申请，请等待供应商的审核结果";
				var parent = tarBtn.parent();
				tarBtn.parents(".col").siblings('.col_5').find(".tdCon").append("<span class='status' style='color: #f07845'>退票中</span>");
				tarBtn.siblings(".orderAlter").remove();
				tarBtn.siblings(".orderResend").remove();
                tarBtn.siblings(".orderFinish").remove();
				tarBtn.remove();
				parent.children(".doBtn").first().prevAll("br").remove();
				alert(msg);
			}else{
				var txt = res.msg || "";
				PFT.Help.AlertTo("fail", '<p style="width:300px;">操作失败 ' + txt + '</p>');
			}
		});
    },
    //重发短信
    resendMsg: function (tarBtn, ordernum) {
        if (!confirm("确定要重发短信？")) return false;
        PFT.Ajax({
            url: "call/handle.php?from=order_resend",
            type: "get",
            dataType: "json",
			ttimeout : AJAX_TIMEOUT_NUM,
            data: {
                ordernum: ordernum
            },
            loading: function () {
                tarBtn.text("正在重发...").addClass("loading");
            },
            removeLoading: function () {
                tarBtn.text("重发短信").removeClass("loading");
            },
            timeout: function (res) {
                alert("请求超时，请稍后重试")
            },
            serverError: function (res) {
                alert("请求出错，请稍后重试")
            }
        }, function (res) {
            if (res.outcome == 1) {
                PFT.Help.AlertTo("success", '<p style="width:120px;">短信已重发</p>');
            } else {
                alert(res.msg || "");
            }
        })
    },
    //修改票数
    modifyTicket: function (tarBtn, ordernum) {
        var that = this;
        var data = {};
		if(tarBtn.hasClass("loading")) return false;
        var orderNumHidInp = $("#modifyTicket_ordernum_hidInp");
        data[orderNumHidInp.attr("name")] = orderNumHidInp.val();
        $("#ticModListUl").find(".numInp").each(function(){
            var tarInp = $(this);
            var val  = tarInp.val();
            var name = tarInp.attr("name");
            var has_terminal_num = tarInp.attr("data-hasterminal");
            data[name] = val*1+has_terminal_num*1;
        })
        var modifyData = "";
        for(var i in data){
            var key = i;
            var val = data[i];
            modifyData += "&"+key+"="+val;
        }
        if(modifyData) modifyData=modifyData.substring(1);
		PFT.Ajax({
			url: "call/handle.php?from=order_alter",
			type: "post",
			dataType: "json",
			data: modifyData,
			loading: function () {
				tarBtn.text("正在修改..").addClass("loading");
			},
			removeLoading: function () {
				tarBtn.text("修改").removeClass("loading");
			},
			timeout: function (res) {
				alert("请求超时，请稍后重试")
			},
			serverError: function (res) {
				alert("请求出错，请稍后重试")
			}
		}, function (data) {
			var outcome = data.outcome;
			var msg = data.msg || '操作成功';
			if(outcome==1 || outcome==-2){
				api.query(1, 10, {select_type: 1, select_text: ordernum}, {
					success: function (res) {
						var tpl = $("#order-list-item-tpl").html();
						var template = _.template(tpl);
						var html = template({data: res});
						$("#listItem_" + ordernum).after(html);
						$("#listItem_" + ordernum).remove();
					}
				});
				if(outcome==1){
					PFT.Help.AlertTo("success", '<p style="width:120px;">操作成功</p>');
					that.fire("modifyTicket.success");
				}else{ //outcome==-2
					alert(msg);
				}
			}else{
				var txt = data.msg || "";
				PFT.Help.AlertTo("fail", '<p style="width:300px;">操作失败 ' + txt + '</p>');
			}
		});
    }
});
module.exports = ListDoAction;
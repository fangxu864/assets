/**
 * Created by Administrator on 2017/2/24.
 */

require("./table-con.scss");
var tableConTpl = require("./table-con.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");

/**
 * 本模块为数据显示模块
 * 负责显示filter传递过来的数据
 */
var tableCon = {
    container: $("<div class='tableCon'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.bind();
    },

    bind: function () {
        var _this = this;
        this.CR.pubSub.sub("tableConBox.render",function ( res ) {
            _this.render(res);
        });
        this.CR.pubSub.sub("tableConBox.close",function () {
            _this.close();
        });
        this.container.on("click" ,".btnPrint" ,function () {
            var html = $(this).parents("tbody").html();
            _this.CR.pubSub.pub("print.printOne",html)
        });
        //客服登录时，点击表格中的同意
        this.container.on("click" ,".tr3 .td3 .wd_status0 .btnOk" ,function () {
            var tbody = $(this).parents("tbody");
            console.log(tbody);
            var id = $(this).attr("data-id");
            var refund_status = $(this).attr("data-status");
            _this.cs.agree(tbody,id,refund_status);
        });
        this.container.on("click" ,".tr3 .td3 .wd_status0 .btnDeny" ,function () {
            var tarBtn = $(this);
            var tbody = $(this).parents("tbody");
            console.log(tbody);
            var params = {
                tbody:tbody,
                type: "csDeny",
                title: "请填写拒绝申请的原因",
                id : tarBtn.attr("data-id"),
                aid: tarBtn.attr("data-aid"),
                refund_status: tarBtn.attr("data-deny"),
            };
            _this.cs.deny.call( _this ,params);
        })
    },

    close: function () {
        this.container.hide();
    },

    /**
     * @method 渲染表格内容
     */
    render: function ( res ) {
        var _this = this;
        var ConfigJson = {
            statusInfo: {
                0 : '申请提现',
                1 : '同意提现',
                2 : '成功提现',
                3 : '取消提现',
                4 : '拒绝提现',
                5 : '自动转账中'
            }
        };
        var newData = $.extend({} , res.data , ConfigJson );
        var html = _this.tableConTemplate({data : newData});
        _this.container.html(html).show();
    },

    /**
     * @method 解析模板
     */
    tableConTemplate: ParseTemplate( tableConTpl ),

    /**
     * @object 客服登录时的操作
     */
    cs: {
        //同意
        agree: function (tbody,id,refund_status) {
            var isAgree = confirm("确定要同意提现吗？");
            if(!isAgree) return false;
            $.ajax({
                url: "/module/withdraw/handler.php",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步
                data:  { action: "refund", id: id, refund_status: refund_status},    //参数值
                type: "POST",   //请求方式
                timeout:5000,   //设置超时 5000毫秒
                beforeSend: function() {
                    //请求前的处理
                },
                success: function(res) {
                    //请求成功时处理
                    if(res.outcome == 1){
                        PFT.Util.STip("success",res.msg);
                        tbody.remove();
                    }else{
                        PFT.Util.STip("fail",res.msg)
                    }
                },
                complete: function(res,status) {
                    //请求完成的处理
                    if(status=="timeout"){
                        alert("请求超时")
                    }
                },
                error: function() {
                    //请求出错处理
                }
            });
        },
        //拒绝
        // deny: function (tbody,id) {
        //     var action_url = "/module/withdraw/handler.php";
        //     checkAutoWithdraw();
        //     //检查是否支持自动转账
        //     function checkAutoWithdraw() {
        //         $.ajax({
        //             url: action_url,    //请求的url地址
        //             dataType: "json",   //返回格式为json
        //             async: true, //请求是否异步，默认为异步
        //             data:  { action: "check_auto_pay", id: id },    //参数值
        //             type: "POST",   //请求方式
        //             timeout:5000,   //设置超时 5000毫秒
        //             beforeSend: function() {
        //                 //请求前的处理
        //             },
        //             success: function(res) {
        //                 //请求成功时处理
        //                 console.log(res);
        //                 if(res.outcome==1){
        //                     //是否使用自动转账
        //                     if (!confirm('该笔提现可以使用自动转账，是否使用自动转账？')) {
        //                         //采用手工打款
        //                         manualTransfer(id, status,aid);
        //                     }else{
        //                         //采用自动打款
        //                         autoTransfer(id);
        //                     }
        //                 } else {
        //                     //采用手工打款
        //                     manualTransfer(id, status,aid);
        //                     return false;
        //                 }
        //             },
        //             complete: function(res,status) {
        //                 //请求完成的处理
        //                 if(status=="timeout"){
        //                     alert("请求超时")
        //                 }
        //             },
        //             error: function() {
        //                 //请求出错处理
        //             }
        //         });
        //     }
        //     //手工转账
        //     function manualTransfer(id, status,aid){
        //         var msg_obj = {
        //             "0":"请填写退回申请原因",
        //             "2":"请填写支付宝交易号或银行业务参考号",
        //             "4":"请填写退回申请原因"
        //         };
        //
        //         $("#title_msg").text(msg_obj[status]);
        //         var bh = $("html").height();
        //         var bw = $("html").width();
        //         $("#mask").css({ height:bh, width:bw, display:"block" });
        //         $("#pop_refund").show();
        //
        //         $("#pop_refund").off('click').on('click', '.btn_submit', function(){
        //             var input_txt = $("#input_txt").attr("value");
        //             var boxtrue = $(".sendboxSms").attr("checked");
        //             var sendsmsType = 0;        //0是默认不发送短信通知，1 是发送
        //             if(boxtrue=="checked"){
        //                 sendsmsType = 1;
        //                 if(!input_txt){
        //                     alert("请填写退回申请原因");
        //                     return;
        //                 }
        //             }
        //             var parama = {
        //                 action:'refund',
        //                 refund_status:status,
        //                 id:id,
        //                 aid : aid,
        //                 sendsmsType : sendsmsType,
        //                 input_txt:input_txt
        //             };
        //
        //             $.ajax({
        //                 "url":action_url,
        //                 "dataType":"json",
        //                 'type':'post',
        //                 "data":parama,
        //                 "success": function(data){
        //                     if(data.outcome==1){
        //                         alert("操作成功");
        //                         closeBg();
        //                         location.reload();
        //                     }else{
        //                         alert("操作失败:"+data.msg);
        //                         location.reload();
        //                     }
        //                 }
        //             });
        //         });
        //     }
        //     //自动转账
        //     function autoTransfer(id) {
        //         var params = {
        //             action     : 'auto_pay',
        //             id         : id
        //         };
        //
        //         $.ajax({
        //             "url"       : action_url,
        //             "dataType"  : "json",
        //             'type'      : 'post',
        //             "data"      : params,
        //             "success"   : function(data){
        //                 if(data.outcome==1){
        //                     PFT.Util.STip("success","操作成功");
        //                     location.reload();
        //                 }else{
        //                     PFT.Util.STip("fail","操作失败:"+data.msg);
        //                     location.reload();
        //                 }
        //             }
        //         });
        //     }
        // }
        //拒绝
        deny: function (params) {
            this.CR.pubSub.pub("dialog.csDeny" , params)
        }
    },

    /**
     * @object 财务登录时的操作
     */
    finance: function () {
        
    }









};

module.exports = tableCon;
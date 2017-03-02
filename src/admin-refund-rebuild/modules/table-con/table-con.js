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
        this.CR.pubSub.sub("tableConBox.removeTbody",function (tbodyId) {
            _this.removeTbody(tbodyId);
        });
        this.CR.pubSub.sub("tableConBox.updateTbody",function (tbodyId) {
            _this.updateTbody(tbodyId);
        });
        this.container.on("click" ,".btnPrint" ,function () {
            var html = $(this).parents("tbody").html();
            _this.CR.pubSub.pub("print.printOne",html)
        });
        //客服登录时，点击表格中的同意
        this.container.on("click" ,".tr3 .td3 .wd_status0 .btnOk" ,function () {
            var tbody = $(this).parents("tbody");
            var id = $(this).attr("data-id");
            var refund_status = $(this).attr("data-status");
            _this.cs.agree(tbody,id,refund_status);
        });
        //客服登录时，点击表格中的拒绝
        this.container.on("click" ,".tr3 .td3 .wd_status0 .btnDeny" ,function () {
            var tarBtn = $(this);
            var tbodyId = $(this).parents("tbody").prop("id");
            var params = {
                tbodyId: tbodyId,
                type: "csDeny",
                title: "请填写拒绝申请的原因",
                id : tarBtn.attr("data-id"),
                aid: tarBtn.attr("data-aid"),
                refund_status: tarBtn.attr("data-deny"),
            };
            _this.cs.deny.call( _this ,params);
        });
        //财务登录时，点击表格中的撤回
        this.container.on("click" ,".tr3 .td3 .wd_statusNot0 .btnDeny" ,function () {
            var tarBtn = $(this);
            var tbodyId = $(this).parents("tbody").prop("id");
            var params = {
                tbodyId: tbodyId,
                type: "financeDeny",
                title: "请填写撤回申请的原因",
                id : tarBtn.attr("data-id"),
                aid: tarBtn.attr("data-aid"),
                refund_status: tarBtn.attr("data-deny")
            };
            _this.finance.deny.call( _this ,params);
        });
        //财务登录时，点击表格中的转账
        this.container.on("click" ,".tr3 .td3 .wd_statusNot0 .btnTransfer" ,function () {
            var tarBtn = $(this);
            var tbodyId = $(this).parents("tbody").prop("id");
            var params = {
                tbodyId: tbodyId,
                type: "financeTransfer",
                title: "请填写支付宝交易号或银行业务参考号",
                id : tarBtn.attr("data-id"),
                aid: tarBtn.attr("data-aid"),
                refund_status: tarBtn.attr("data-deny")
            };
            _this.finance.transfer.call( _this ,params);
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
        deny: function (params) {
            this.CR.pubSub.pub("dialog.csDeny" , params)
        }
    },

    /**
     * @object 财务登录时的操作
     */
    finance: {
        // 转账
        transfer: function (params) {
            var _this = this;
            var action_url = "/module/withdraw/handler.php";
            checkAutoWithdraw();
            //检查是否支持自动转账
            function checkAutoWithdraw() {
                $.ajax({
                    url: action_url,    //请求的url地址
                    dataType: "json",   //返回格式为json
                    async: true, //请求是否异步，默认为异步
                    data:  { action: "check_auto_pay", id: params.id },    //参数值
                    type: "POST",   //请求方式
                    timeout:5000,   //设置超时 5000毫秒
                    beforeSend: function() {
                        //请求前的处理
                    },
                    success: function(res) {
                        //请求成功时处理
                        if(res.outcome==1){
                            //是否使用自动转账
                            if (!confirm('该笔提现可以使用自动转账，是否使用自动转账？')) {
                                //采用手工打款
                                manualTransfer( params.id , params.refund_status , params.aid );
                            }else{
                                //采用自动打款
                                autoTransfer( params.id );
                            }
                        } else {
                            //采用手工打款
                            manualTransfer( params.id , params.refund_status , params.aid );
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
            }
            //手工转账
            function manualTransfer(id, status,aid){
                _this.CR.pubSub.pub("dialog.financeTransfer" , params)
            }
            //自动转账
            function autoTransfer(id) {
                var param = {
                    action     : 'auto_pay',
                    id         : id
                };
                $.ajax({
                    "url"       : action_url,
                    "dataType"  : "json",
                    'type'      : 'post',
                    "data"      : param,
                    "success"   : function(data){
                        if(data.outcome==1){
                            PFT.Util.STip("success","操作成功");
                            _this.removeTbody(params.tbodyId);
                        }else{
                            PFT.Util.STip("fail","操作失败:"+data.msg);
                        }
                    }
                });
            }
        },
        //撤回
        deny: function (params) {
            this.CR.pubSub.pub("dialog.financeDeny" , params)
        }
    },

    /**
     * @method 删除某一个tbody
     * @param tbodyId
     */
    removeTbody: function (tbodyId) {
        this.container.find("#"+tbodyId).remove();
    },

    /**
     * @method 更新某一个tbody的内容
     * @param tbodyId
     */
    updateTbody: function (tbodyId) {
        this.container.find("#"+tbodyId).find(".tr3 .td3")
            .html(
                '<div class="wd_status0">' +
                '<p><span class="operableBtn btnPrint">打印</span></p> ' +
                '</div>'
            );
    }

};

module.exports = tableCon;
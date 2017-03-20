/**
 * Created by Administrator on 2017/3/1.
 */

require("./dialog.scss");
var Dialog=require("COMMON/modules/dialog-simple");
var dialogTpl = require("./dialog.xtpl");
var printListTpl = require("./printlist.xtpl");

var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");


var DialogModule = {
    container: $("<div class='adminRefundDialogCon'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.dial = new Dialog({
            width : 600,
            offsetY : -80,
            closeBtn : true,
            content : "",
            drag : true,
            speed : 100,
            onCloseAfter : function(){
            }
        });
        this.dial.container.find(".gSimpleDialog-content").append(_this.container);
        this.bind();
        
    },
    
    bind: function () {
        var _this = this;
        //订阅客服的拒绝
        this.CR.pubSub.sub("dialog.csDeny" , function (params) {
            var html = _this.dialogTemplate({ data: params});
            _this.container.html(html);
            _this.dial.open();
        });
        //订阅财务的撤回
        this.CR.pubSub.sub("dialog.financeDeny" , function (params) {
            var html = _this.dialogTemplate({ data: params});
            _this.container.html(html);
            _this.dial.open();
        });
        //订阅财务的转账
        this.CR.pubSub.sub("dialog.financeTransfer" , function (params) {
            var html = _this.dialogTemplate({ data: params});
            _this.container.html(html);
            _this.dial.open();
        });
        //订阅打印的打印清单
        this.CR.pubSub.sub("dialog.showPrintList" , function (res) {
            var paramsArr = [
                ['支付宝',res.data.alipay.length , 1],
                ['民生',res.data.minsheng.length ,2],
                ['银行',res.data.bank.length ,3 ]
            ] ;
            _this.printListData = {
                1 : {
                    title: '支付宝',
                    data: $.extend( {} , res.data.alipay )
                    },
                2 : {
                    title: '民生',
                    data: $.extend( {} , res.data.minsheng )
                },
                3 : {
                    title: '银行',
                    data: $.extend( {} , res.data.bank )
                }
            };
            var html = _this.printListTemplate({ data: paramsArr});
            _this.container.html(html);
            _this.dial.open();
        });

        //客服拒绝申请的弹框，点击确定按钮时
        this.container.on("click" ,".csDeny_btnOk" ,function () {
            var tarBtn = $(this);
            var curTbodyId = tarBtn.attr("data-tbodyId");
            var textareaCon = _this.container.find(".contentTextarea").val();
            if( textareaCon == ""){
                PFT.Util.STip("fail","请填写内容");
                return false;
            }
            var params = {
                action: "refund",
                id : tarBtn.attr("data-id"),
                aid: tarBtn.attr("data-aid"),
                refund_status: tarBtn.attr("data-refund_status"),
                sendsmsType: _this.container.find(".isMsg").prop("checked") ? 1 : 0,
                input_txt: textareaCon
            };
            $.ajax({
                url: "/module/withdraw/handler.php",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步
                data: params,    //参数值
                type: "POST",   //请求方式
                timeout:5000,   //设置超时 5000毫秒
                beforeSend: function() {
                    //请求前的处理
                },
                success: function(res) {
                    //请求成功时处理
                    if(res.outcome == 1){
                        PFT.Util.STip("success",res.msg);
                        _this.CR.pubSub.pub("tableConBox.removeTbody",curTbodyId);
                        _this.dial.close();
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
        });

        //财务撤回申请的弹框，点击确定按钮时
        this.container.on("click" ,".financeDeny_btnOk" ,function () {
            var tarBtn = $(this);
            var curTbodyId = tarBtn.attr("data-tbodyId");
            var textareaCon = _this.container.find(".contentTextarea").val();
            if( textareaCon == ""){
                PFT.Util.STip("fail","请填写内容");
                return false;
            }
            var params = {
                action: "refund",
                id : tarBtn.attr("data-id"),
                aid: tarBtn.attr("data-aid"),
                refund_status: tarBtn.attr("data-refund_status"),
                sendsmsType: _this.container.find(".isMsg").prop("checked") ? 1 : 0,
                input_txt: textareaCon
            };
            $.ajax({
                url: "/module/withdraw/handler.php",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步
                data: params,    //参数值
                type: "POST",   //请求方式
                timeout:5000,   //设置超时 5000毫秒
                beforeSend: function() {
                    //请求前的处理
                },
                success: function(res) {
                    //请求成功时处理
                    if(res.outcome == 1){
                        PFT.Util.STip("success",res.msg);
                        _this.CR.pubSub.pub("tableConBox.updateTbody",curTbodyId);
                        _this.dial.close();
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
        });

        //财务手工转账的弹框，点击确定按钮时
        this.container.on("click" ,".financeTransfer_btnOk" ,function () {
            var tarBtn = $(this);
            var curTbodyId = tarBtn.attr("data-tbodyId");
            var textareaCon = _this.container.find(".contentTextarea").val();
            if( textareaCon == ""){
                PFT.Util.STip("fail","请填写内容");
                return false;
            }
            var params = {
                action: "refund",
                id : tarBtn.attr("data-id"),
                aid: tarBtn.attr("data-aid"),
                refund_status: tarBtn.attr("data-refund_status"),
                sendsmsType: _this.container.find(".isMsg").prop("checked") ? 1 : 0,
                input_txt: textareaCon
            };
            $.ajax({
                url: "/module/withdraw/handler.php",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步
                data: params,    //参数值
                type: "POST",   //请求方式
                timeout:5000,   //设置超时 5000毫秒
                beforeSend: function() {
                    //请求前的处理
                },
                success: function(res) {
                    //请求成功时处理
                    if(res.outcome == 1){
                        PFT.Util.STip("success",res.msg);
                        _this.CR.pubSub.pub("tableConBox.removeTbody",curTbodyId);
                        _this.dial.close();
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
        });

        //打印提现清单
        this.container.on("click" ,".print-list-con .print-btn" ,function () {
            var tarBtn = $(this);
            if( tarBtn.hasClass('disabled') ) return false;
            var type = tarBtn.attr("data-type");
            _this.CR.pubSub.pub("print.printList" , _this.printListData[type])
        })
    },

    /**
     * @method 解析模板
     */
    dialogTemplate: ParseTemplate(dialogTpl),
    printListTemplate: ParseTemplate(printListTpl)
};

module.exports = DialogModule;
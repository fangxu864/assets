/*
 * @Author: huangzhiyang 
 * @Date: 2017-05-08 11:30:56 
 * @Last Modified by: huangzhiyang
 * @Last Modified time: 2017-05-10 16:48:19
 */

require("./index.scss");
var Util = PFT.Util;
var AJAX_ERROR_TEXT = PFT.AJAX_ERROR_TEXT;
var AJAX_TIMEOUT_TEXT = PFT.AJAX_TIMEOUT_TEXT;

var __timer__ = null;

var Dialog = require("pft-ui-component/Dialog");
var Drag = require("pft-ui-component/Drag");
var Message = require("pft-ui-component/Message");

var ConTpl = require("./index.xtpl");
var listItemTpl = require("./listItem.xtpl");
var HasBindTRLine = require("./hasBindTrLine.xtpl");
var ItemTemplate = Util.ParseTemplate(listItemTpl);
var HasBindTRLineTemplate = Util.ParseTemplate(HasBindTRLine);


var LoadingHtml = PFT.Util.LoadingPc("努力加载中..",{
    tag : "li",
    height : 270
});



var ShowLinkTicketPop = Util.Class({
    container : "#listContainer",
    state : {
        tid : "",
        isLoading : false //判断是否正在ajax请求
    },
    EVENTS : {
        "click .bindProdTicketBtn" : "onBindProdTicketBtnClick",
        "click .removeBindBtn" : "onRemoveBindBtnClick"
    },
    onBindProdTicketBtnClick : function(e){
        var that = this;
        var tarBtn = $(e.currentTarget);
        var tid = tarBtn.attr("data-tid");
        this.state.tid = tid;
        this.open(function(){
            var productTicketName = tarBtn.find(".ltitle").html() + " - " + tarBtn.find(".ticket").html();
            var hasBind = tarBtn.parents("tr").next(".hasBindTrLine");
            var hasBindTit = hasBind.find(".tltitle").html();
            this.poper.find(".prodcutTicketName").html(productTicketName);
            if(hasBindTit) this.poper.find(".searchProdInput").val(hasBindTit);
            var keyword = hasBindTit ? hasBindTit.replace(/【.+】*/,"") : "";
            that.queryProductByKeyword(keyword);
        })
    },
    onSearchProdInpChange : function(e){
        var tarInp = $(e.currentTarget);
        var val = $.trim(tarInp.val());
        var searchResultListWrap = $("#searchResultListWrap");
        val = val.replace(/【.+】*/,"");
        this.queryProductByKeyword(val);
    },
    onAddBtnClick : function(e){
        var tarBtn = $(e.currentTarget);
        if(tarBtn.hasClass("disable")) return false;
        var ticId = tarBtn.attr("data-tid");
        var sid = tarBtn.attr("data-sid");
        var proName = tarBtn.parent().children(".t").html();
        $("#searchProdInput").val(proName).attr("data-tid",ticId).attr("data-sid",sid);
        tarBtn.parent().addClass("active").siblings().removeClass("active");
    },
    //解绑
    onRemoveBindBtnClick : function(e){
        var that = this;
        var tarBtn = $(e.currentTarget);
        var tid = tarBtn.attr("data-tid");
        var ctid = tarBtn.attr("data-ctid");
        var caid = tarBtn.attr("data-caid");
        if(tarBtn.hasClass("disable")) return false;
        if(!tid) return Message.error("缺少tid");
        if(!ctid) return Message.error("缺少ctid");
        if(!caid) return Message.error("缺少caid");

        Message.confirm('<div style="text-align:center">确定要解除与该票类的绑定吗？</div>',function(result){
            if(!result) return false;
            Util.Ajax("/r/product_BindTicket/removeBindTicket/",{
                type : "POST",
                params : {
                    tid : tid,
                    ctid : ctid,
                    caid : caid
                },
                loading : function(){
                    tarBtn.addClass("disable");
                },
                complete : function(){
                    tarBtn.removeClass("disable");
                },
                success : function(res){
                    var code = res.code;
                    var msg = res.msg || AJAX_ERROR_TEXT;
                    if(code==200){
                        Message.success("解绑成功",1500);
                        setTimeout(function(){
                            tarBtn.parents(".hasBindTrLine").remove();
                        },1000);
                    }else{
                        Message.alert(msg);
                    }
                },
                timeout : function(){
                    Message.error(AJAX_TIMEOUT_TEXT);
                },
                serverError : function(){
                    Message.error(AJAX_ERROR_TEXT);
                }
            })
        });
        
    },
    /**
     * 点击确定，开始捆绑
     */
    onBindBtnClick : function(e){
        var that = this;
        var tarBtn = $(e.currentTarget);
        if(tarBtn.hasClass("disable")) return false;
        var resultInput = $("#searchProdInput");
        var tid = this.state.tid;
        if(!tid) return Message.error("缺少tid");

        var ticId = resultInput.attr("data-tid");
        if(!ticId) return Message.error("缺少票类id");

        var sid = resultInput.attr("data-sid");
        if(!sid) return Message.error("缺少sid");

        var stringify = function(data){
            if(JSON) return JSON.stringify(data);
            var res = "";
            res += '[';
            for(var i=0,len=data.length; i<len; i++){
                var arr = [];
                var str = "";
                str += "{";
                var c = data[i];
                var tid = c.tid;
                var aid = c.aid;
                arr.push("tid:"+tid);
                arr.push("aid:"+aid);
                str += arr.join(",");
                str += "}";
                res += str;
                if(len>1 && i<len-1) res += ",";
            }
            res += "]";
            return res;
        };

        //这边后端要求一定要先转成json字符再传过去
        var child = stringify([{tid:ticId,aid:sid}]);

        Util.Ajax("/r/product_BindTicket/bindTicket",{
            type : "POST",
            params : {
                tid : tid,
                //这边后端要求一定要先转成json字符再传过去
                child : child    
            },
            loading : function(){
                tarBtn.addClass("disable");
            },
            complete : function(){
                tarBtn.removeClass("disable");
            },
            success : function(res){
                var code = res.code;
                var msg = res.msg || AJAX_ERROR_TEXT;
                if(code==200){
                    Message.success("捆绑成功",1500);
                    that.dialog.close();
                    that.onBindSuccess({tid:tid});
                }else{
                    Message.error(msg);
                }
            },
            timeout : function(){
                Message.error(AJAX_TIMEOUT_TEXT);
            },
            serverError : function(){
                Message.error(AJAX_ERROR_TEXT);
            }
        })

    },

    //绑定成功时
    onBindSuccess : function(data){
        var tid = data.tid;
        if(!tid) return false;
        this.queryBindTickeInfo(tid);
    },

    //查询已绑定的景区产品票类信息
    queryBindTickeInfo : function(tid){
        if(!tid) return false;
        Util.Ajax("/r/product_BindTicket/getBoundTicket/",{
            type : "POST",
            params : {
                tid : tid
            },
            success : function(res){
                var code = res.code;
                var msg = res.msg || AJAX_ERROR_TEXT;
                var data = res.data;
                if(code==200){
                    var html = HasBindTRLineTemplate(data);
                    var tr = $("#bindProdTicketBtn_"+tid).parents("tr");
                    tr.next(".hasBindTrLine").remove();
                    tr.after(html);
                }else{
                    Message.error(msg);
                }
            },
            timeout : function(){
                Message.error("查询已绑定的票类信息超时，请稍后重试");
            },
            serverError : function(){
                Message.error("查询已绑定的票类信息出错，请稍后重试");
            }
        })
    },

    /**
     * 通过关键字搜索产品
     */
    queryProductByKeyword : function(keyword){
        if(this.state.isLoading) return false;
        var that = this;
        var tid = this.state.tid;
        var container = $("#searchResultListWrap");
        Util.Ajax("/r/product_BindTicket/queryLand/",{
            type : "POST",
            params : {
                ltitle : keyword,
                tid : tid
            },
            loading : function(){
                container.html(LoadingHtml);
            },
            complete : function(){
                container.html("");
            },
            success : function(res){
                var code = res.code;
                var data = res.data;
                var msg = res.msg || AJAX_ERROR_TEXT;
                if(code==200){
                    if(Util.isArray(data) && data.length==0){
                        container.html('<li class="state empty">'+msg+'</li>');
                    }else{
                        that.renderResult(data);
                    }
                }else if(code==102){
                    container.html('<li class="state unLogin">登录状态已过期，请重新登录</li>');
                }else{
                    container.html('<li class="state fail">'+msg+'</li>');
                }
            },
            timeout : function(){
                container.html('<li class="state timeout">'+AJAX_TIMEOUT_TEXT+'</li>');
            },
            serverError : function(){
                container.html('<li class="state serverError">'+AJAX_ERROR_TEXT+'</li>');
            }
        })
    },
    renderResult : function(data){
        var container = $("#searchResultListWrap");
        var state = this.state;
        var html = ItemTemplate({data:data});
        container.html(html);
    },
    open : function(onOpenAfter){
        var that = this;
        if(!this.dialog){
            this.dialog = new Dialog({
                width : 650,
                top : 150,
                title : "捆绑门票",
                content : ConTpl,
                drag : Drag,     //启用拖动功能
                yesBtn : false,
                cancelBtn : false,
                cache : false,
                EVENTS : {
                    "input .searchProdInput" : function(e){
                        clearTimeout(__timer__);
                        __timer__ = setTimeout(function(){
                            that.onSearchProdInpChange(e);
                        },400)
                    },
                    "click .addBtn" : function(e){
                        that.onAddBtnClick(e);
                    },
                    "click .btnGroup .yesBtn" : function(e){
                        that.onBindBtnClick(e);
                    },
                    "click .btnGroup .cancelBtn" : function(e){
                        this.close();
                    }
                }
            })
        }
        this.dialog.open({
            onOpenAfter : function(){
                onOpenAfter && onOpenAfter.call(this);
            }
        });
    },
    close : function(){
        this.dialog.close();
    }
});


module.exports = ShowLinkTicketPop;
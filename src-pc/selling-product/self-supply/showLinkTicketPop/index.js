/*
 * @Author: huangzhiyang 
 * @Date: 2017-05-08 11:30:56 
 * @Last Modified by: huangzhiyang
 * @Last Modified time: 2017-05-09 15:31:50
 */

require("./index.scss");
var Util = PFT.Util;
var AJAX_ERROR_TEXT = PFT.AJAX_ERROR_TEXT;
var AJAX_TIMEOUT_TEXT = PFT.AJAX_TIMEOUT_TEXT;

var __timer__ = null;

var Dialog = require("pft-ui-component/Dialog");
var Drag = require("pft-ui-component/Drag");

var ConTpl = require("./index.xtpl");

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
        "click .bindProdTicketBtn" : "onBindProdTicketBtnClick"
    },
    onBindProdTicketBtnClick : function(e){
        var tarBtn = $(e.currentTarget);
        var tid = tarBtn.attr("data-tid");
        this.state.tid = tid;
        this.open();
    },
    onSearchProdInpChange : function(e){
        var tarInp = $(e.currentTarget);
        var val = $.trim(tarInp.val());
        var searchResultListWrap = $("#searchResultListWrap");
        if(val=="") return searchResultListWrap.html("");
        this.queryProductByKeyword(val);
    },
    /**
     * 通过关键字搜索产品
     */
    queryProductByKeyword : function(keyword){
        if(this.state.isLoading) return false;
        if(!keyword) return false;
        var that = this;
        var tid = this.state.tid;
        var container = $("#searchResultListWrap");
        Util.Ajax("/r/product_BindTicket/queryLand",{
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
        var html = "";
        for(var i in data){
            var item = data[i];
            var tickets = item.tickets;
            for(var t=0,len=tickets.length; t<len; t++){
                var tic = tickets[t];
                var apply_sid = tic.apply_sid;
                var tid = tic.tid;
                var ltitle = tic.ltitle;
                var p_name = tic.p_name;
                html += '<li class="item" data-sid="'+apply_sid+'" data-tid="'+tid+'">';
                html += '<span class="t">'+ltitle+' - '+p_name+'</span>';
                html += '<span class="bindBtn">捆绑</span>';
                html += '</li>';
            }
        }
        container.html(html);
    },
    open : function(){
        var that = this;
        if(!this.dialog){
            this.dialog = new Dialog({
                width : 650,
                top : 150,
                title : "捆绑门票",
                content : ConTpl,
                drag : Drag,     //启用拖动功能
                yesBtn : true,
                cancelBtn : true,
                EVENTS : {
                    "input .searchProdInput" : function(e){
                        clearTimeout(__timer__);
                        __timer__ = setTimeout(function(){
                            that.onSearchProdInpChange(e);
                        },400)
                    }
                }
            })
        }
        this.dialog.open();
    },
    close : function(){
        this.dialog.close();
    }
});


module.exports = ShowLinkTicketPop;
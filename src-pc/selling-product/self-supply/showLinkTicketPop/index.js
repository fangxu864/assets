/*
 * @Author: huangzhiyang 
 * @Date: 2017-05-08 11:30:56 
 * @Last Modified by: huangzhiyang
 * @Last Modified time: 2017-05-09 14:36:18
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
    },
    onSearchProdInpChange : function(e){
        var tarInp = $(e.currentTarget);
        var val = $.trim(tarInp.val());
        console.log(val);
    },
    /**
     * 通过关键字搜索产品
     */
    queryProductByKeyword : function(keyword){
        if(this.state.isLoading) return false;
        if(!keyword) return false;
        var tid = this.state.tid;
        Util.Ajax("/r/product_BindTicket/queryLand",{
            type : "POST",
            params : {
                ltitle : keyword,
                tid : tid
            },
            loading : function(){},
            complete : function(){},
            success : function(res){},
            timeout : function(){

            },
            serverError : function(){

            }
        })
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
                        },200)
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
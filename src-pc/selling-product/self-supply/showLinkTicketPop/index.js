/*
 * @Author: huangzhiyang 
 * @Date: 2017-05-08 11:30:56 
 * @Last Modified by: huangzhiyang
 * @Last Modified time: 2017-05-09 09:37:01
 */

require("./index.scss");
var Util = PFT.Util;
var AJAX_ERROR_TEXT = PFT.AJAX_ERROR_TEXT;
var AJAX_TIMEOUT_TEXT = PFT.AJAX_TIMEOUT_TEXT;

var Dialog = require("pft-ui-component/Dialog");
var Drag = require("pft-ui-component/Drag");

var ConTpl = require("./index.xtpl");

var ShowLinkTicketPop = Util.Class({
    container : "#listContainer",
    EVENTS : {
        "click .bindProdTicketBtn" : "onBindProdTicketBtnClick"
    },
    onBindProdTicketBtnClick : function(e){
        this.open();
    },
    onSearchProdInpChange : function(e){
        var tarInp = $(e.currentTarget);
        var val = $.trim(tarInp.val());
        console.log(val);
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
                    "input,propertychange .searchProdInput" : "onSearchProdInpChange"
                },
                onSearchProdInpChange : function(e){
                    that.onSearchProdInpChange(e);
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
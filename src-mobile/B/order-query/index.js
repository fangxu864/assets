var FrameTpl = require("./index.xtpl");
var Common = require("./common.js");
var Putil = PFT.Util;

//列表模块
var ListManager = require("./ListManager");
//详情模块
var Detail = require("./Detail/index.js");


var Main = Putil.Class({
    container : "#appContainer",
    EVENTS : {
        "click #tabHeadMod .tabItem" : "onTabItemClick"
    },
    init : function(){
        var _this = this;
        this.container.html(FrameTpl);
        this.ListManager = new ListManager();
        this.Detail = new Detail();
        $("#openDetail").on("click",function () {
            _this.Detail.show(4007774);
        });
        $("#tabHeadMod").children().first().trigger("click");
    },
    onTabItemClick : function(e){
        var tarItem = $(e.currentTarget);
        if(tarItem.hasClass("active")) return false;
        tarItem.addClass("active").siblings().removeClass("active");
        var status = tarItem.attr("data-status");
        this.ListManager.switchTab(status);
    }
});




$(function(){ new Main();})

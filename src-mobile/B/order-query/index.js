var FrameTpl = require("./index.xtpl");
var Common = require("./common.js");
var Putil = PFT.Util;

var ListManager = require("./ListManager");


var Main = Putil.Class({
    container : "#appContainer",
    EVENTS : {
        "click #tabHeadMod .tabItem" : "onTabItemClick"
    },
    init : function(){
        this.container.html(FrameTpl);
        this.ListManager = new ListManager();
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
require("./index.scss");

var FrameTpl = require("./index.xtpl");
var Common = require("./common.js");
var Util = PFT.Util;

//搜索过滤模块
var SearchFilter = require("./SearchFilter");
//列表模块
var ListManager = require("./ListManager");
//详情模块
var Detail = require("./Detail");


var Main = Util.Class({
    container : "#appContainer",
    EVENTS : {
        
    },
    init : function(){
        var that = this;
        this.container.html(FrameTpl);
        
        this.ListManager = new ListManager();
        this.SearchFilter = new SearchFilter();
        

        //当顶部搜索模块发生变化时  刷新list列表
        this.SearchFilter.on("change:tab",function(data){ //切换标签
            that.ListManager.switchStatus(data);
        });
        this.SearchFilter.on("change:search",function(data){ //搜索条件变动时
            that.ListManager.refresh(data);
        });


        //启动
        $("#tabHeadMod").children().first().trigger("click");


    }
});




$(function(){ new Main();})

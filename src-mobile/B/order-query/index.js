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

var Backbone = require("backbone");

var Main = Util.Class({
    container : "#appContainer",
    pageHasInited : false,
    init : function(){
        var that = this;
        this.container.html(FrameTpl);
        
        this.ListManager = new ListManager();
        this.SearchFilter = new SearchFilter();
        this.Detail = new Detail();
        

        //当顶部搜索模块发生变化时  刷新list列表
        this.SearchFilter.on("change:tab",function(data){ //切换标签
            that.ListManager.switchStatus(data);
        });
        this.SearchFilter.on("change:search",function(data){ //搜索条件变动时
            that.ListManager.refresh(data);
        });

        this.initRouter();

    },
    initRouter : function(){
        var that = this;
        var AppRouter = Backbone.Router.extend({
            routes: {
                '': 'index',
                'detail/:id': 'detail'
            },
            index: function () {
                if(!that.pageHasInited){
                    that.pageHasInited = true;
                    //启动
                    $("#tabHeadMod").children().first().trigger("click");
                }
                that.Detail.close();
            },
            detail: function (ordernum) {
                that.Detail.show(ordernum);
            }
        });
        this.router = new AppRouter();
        Backbone.history.start();
    }
});




$(function(){ new Main();})

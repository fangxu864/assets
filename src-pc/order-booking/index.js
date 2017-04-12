require("./index.scss");
var Common = require("./common.js");
var Message = require("pft-ui-component/Message");
var LoadingHtml = PFT.Util.LoadingPc("努力加载中..",{
    height : 700
});

//最外层框架的html结构
var FrameTpl = require("./index.xtpl");

//各个模块
var TopTitle = require("./module/top-title");
var SkuInfo = require("./module/sku-info");
var TicketList = require("./module/ticket-list");
var FootTotal = require("./module/footTotal");

var Service = require("SERVICE/order-booking");

var Main = PFT.Util.Class({
    container : "#orderBookingContainer",
    init : function(){

        var that = this;
        var container = this.container;
        var urlParams = Common.getPidAid();

        Service.orderInfo({
            pid : urlParams.pid,
            aid : urlParams.aid
        },{
            debug : false,
            loading : function(){
                container.html(LoadingHtml);
            },
            complete : function(){
                container.html("");
            },
            success : function(data){
                that.initModules(data);
            },
            fail : function(msg){
                Message.alert(msg);
            },
            timeout : function(){
                Message.alert(PFT.AJAX_TIMEOUT_TEXT);
            },
            serverError : function(){
                Message.alert(PFT.AJAX_ERROR_TEXT);
            }
        })

    },
    initModules : function(data){
        this.container.html(FrameTpl);
        var topTitle = this.topTitle = new TopTitle({container:"#topTitleMod"}).render(data);
        var skuInfo = this.skuInfo = new SkuInfo({container:"#skuInfoMode",data:data});
        var ticketList = this.ticketList = new TicketList({container:"#ticketListMode"}).render(data);
        var footTotal = this.footTotal = new FootTotal({container:"#footTotalMod"}).render(ticketList.getTotalInfo());


        skuInfo.on("change:beginDate",function(data){ //非酒店、演出类产品，切换开始时间时
            ticketList.refresh(data);
        });

        ticketList.on("change",function(data){ footTotal.render(data)});
        

    }
});


$(function(){
    new Main();
})
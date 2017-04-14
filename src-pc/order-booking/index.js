require("./index.scss");

//通用方法逻辑
var Common = require("./common.js");

//通用消息提示组件
var Message = require("pft-ui-component/Message");

//获取loading状态显示的文字
var LoadingHtml = PFT.Util.LoadingPc("努力加载中..",{
    height : 700
});

//最外层框架的html结构
var FrameTpl = require("./index.xtpl");


//头部标题模块
var TopTitle = require("./module/top-title");

//购买信息参数切换模块
var SkuInfo = require("./module/sku-info");

//票类列表模块(酒店类产品没有)
var TicketList = require("./module/ticket-list");

//尾部汇总信息模块、下单按钮
var FootTotal = require("./module/footTotal");

//支付方式
var PayType = require("./module/pay-type");

//联系人填写信息模块
var Contact = require("./module/contact");


//服务层：获取此订单详细信息
var Service = require("SERVICE/order-booking");


var Main = PFT.Util.Class({
    container : "#orderBookingContainer",
    pType : "",
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
                that.pType = data.p_type;
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
    //初始化各个模块
    initModules : function(data){
        var that = this;
        var p_type = data.p_type;
        var isHotel = p_type=="C" ? true : false;
        var needID = data.needID;
        this.container.html(FrameTpl);
        var topTitle = this.topTitle = new TopTitle({container:"#topTitleMod"}).render(data);
        var skuInfo = this.skuInfo = new SkuInfo({container:"#skuInfoMode",data:data});
        var payType = this.payType = new PayType({container:"#payTypeMode"}).render(data);
        if(!isHotel){
            var ticketList = this.ticketList = new TicketList({container:"#ticketListMode"}).render(data);
        }
        
        var footTotalData = null;
        if(isHotel){
            footTotalData = {
                ls : 0,
                canOrder : false
            };
        }else{
            footTotalData = ticketList.getTotalInfo();
        }
        var footTotal = this.footTotal = new FootTotal({container:"#footTotalMod"}).render(footTotalData);
        footTotal.on("submit",function(tarBtn){ //点击提交订单按钮时
            that.sumbitOrder(tarBtn);
        })

        if(!isHotel) {
            ticketList.on("change",function(data){ 
                footTotal.render(data);
                if(needID==2) contact.renderTouristList(data.count);
            });
        }

        
        var contact = this.contact = new Contact({container : "#contactMode"}).render(data);
        //初始化时
        if(needID==2){
            if(isHotel){
                contact.renderTouristList(1);
            }else{
                contact.renderTouristList(footTotalData.count);
            }
        }


        skuInfo.on("change:beginDate",function(data){ //非酒店、演出类产品，切换开始时间时
            ticketList.refresh(data);
        });
        skuInfo.on("change:changci",function(data){ //演出类产品，切换场次时
            if(PFT.Util.isArray(data) && data.length==0){ //无场次按排
                ticketList.refresh("disable");
            }else{
                ticketList.refresh(data);
            }
        });


        skuInfo.on("change:hotel",function(data){//酒店类，价格库存变化时或预订的房间数变化时
            footTotal.render({
                ls : data.ls,
                canOrder : data.canOrder
            });
            if(needID==2) contact.renderTouristList(data.count);
        });
        

    },
    sumbitOrder : function(submitBtn){
        var idCard = "341102198201244153"; //测试身份证
        var pType = this.pType;
        var skuData = this.skuInfo.getSubmitData();
        var ticketListData = {};
        if(pType!=="C") ticketListData = this.ticketList.getSubmitData();

        var contactData = this.contact.getData();

        var paymode = this.payType.getSubmitData();

        if(!contactData) return false;

        var submitData = $.extend({},Common.getPidAid(),skuData,ticketListData,contactData,paymode);
        
        var orignText = submitBtn.text();

        PFT.Util.Ajax("formSubmit_v01.php",{
            type : "post",
            params : submitData,
            loading : function(){ submitBtn.text("请稍后..").addClass("disable")},
            complete : function(){ submitBtn.text(orignText).removeClass("disable")},
            success : function(res){
                var status = res.status;
                var msg = res.msg || PFT.AJAX_ERROR_TEXT;
                if(status=="success"){
                    Message.alert("订单提交成功");
                }else{
                    Message.error(msg);
                }
            },
            tiemout : function(){ Message.error(PFT.AJAX_TIMEOUT_TEXT)},
            serverError : function(){ Message.error(PFT.AJAX_ERROR_TEXT)}
        })
    }
});


$(function(){
    new Main();
})
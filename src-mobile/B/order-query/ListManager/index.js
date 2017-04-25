require("./index.scss");
var Common = require("../common.js");
var Util = PFT.Util;
var List = require("./list");
var ListManager = Util.Class({
    container : "#listManagerMod",
    staticProp : {
        //订单状态 0未使用，1已使用，2已过期（终端4）, 3被取消（终端2）, 4被替代,5被终端修改,6被终端撤销,7部分使用，9被删除', -1 不限
        status : PFT.Config.orderStatus,
        tabItem : [{
            status : "-1",
            text : "全部"
        },{
            status : "0",
            text : "未验证"
        },{
            status : "7",
            text : "部分验证"
        },{
            status : "1",
            text : "已验证"
        },{
            status : "3",
            text : "已取消"
        },{
            status : "2",
            text : "已过期"
        }]
    },
    state : {},
    list : {},
    init : function(){
        this.renderTab();
        this.renderPannel();
    },
    getState : function(prop){
        return this.state[prop];
    },
    setState : function(prop,val){
        this.state[prop] = val;
        return this;
    },
    switchTab : function(status){
        if(typeof status!=="string") return cosnole.error("status必须是string");
        var list = this.list;
        $("#tabPannel_"+status).show().siblings().hide();
        if(!list[status]){
            list[status] = new List({container:"#tabPannel_"+status,status:status});
            list[status].refresh();
        }
    },
    renderTab : function(){
        var tabs = this.staticProp.tabItem;
        var html = "";
        Common.forEach(tabs,function(item,index){
            var status = item.status;
            var text = item.text;
            html += '<li id="tabItem_'+status+'" data-status="'+status+'" class="tabItem tabItem_'+status+'">'+text+'</li>';
        },this);
        $("#tabHeadMod").html(html);
        return this;
    },
    renderPannel : function(){
        var tabs = this.staticProp.tabItem;
        var html = "";
        Common.forEach(tabs,function(item,index){
            var status = item.status;
            var text = item.text;
            html += '<ul id="tabPannel_'+status+'" data-status="'+status+'" class="tabPannel tabPannel_'+status+'"></ul>';
        },this);
        $("#listManagerMod").html(html);
        return this;
    }
});


module.exports = ListManager;
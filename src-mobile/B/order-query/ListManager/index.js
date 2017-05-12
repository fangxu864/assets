require("./index.scss");
var Common = require("../common.js");
var Util = PFT.Util;
var List = require("./list");
var ListManager = Util.Class({
    container : "#listManagerMod",
    state : {},
    list : {},
    init : function(){
        this.renderPannel();
    },
    getState : function(prop){
        return this.state[prop];
    },
    setState : function(prop,val){
        this.state[prop] = val;
        return this;
    },
    //再判断与上一次更新的params参数是否一致，一致则不fetch
    isParamsEquel : function(status,params){
        var isEqel = true;
        var list = this.list[status];
        if(!list) return false;
        var old_params = this.paramsToString(list.getParams());
        var new_params = this.paramsToString(params||{});
        return old_params===new_params;
    },
    paramsToString : function(params){
        if(!Common.isObject(params)) return false;
        var result = []; 
        Common.forEach(params,function(item,index){
            if(index!=="status") result.push(index+"="+item);
        })
        return result.join("&");
    },
    renderPannel : function(){
        var tabs = Common.tabItem;
        var html = "";
        Common.forEach(tabs,function(item,index){
            var status = item.status;
            var text = item.text;
            html += '<ul id="tabPannel_'+status+'" data-status="'+status+'" class="tabPannel tabPannel_'+status+'"></ul>';
        },this);
        $("#listManagerMod").html(html);
        return this;
    },


    //====================================
    //对外暴露以下3个方法
    switchStatus : function(params){
        var status = params.status;
        var list = this.list[status];
        $("#tabPannel_"+status).show().siblings().hide();
        if(!list){ //如果该list还没有被初始化
            list = this.list[status] = new List({container:"#tabPannel_"+status,status:status});
            list.refresh(params);
        }else{ 
            //如果已经初始化list了 并且上一次的params与此次的params不同，则刷新
            // if(!this.isParamsEquel(status,params)){
            //     this.refresh(params);
            // }
            this.refresh(params);
        }
        this.setMarginTop();
    },
    refresh : function(params){
        var status = params.status;
        var list = this.list[status];
        list.refresh(params);
        this.setMarginTop();
    },
    setMarginTop : function(top){
        if(typeof top!=="number") top = $("#topFixedMod").height();
        this.container.css({marginTop:top});
    }
});


module.exports = ListManager;
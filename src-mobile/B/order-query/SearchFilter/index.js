var Util = PFT.Util;
var Common = require("../common.js");
var SearchPoper = require("./Poper_New");
var SearchFilter = Util.Class({
    container : "#topFixedMod",
    EVENTS : {
        "click #tabHeadMod .tabItem" : "onTabItemClick",
        "click #searchFilterMod .removeBtn" : "onRemoveFlag",
        "click #searchFilterMod .searchBtn" : "onSearchBtnClick"
    },
    init : function(){
        var that = this;
        this.renderTab();
        this.Poper = new SearchPoper();
        this.Poper.on("search",function(data){
            that.renderSearchParamsToTop(data);
            that.trigger("change:search",that.getSearchParams());
        })
        this.Poper.on("reset",function(data){
            that.renderSearchParamsToTop("");
            that.trigger("change:search",that.getSearchParams());
        })
        this.Poper.on("remove:param",function(){
            that.trigger("change:search",that.getSearchParams());
        })
    },
    //切换标签
    onTabItemClick : function(e){
        var tarItem = $(e.currentTarget);
        if(tarItem.hasClass("active")) return false;
        tarItem.addClass("active").siblings().removeClass("active");
        this.trigger("change:tab",this.getSearchParams());
    },
    //删除搜索项
    onRemoveFlag : function(e){
        var tarBtn = $(e.currentTarget);
        var flag = tarBtn.parents(".flag");
        var siblingsCount = flag.siblings().length;
        var searchFilterMod = $("#searchFilterMod");
        var field = flag.attr("data-paramtype");
        flag.remove();
        if(siblingsCount==0) searchFilterMod.addClass("empty");
        this.Poper.removeCurSearchParam(field);
    },
    //点击搜索按钮，弹出搜索poper
    onSearchBtnClick : function(e){
        this.Poper.open();
    },
    renderTab : function(){
        var tabs = Common.tabItem;
        var html = "";
        Common.forEach(tabs,function(item,index){
            var status = item.status;
            var text = item.text;
            html += '<li id="tabItem_'+status+'" data-status="'+status+'" class="tabItem tabItem_'+status+'">'+text+'</li>';
        },this);
        $("#tabHeadMod").html(html);
        return this;
    },
    renderSearchParamsToTop : function(params){
        var html = "";
        var dateType = params.date_type;
        var dateTypeText = Common.dateType_Text[dateType] || "";
        var conBox = $("#searchFilterMod").find(".con");
        if(!params) return conBox.html("");
        params["date_text"] = dateTypeText;
        html += '<div data-paramtype="date" class="flag row">'
        html += '   <div class="flagCon">'+params.date_text+'：'+params.begin_date+' - '+params.end_date+'</div>'
        html += '   <span class="removeBtn"><i>×</i></span>'
        html += '</div>';
        conBox.html(html);
    },
    getCurStatus : function(){
        return $("#tabHeadMod").children(".active").attr("data-status");
    },
    getSearchParams : function(){
        var params = this.Poper.getSearchParams();
        params["status"] = this.getCurStatus();
        return params;
    }
});

module.exports = SearchFilter;
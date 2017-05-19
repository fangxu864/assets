require("./index.scss");
var Util = PFT.Util;
var DatePicker = require("COMMON/Components/Datepicker/v0.1");
var CalendarCore = DatePicker.CalendarCore;

var Common = require("../common.js");

var Filter = Util.Class({
    container : "#filterContainer",
    EVENTS : {
        "click .timeInp" : "onTimeInpClick",
        "click #searchBtn" : "onSearchBtnClick",
        "click .clearDateBtn" : "onClearDateBtnClick",
        "click .quickDate" : "onQuickDateClick"
    },
    state : {
        params : {
            begin_time : "",    //发布时间
            end_time : "",      //发布时间
            msg_type : "-1",    //消息类型[-1不限]
            status : "-1",      //消息状态[-1不限]
            now_id : "",        //当前页末条ID
            size : 10,          //每页条数
            title : ""          //消息名称
        }
    },
    init : function(){
        this.searchBtn = this.container.find(".searchBtn");
        this.msgTypeSelect = this.container.find(".msgTypeSelect");
        this.msgStatusSelect = this.container.find(".msgStatusSelect");
        this.beginTimeInp = this.container.find(".beginTimeInp");
        this.endTimeInp = this.container.find(".endTimeInp");
        var datepicker = this.datepicker = new DatePicker();

        this.initMsgTypeSelect();
        this.initStatusSelect();

    },
    onTimeInpClick : function(e){
        var tarInp = $(e.currentTarget);
        var date = $.trim(tarInp.val());
        this.datepicker.show(date,{
            picker : tarInp
        })
    },
    onSearchBtnClick : function(e){
        var tarBtn = $(e.currentTarget);
        if(tarBtn.hasClass("disable")) return false;
        this.refresh();
        this.trigger("search",this.getParams());
    },
    onClearDateBtnClick : function(e){
        this.beginTimeInp.text("");
        this.endTimeInp.text("");
    },
    onQuickDateClick : function(e){
        var tarBtn = $(e.currentTarget);
        var beginTime = "";
        var endTime = "";
        if(tarBtn.hasClass("yestoday")){
            beginTime = CalendarCore.prevDay();
            endTime = CalendarCore.prevDay();
        }else if(tarBtn.hasClass("today")){
            beginTime = CalendarCore.gettoday();
            endTime = CalendarCore.gettoday();
        }else if(tarBtn.hasClass("lastWeek")){
            endTime = CalendarCore.gettoday();
            beginTime = CalendarCore.prevDays(endTime,7);
            beginTime = beginTime[beginTime.length-1];
        }else if(tarBtn.hasClass("lastMonth")){
            endTime = CalendarCore.gettoday();
            beginTime = CalendarCore.prevDays(endTime,30);
            beginTime = beginTime[beginTime.length-1];
        }else if(tarBtn.hasClass("lastThreeMonth")){
            endTime = CalendarCore.gettoday();
            beginTime = CalendarCore.prevDays(endTime,90);
            beginTime = beginTime[beginTime.length-1];
        }

        this.beginTimeInp.text(beginTime);
        this.endTimeInp.text(endTime);

    },
    //初始化消息类型select
    initMsgTypeSelect : function(){
        var types = Common.msgType;
        var html = "";
        for(var i=0; i<types.length; i++){
            var type = types[i];
            var val = type.val;
            var text = type.text;
            html += '<option value="'+val+'">'+text+'</option>';
        }
        this.msgTypeSelect.html(html);
    },
    //初始化状态select
    initStatusSelect : function(){
        var status = Common.msgStatus;
        var html = "";
        for(var i=0; i<status.length; i++){
            var s = status[i];
            var val = s.val;
            var text = s.text;
            html += '<option value="'+val+'">'+text+'</option>';
        }
        this.msgStatusSelect.html(html);
    },
    refresh : function(){
        var params = this.state.params;
        var begin_time = $("#beginTimeInp").text();
        var end_time = $("#endTimeInp").text();
        var title = $("#msgNameInp").val();
        var msg_type = $("#msgTypeSelect").val();
        var status = $("#msgStatusSelect").val();
        var now_id = "";

        this.setParams("begin_time",begin_time);
        this.setParams("end_time",end_time);
        this.setParams("title",title);
        this.setParams("msg_type",msg_type);
        this.setParams("status",status);
        this.setParams("now_id",now_id);

    },
    setLoading : function(loading){
        if(!Util.isBoolean(loading)) return false;
        this.state.isLoading = loading;
        loading ? this.searchBtn.addClass("disable") : this.searchBtn.removeClass("disable");
    },
    setParams : function(key,val){
        var params = this.state.params;
        if(!Util.isUndefined(params[key]) && !Util.isUndefined(val)){
            params[key] = val;
        } 
    },
    getParams : function(){
        var p = this.state.params;
        var result = {};
        for(var i in p) result[i] = p[i];
        return result;
    }
});

module.exports = Filter;
require("./index.scss");
var Common = require("../../common.js");
var Util = PFT.Util;
var Model = require("pft-ui-component/Mb_Model");
var CalendarCore = require("COMMON/js/calendarCore.js");

var Tpl = require("./index.xtpl");

var Poper = Util.Class({
    init : function(opt){
        //初始化页面时，默认选中今天
        var today = this.getBeginEndTime("1");
        this.params = {
            begin_date : today.begin,
            end_date : today.end,
            date_type : "0"
        }
    },
    onDateFlagClick : function(e){
        var tarFlag = $(e.currentTarget);
        var dateFlag = tarFlag.attr("data-date");
        var params = this.params;
        var dateRange = $("#dateRange");
        if(tarFlag.hasClass("active")) return false;
        tarFlag.addClass("active").siblings().removeClass("active");
        var beginEnd = null;
        if(dateFlag!=4){ //如果不是自定义
            beginEnd = this.getBeginEndTime(dateFlag);
            params.begin_date = beginEnd.begin;
            params.end_date = beginEnd.end;
            dateRange.hide();
        }else{ //自定义日期
            dateRange.show();
        }
    },
    onSearchBtnClick : function(e){
        this.close();
        this.trigger("search",this.getSearchParams());
    },
    getBeginEndTime : function(type){ 
        // type = 1   => 今天
        // type = 2   => 昨天
        // type = 3   => 近7天
        var begin_date = "";
        var end_date = "";
        var str = " ";
        var beginTime = "00:00";
        var endTime = "23:59";
        var today,yestoday;
        if(type=="1"){ //今天
            today = CalendarCore.gettoday();
            begin_date = today + str + beginTime;
            end_date = today + str + endTime;
        }else if(type=="2"){ //昨天
            yestoday = CalendarCore.prevDay();
            begin_date = yestoday + str + beginTime;
            end_date = yestoday + str + endTime;
        }else if(type=="3"){ //近7天
            var weekDays = CalendarCore.prevDays(CalendarCore.gettoday(),6,true);
            begin_date = weekDays[6] + str + beginTime;
            end_date = weekDays[0] + str + endTime;
        }
        return{
            begin : begin_date,
            end : end_date
        }
    },
    initModel : function(){
        var that = this;
        this.model = new Model({
            height : "100%",
            speed : 200,
            content : Tpl,
            cache : true,
            EVENTS : {
                "click .btnCancel" : function(e){
                    that.close();
                },
                "click .quickSelectDate .dateFlag" : function(e){
                    that.onDateFlagClick(e)
                },
                "click .btnSearch" : function(e){
                    that.onSearchBtnClick(e)
                },
                "click .btnClear" : function(e){
                    that.resetParams();
                }
            },
            onOpenBefore : function(){
                that.trigger("open:before");
            },
            onOpenAfter : function(){
                that.trigger("open:after");
            },
            onCloseBefore : function(){
                that.trigger("close:before");
            },
            onCloseAfter : function(){
                that.trigger("close:after");
            }
        })
    },
    getSearchParams : function(){
        var result = {};
        Common.forEach(this.params,function(item,index){
            result[index] = item;
        });
        return result;
    },
    //重置搜索
    resetParams : function(){
        var today = this.getBeginEndTime("1");
        this.params = {
            begin_date : today.begin,
            end_date : today.end,
            date_type : "0"
        }
        this.close();
        this.trigger("reset",this.getSearchParams());
    },
    //移除某一项搜索
    removeCurSearchParam : function(field){
        if(field=="date"){ //重置日期到默认
            $("#quickSelectDateWrap").children().first().trigger("click");
            this.params.date_type = "0"
        }
        this.trigger("remove:param");
    },
    open : function(){
        var that = this;
        if(!this.model) this.initModel();
        this.model.open();
    },
    close : function(){
        this.model.close();
    }
});

module.exports = Poper;



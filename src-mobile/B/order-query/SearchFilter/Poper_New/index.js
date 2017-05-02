require("./index.scss");
var Common = require("../../common.js");
var Util = PFT.Util;
var Model = require("pft-ui-component/Mb_Model");
var Mobiscroll = require("./mobiscroll.js");
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
        var beginInp = $("#beginDatetime");
        var endInp = $("#endDatetime");
        if(tarFlag.hasClass("active")) return false;
        tarFlag.addClass("active").siblings().removeClass("active");
        var beginEnd = null;
        if(dateFlag!=4){ //如果不是自定义
            beginEnd = this.getBeginEndTime(dateFlag);
            
            beginInp.val(beginEnd.begin);
            endInp.val(beginEnd.end);
            dateRange.hide();
        }else{ //自定义日期
            dateRange.show();
            if(!beginInp.val() || !endInp.val()){
                beginEnd = this.getBeginEndTime("1");
                beginInp.val(beginEnd.begin);
                endInp.val(beginEnd.end);
            }
        }
        params.begin_date = beginInp.val();
        params.end_date = endInp.val();
    },
    onSearchBtnClick : function(e){
        this.close();
        this.trigger("search",this.getSearchParams());
    },
    //点击修改时间类型
    onDateTypeLabelClick : function(e){
        var that = this;
        if(!this.TimeTypePoper){
            this.TimeTypePoper = new Model({
                cache : false,
                speed : 150,
                content : function(){
                    var html = "";
                    var dateTypeText = Common.dateType_Text;
                    html += '<div class="dateTypeModel"><ul>';
                    Common.forEach(dateTypeText,function(item,index){
                        html += '<li class="actionItem actionItem_'+index+'" data-type='+index+'>'+item+'</li>';
                    })
                    html += '</ul>';
                    html += '<div class="cancelBtn">取消</div></div>';
                    return html;
                },
                EVENTS : {
                    "click .actionItem" : function(e){
                        var tarAction = $(e.currentTarget);
                        var type = tarAction.attr("data-type");
                        var typeName = tarAction.text();
                        if(tarAction.hasClass("active")) return this.close();
                        tarAction.addClass("active").siblings().removeClass("active");
                        that.params.date_type = type;
                        $("#dateTypeLabelText").text(typeName);
                        this.close();
                    },
                    "click .cancelBtn" : function(e){
                        this.close();
                    }
                },
                onOpenAfter : function(){
                    var curDateType = that.params.date_type;
                    this.model.find(".actionItem_"+curDateType).addClass("active").siblings().removeClass("active");
                }
            })
        }
        this.TimeTypePoper.open();
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
                },
                "click #dateTypeLabel" : function(e){
                    that.onDateTypeLabelClick(e); //点击修改时间类型
                }
                // "click #beginDatetime" : function(e){
                //     that.onBeginDateTimeClick(e);
                // },
                // "click #endDatetime" : function(e){
                //     that.onEndDateTimeClick(e);
                // }
            },
            onOpenBefore : function(){
                that.trigger("open:before");
            },
            onOpenAfter : function(){
                if(!that.MobiScrollBegin){
                    that.MobiScrollBegin = Mobiscroll.datetime("#beginDatetime",{
                        theme: 'ios',
                        display: 'bottom',
                        lang: 'zh',
                        onSet: function( event, inst ) {
                            var input_val = event.valueText;
                            input_val = input_val.replace(/[T]/, ' ');
                            input_val = input_val.replace(/:00Z/, '');
                            $("#beginDatetime").val( input_val );
                            that.params.begin_date = input_val;
                        },
                        onShow : function(event,inst){
                            var begin = (function(dateTime){
                                var date = dateTime.split(" ")[0].split("-");
                                var time = dateTime.split(" ")[1].split(":");
                                var year = date[0] * 1;
                                var month = date[1] * 1 - 1;
                                var day = date[2] * 1;
                                var hour = time[0] * 1;
                                var minus = time[1] * 1;
                                var second = 0;
                                return{
                                    year : year,
                                    month : month,
                                    day : day,
                                    hour : hour,
                                    minus : minus,
                                    second : second
                                }
                            })($("#beginDatetime").val());
                            inst.setArrayVal([begin.year,begin.month,begin.day,begin.hour,begin.minus]);
                        }
                    });
                }
                if(!that.MobiScrollEnd){
                    that.MobiScrollBegin = Mobiscroll.datetime("#endDatetime",{
                        theme: 'ios',
                        display: 'bottom',
                        lang: 'zh',
                        onSet: function( event, inst ) {
                            var input_val = event.valueText;
                            input_val = input_val.replace(/[T]/, ' ');
                            input_val = input_val.replace(/:00Z/, '');
                            $("#endDatetime").val( input_val );
                            that.params.end_date = input_val;
                        },
                        onShow : function(event,inst){
                            var end = (function(dateTime){
                                var date = dateTime.split(" ")[0].split("-");
                                var time = dateTime.split(" ")[1].split(":");
                                var year = date[0] * 1;
                                var month = date[1] * 1 - 1;
                                var day = date[2] * 1;
                                var hour = time[0] * 1;
                                var minus = time[1] * 1;
                                var second = 0;
                                return{
                                    year : year,
                                    month : month,
                                    day : day,
                                    hour : hour,
                                    minus : minus,
                                    second : second
                                }
                            })($("#endDatetime").val());
                            inst.setArrayVal([end.year,end.month,end.day,end.hour,end.minus]);
                        }
                    });
                }
                
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
        return Common.clone(this.params,true);
    },
    //重置搜索
    resetParams : function(){
        var today = this.getBeginEndTime("1");
        this.params = {
            begin_date : today.begin,
            end_date : today.end,
            date_type : "0"
        }
        $("#dateTypeLabelText").text(Common.dateType_Text[this.params.date_type]);
        $("#quickSelectDateWrap").children().first().trigger("click");
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



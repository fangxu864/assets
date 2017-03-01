require("./index.scss");
var IndexTpl = require("./index.xtpl");
var Datepicker = require("COMMON/modules/datepicker");
var Query_CarList = require("SERVICE/MemcardReg/Query_car_list");
var Filter = PFT.Util.Class({
    container : "#filterHeader",
    EVENTS : {
        "click .tabItem" : "onTabItemClick",
        "click .timeInp" : "onTimeInpClick",
        "click .searchBtn" : "onSearchBtnClick",
        "click .exportBtn" : "onExportBtnClick"
    },
    init : function(){
        var that = this;
        this.container.html(IndexTpl);
        this.paramContainer = $("#paramContainer");
        this.tabHeader = $("#tabHeader");

        //初始化一个日历插件
        this.datepicker = new Datepicker();

        this.initCarType();

        setTimeout(function(){
            that.tabHeader.children().first().trigger("click");
        },100)
        

    },
    onTabItemClick : function(e){

        var searchBtn = $("#searchBtn");

        var tarItem = $(e.currentTarget);
        var paramContainer = this.paramContainer;
        if(tarItem.hasClass("active")) return false;
        tarItem.addClass("active").siblings().removeClass("active");
        var normalLine = paramContainer.children(".normalLine");
        var carTypeLine = paramContainer.children(".carTypeLine");
        var unuseLine = paramContainer.children(".unuseLine");
        var status = tarItem.attr("data-status");
        if(status=="" || status=="0"){ //全部，正常这两个状态  需要添加车辆信息参数搜索
            normalLine.show();
            carTypeLine.show();
            unuseLine.hide();
        }else if(status=="4"){ //未使用状态  需要添加未使用天数搜索
            normalLine.hide();
            carTypeLine.hide();
            unuseLine.show();
        }else{
            normalLine.show();
            carTypeLine.hide();
            unuseLine.hide();
        }


        $("#searchBtn").trigger("click");

    },
    onExportBtnClick : function(e){
        e.preventDefault();
        var params = this.getParams();
        var errorMsg = this.validateParams(params);
        if(errorMsg) return alert(errorMsg);
        var link = this.getExportLink(params);
        window.open(link,"_blank");
    },
    onSearchBtnClick : function(e){
        var params = this.getParams();

        var searchBtn = $("#searchBtn");
        if(searchBtn.hasClass("disable")) return false;

        var errorMsg = this.validateParams(params);

        if(errorMsg) return alert(errorMsg);

        this.trigger("search",params);
    },
    onTimeInpClick : function(e){
        var datepicker = this.datepicker;
        var tarInp = $(e.currentTarget);
        var CalendarCore = Datepicker.CalendarCore;
        var date = tarInp.val();
        var time = tarInp.hasClass("begin") ? "00" : "23";
        if(!date){
            date = CalendarCore.gettoday() + " " + time;
        }
        datepicker.show(date,{
            picker : tarInp,              //必选
            top : 0,                     //可选，相对偏移量
            left : 0,                    //可选，相对偏移量
            todayBeforeDisable : false,  //可选，今天之前的日期都不显示
            todayAfterDisable : false    //可选，今天之后的日期都不显示
        })
    },
    //判断搜索条件是否违规，比如，设置开始时间晚于结束时间，设置搜索天数为一个非整数或负数等
    validateParams : function(params){
        var beginTime = params.begin;
        var endTime = params.end;
        if(params.status==4 && params.days!=="" && !PFT.Util.Validate.typeInit(params.days)) return "未使用天数，请输入正整数";
        if(beginTime && endTime){
            var beginDate = beginTime.substring(0,10);
            var endDate = endTime.substring(0,10);
            var beginHour = beginTime.substring(11,13);
            var endHour = endTime.substring(11,13);
            var beginStr = new Date(beginDate).getTime();
            var endStr = new Date(endDate).getTime()
            if(beginStr>endStr){
                return "起始时间不能晚于截止时间";
            }else if((beginStr>endStr) && (beginHour>endHour)){
                return "起始时间不能晚于截止时间";
            }else if((beginStr==endStr) && (beginHour==endHour)){
                return "起始时间不能与截止时间相等";
            }
        }
    },
    getExportLink : function(params){
        var exportLink = "/mcard_list.html?act=loadExcel&";
        var params = params || this.getParams();
        var paramsArr = [];
        for(var i in params) paramsArr.push(i+"="+params[i]);

        return exportLink + paramsArr.join("&");

    },
    initCarType : function(){
        var carSelect = $("#carTypeSelect");
        Query_CarList({
			debug : false,
			cxt : this,
			loading : function(){},
			complete : function(){ 
				$("#carTypeSelect").html("");
			},
			success : function(data){
				var option = "";
				for(var i=0, len=data.length; i<len; i++){
					var car = data[i];
					option += '<option value="'+car.type+'">'+car.name+'</option>';
				}
				carSelect.html(option);
			},
			error : function(code,msg){
				alert(msg);
			}
		})
    },
    getParams : function(){
        var paramContainer = this.paramContainer;
        var status = this.tabHeader.children(".active").attr("data-status");
        var keyword = $.trim($("#dnameInp").val());
        var beginTime = $("#beginTimeInp").val();
        var endTime = $("#endTimeInp").val();
        var unuseBeginTime = $("#unuseBeginTimeInp").val();
        var unuseEndTime = $("#unuseEndTimeInp").val();
        var params = {
            status : status,
            keyword : keyword,
            begin : status!=4 ? beginTime : unuseBeginTime,
            end : status!=4 ? endTime : unuseEndTime
        };

        if(status=="" || status=="0"){ //全部，正常这两个状态  需要添加车辆信息参数搜索
            params["car_type"] = $("#carTypeSelect").val() || "0";  //默认请求5座的 值为0
        }else if(status=="4"){ //未使用状态  需要添加未使用天数搜索
            params["days"] = $.trim($("#unuseDayInp").val());
        }

        return params;

    }
});

module.exports = Filter;
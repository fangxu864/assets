require("./index.scss");
var Tpl = require("./index.xtpl");

//通用消息组件
var Message = require("pft-ui-component/Message");

//通用逻辑方法
var Common = require("../../common.js");

//日历组件
var Datepicker = require("../../Common/Datepicker");
var CalendarCore = Datepicker.CalendarCore;
var datepicker = new Datepicker();

//演出类场次选择模块
var ChangciSelect = require("./changciSelect");

//酒店类产品，根据入店时间与离店时间，算出中间每一天的价格 库存
var HotelDateList = require("./hotelDateList");

//非演出、酒店类产品 根据date请求天的价格及库存
var Ajax_GetPriceStorageByDate = require("SERVICE/order-booking/getPriceStorageByDate");

//酒店类产品 根据入店时间 离店时间，请求库存价格
var Ajax_getPriceStorageByDate_Hotel = require("SERVICE/order-booking/getPriceStorageByDate_hotel");


//通用数字精度控制方法
var numberToFixed = PFT.Util.numberToFixed;

var SukInfo = PFT.Util.Class({
    EVENTS : {
        "click #beginTimeInput" : "onDatepickerInputClick",
        "click #iShowBeginTimeInp" : "onShowBeginTimeInpClick",
        "click #hotelendTimeInp" : "onHotelEndTimeInpClick",
        "change #c_orderCountSelect" : "onHotelRoomSelectChange"
    },
    template : PFT.Util.ParseTemplate(Tpl),
    init : function(opt){
        var that = this;
        var p_type = opt.data.p_type;
        var pidAid = Common.getPidAid();
        var startDate = opt.data.startDate;
        this.data = opt.data;
        this.render(this.data);
        if(p_type=="H"){//演出类产品时，引入场次选择模块
            //为什么是取数组的第一项，因为演出类产品不能下联票，
            //所以返回的数据里，tickets数组任何时候只能有1个item
            var zoneId = this.data.tickets[0].zoneId;
            //zoneId==0 代表该票没绑定分区，即为站票， 站票库存规定是不限的
            var storage = zoneId==0 ? -1 : data.area_storage[zoneId];
            var pid = this.data.tickets[0].pid;
            var changciSelect = this.changciSelect = new ChangciSelect(this.data);
            changciSelect.on("change",function(data){ //当场次切换时
                $("#iShowBeginTimeInp").val(data.bt+"-"+data.et).attr("data-roundid",data.roundId);
                if(data.js==-1 && data.ls==-1) return false;
                var _d = {
                    ls : data.ls,
                    js : data.js,
                    storage : storage
                };
                var params = {};
                params[pid] = _d;
                that.trigger("change:changci",params);
            })
            changciSelect.on("empty",function(){
                $("#iShowBeginTimeInp").val("该日期暂无场次安排");
                that.trigger("change:changci",[]);
            })
        }

        //初始化时也发一次请求，查询默认时间的价格库存
        if(p_type=="C") this.getPriceStorageByDate_Hotel(Common.getPidAid().pid,Common.getPidAid().aid,startDate,CalendarCore.nextDay(startDate));

        datepicker.on("datePick",function(data){
            console.log(data);
            var tarInp = data.relyInp;
            var date = data.pickDate || "";
            if(p_type!=="H" && p_type!=="C"){ //非演出酒店类，需要发ajax取storage跟price
                Ajax_GetPriceStorageByDate({
                    pids : that.getPids(),
                    aid : Common.getPidAid().aid,
                    date : date
                },{
                    debug : false,
                    success : function(data){
                        that.trigger("change:beginDate",data);
                    },
                    fail : function(msg,code){
                        Message.alert(msg+"，错误代码："+code);
                    },
                    timeout : function(data){ Message.error(PFT.AJAX_TIMEOUT_TEXT)},
                    serverError : function(data){ Message.error(PFT.AJAX_ERROR_TEXT)}
                });
            }else if(p_type=="H"){ //演出类
                changciSelect.refresh(pidAid.pid,pidAid.aid,date,{ls:data.ls*100,js:data.js*100});
            }else if(p_type=="C"){ //酒店类
                var beginInput = $("#beginTimeInput");
                var endInp = $("#hotelendTimeInp");
                var beginDate = $.trim(beginInput.val());
                var beginDateStr = new Date(beginDate).getTime();
                var endDate = $.trim(endInp.val());
                var endDateStr = new Date(endDate).getTime();
                if(tarInp.hasClass("begin")){ //切换的是开始时间
                    if(beginDateStr>=endDateStr){ //如果入住时间比离店时间晚(包括入住时间==离店时间)，那离店时间需要自动往后推，推到比入住时间晚一天
                        endDate = Datepicker.CalendarCore.nextDay(beginDate);
                        endInp.val(endDate);
                    }
                }
                var ids = Common.getPidAid();
                that.getPriceStorageByDate_Hotel(ids.pid,ids.aid,beginDate,endDate);
            }
        })
    },
    getPids : function(){
        var tickets = this.data.tickets;
        var pids = [];
        for(var i=0,len=tickets.length; i<len; i++){
            var pid = tickets[i]["pid"];
            pids.push(pid);
        }
        return pids.join(",")
    },
    getDayCount : function(beginDate,endDate){
        var daycount = new Date(endDate).getTime() - new Date(beginDate).getTime();
        daycount = daycount / (24 * 60 *60 * 1000);
        return daycount;
    },
    /**
     * 酒店类产品  根据入住时间，离店时间，ajax请求该时间段内的价格库存
     */
    getPriceStorageByDate_Hotel : function(pid,aid,beginDate,endDate){
        var that = this;
        if(!pid) return console.error("missing pid");
        if(!aid) return console.error("missing aid");
        if(!beginDate) return console.error("missing beginDate");
        if(!endDate) return console.error("missing endDate");
        Ajax_getPriceStorageByDate_Hotel({
            pid : pid,
            aid : aid,
            beginDate : beginDate,
            endDate : endDate
        },{
            loading : function(){},
            complete : function(){},
            success : function(data){
                var dayCount = that.getDayCount(beginDate,endDate);
                for(var i in data){
                    var item = data[i];
                    var ls = item.ls / 100;
                    var js = item.js / 100;
                    var store = item.store==-1 ? "不限" : item.store;
                    item["ls"] = ls;
                    item["js"] = js;
                    item["store"] = store;
                }
                HotelDateList.render({
                    container : $("#hotelDateListContainer"),
                    data : data
                });
                that.trigger("change:hotel",that.getTotalInfo_Hotel(data));
            },
            fail : function(msg,code){ Message.error(msg+"，错误代码："+code)},
            timeout : function(){ Message.error(PFT.AJAX_TIMEOUT_TEXT)},
            serverError : function(){ Message.error(PFT.AJAX_ERROR_TEXT)}
        })
    },
    /**
     * 根据一段时间内的日期，计算价格，库存总和
     * data = {
     *      "2017-04-13" : {
     *          js : 10,      //前端需要除100 转化为元
     *          ls : 10,
     *          storage : 10
     *      }
     * }
     */
    getTotalInfo_Hotel : function(data){
        var js=0,ls=0,storage=0;
        var count = $("#c_orderCountSelect").val() * 1;
        for(var i in data){
            var item = data[i];
            var _js = item.js * count;
            var _ls = item.ls * count;
            var _storage = item.store;
            js = js + _js;
            ls = ls +  _ls;
            if(_storage=-1){
                storage = _storage;
            }else{
                 storage += _storage;
            }
        }
        var result = {
            ls : numberToFixed(String(ls),2),
            js : numberToFixed(String(js),2),
            count : count,
            storage : typeof storage=="undefined" ? -1 : storage,
            canOrder : storage==0 ? false : true 
        };
        return result;
    },
    onShowBeginTimeInpClick : function(e){
        this.changciSelect.open();
    },
    onDatepickerInputClick : function(e){
        var that = this;
        var tarInp = $(e.currentTarget);
        var date = tarInp.val();
        var id = tarInp.attr("id");
        var pType = this.data.p_type.toUpperCase();
        datepicker.show(date,{
            relyInp: tarInp,
            min : that.data.startDate
        });
    },
    onHotelEndTimeInpClick : function(e){ //酒店类  点击离店时间input
        var tarInp = $(e.currentTarget);
        var endDate = $.trim(tarInp.val());
        var beginDate = $.trim($("#beginTimeInput").val());
        datepicker.show(endDate,{
            relyInp: tarInp,
            min : CalendarCore.nextDay(beginDate)
        });
    },
    onHotelRoomSelectChange : function(e){ //酒店类 改变房间数
        var count = $(e.currentTarget).val();
        this.trigger("change:hotel",this.getTotalInfo_Hotel(HotelDateList.getCacheData()));
    },
    getSubmitData : function(){
        var container = this.container;
        var pType = this.data.p_type;
        var result = {};

        //开始时间
        result["begintime"] = $.trim($("#beginTimeInput").val());

        if(pType=="B"){ //线路产品集合地
            result["assembly"] = $("#jiheSelect").val();
        }

        if(pType=="C"){ //酒店类
            //离店时间
            result["leavetime"] = $.trim($("#hotelendTimeInp").val());
            //房间数
            result["tnum"] = $("#c_orderCountSelect").val();
        }

        if(pType=="H"){//演出类
            result["round_id"] = $("#iShowBeginTimeInp").attr("data-roundid");
        }

        return result;

    },
    render : function(data){
        this.data = data;
        this.container.html(this.template(data));
        return this;
    }
});

module.exports = SukInfo;
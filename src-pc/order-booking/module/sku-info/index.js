require("./index.scss");
var Tpl = require("./index.xtpl");

//通用消息组件
var Message = require("pft-ui-component/Message");

var Common = require("../../common.js");

var Datepicker = require("../../Common/Datepicker");
var datepicker = new Datepicker();
var ChangciSelect = require("./changciSelect");

//非演出、酒店类产品 根据date请求天的价格及库存
var Ajax_GetPriceStorageByDate = require("SERVICE/order-booking/getPriceStorageByDate");


var SukInfo = PFT.Util.Class({
    EVENTS : {
        "click #beginTimeInput" : "onDatepickerInputClick",
        "click #iShowBeginTimeInp" : "onShowBeginTimeInpClick"
    },
    template : PFT.Util.ParseTemplate(Tpl),
    init : function(opt){
        var that = this;
        var p_type = opt.data.p_type;
        var pidAid = Common.getPidAid();
        this.data = opt.data;
        this.render(this.data);
        if(p_type=="H"){//演出类产品时，引入场次选择模块
            //为什么是取数组的第一项，因为演出类产品不能下联票，
            //所以返回的数据里，tickets数组任何时候只能有1个item
            var zoneId = this.data.tickets[0].zoneId;  
            var pid = this.data.tickets[0].pid;
            var changciSelect = this.changciSelect = new ChangciSelect(this.data);
            changciSelect.on("change",function(data){ //当场次切换时
                $("#iShowBeginTimeInp").val(data.bt+"-"+data.et);
                if(data.js==-1 && data.ls==-1) return false;
                var _d = {
                    ls : data.ls,
                    js : data.js,
                    storage : data.area_storage[zoneId]
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

        datepicker.on("datePick",function(data){
            var tarInp = data.relyInp;
            var date = data.pickDate || "";
            if(p_type!=="H" && p_type!=="C"){ //非演出酒店类，需要发ajax取storage跟price
                Ajax_GetPriceStorageByDate({
                    pids : that.getPids(),
                    aid : Common.getPidAid().aid,
                    date : date
                },{
                    debug : true,
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
    getTotalInfo_Hotel : function(){
        return null;
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
    render : function(data){
        this.data = data;
        this.container.html(this.template(data));
        return this;
    }
});

module.exports = SukInfo;
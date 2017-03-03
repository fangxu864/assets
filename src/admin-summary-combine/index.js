require("./index.scss");
var Datepicker = require("COMMON/modules/datepicker");
var Tpl=require("./tpl/index.xtpl");
var Main = PFT.Util.Class({
    container: "#bodyContainer",
    EVENTS: {
        "click .inp-date": "initDatePicker",
        "click #schBtn": "getData",
        "click #expBtn": "exportExcel"
    },
    init: function () {
        this.datepicker = new Datepicker();
    },
    initDatePicker: function (e) {
        var datepicker = this.datepicker;
        var tarInp = $(e.currentTarget);
        var CalendarCore = Datepicker.CalendarCore;
        var date = tarInp.val();
        var time = tarInp.hasClass("begin") ? "00:00" : "23:59";
        if (!date) {
            date = CalendarCore.gettoday() + " " + time;
        }
        console.log(date, CalendarCore);
        datepicker.show(date, {
            picker: tarInp,
            top: 0,
            left: 0,
        });

    },
    getData: function () {
        var _this = this;
        var beginTime = $("#beginTime").val().substr(0, 10);;
        var endTime = $("#endTime").val().substr(0, 10);
        var payUser = $("#payUser").val();
        var data;
        var beginTimeStp = _this.formatTimeStamp(beginTime);
        var endTimeStp = _this.formatTimeStamp(endTime);
        if (endTimeStp < beginTimeStp) return PFT.Util.STip("fail", "起始日期不能迟于截止日期!", 3000);
        data = {
            payUser: payUser,
            btime: beginTime,
            etime: endTime
        }
       _this.getDataReq(data);
    },
    getDataReq:function(data){
        var _this=this,
            tbody=$("#tbody"),
            loadTxt="<tr><td colspan='9'><img src=\"http://www.12301.cc/images/icons/gloading.gif\" class='loadImg'/>  加载中,请稍后...</td></tr>";
         PFT.Util.Ajax('/r',{
            type:"POST",
            dataType:"json",
            params:data,
            loading: function(){
                tbody.html(loadTxt);
            },
            success:function(res){
                if(res.code==200){
                    _this.renderData(res.data);
                }else{
                  tbody.html("<tr><td colspan='9'>"+res.msg+"</td></tr>");  
                }
            }
        })

    },
    renderData: function (data) {
        var html=PFT.Util.ParseTemplate(Tpl),
            render=html({data:data}),
            tbody=$("#tbody");
        tbody.html(render);
    },
    exportExcel: function () {


    },
    //日期转换时间戳
    formatTimeStamp: function (time) {
        var timestamp = Date.parse(new Date(time));
        var timestamps = timestamp / 1000;
        return timestamps;
    }

});

$(function () {
    new Main();
})
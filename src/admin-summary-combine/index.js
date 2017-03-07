require("./index.scss");
var Datepicker = require("COMMON/modules/datepicker");
var Tpl=require("./tpl/index.xtpl");
var Main = PFT.Util.Class({
    container: "#bodyContainer",
    EVENTS: {
        "click .inp-date": "initDatePicker",
        "click #schBtn": "getData",
        "click #expBtn": "getData",
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
        datepicker.show(date, {
            picker: tarInp,
            top: 0,
            left: 0,
        });

    },
    getData: function (e) {
        var _this = this;
        var tarBtn=$(e.currentTarget);
        var exp=tarBtn.attr("data-exp");
        var beginTime = $("#beginTime").val().substr(0, 10);;
        var endTime = $("#endTime").val().substr(0, 10);
        var payUser = $("#payUser").val();
        var data;
        var beginTimeStp = _this.formatTimeStamp(beginTime);
        var endTimeStp = _this.formatTimeStamp(endTime);
        if((!beginTimeStp&&endTimeStp)||(beginTimeStp&&!endTimeStp)) return PFT.Util.STip("fail","请选择准确的日期!")
        if (endTimeStp < beginTimeStp) return PFT.Util.STip("fail", "起始日期不能迟于截止日期!", 3000);
        if (endTimeStp-beginTimeStp>1209600&&exp!=1) return PFT.Util.STip("fail","时间间隔不超过15天!",3000);
        data = {
            payUser: payUser,
            btime: beginTime,
            etime: endTime
        }
        if(exp==1){
            _this.expData(data);
            return false;
        }
       _this.getDataReq(data);
    },
    getDataReq:function(data){
        var _this=this,
            tbody=$("#tbody"),
            loadTxt="<tr><td colspan='11'><img src=\"http://www.12301.cc/images/icons/gloading.gif\" class='loadImg'/>  加载中,请稍后...</td></tr>";
         PFT.Util.Ajax('/r/Admin_OnlineSummary/summary',{
            type:"POST",
            dataType:"json",
            params:data,
            loading: function(){
                tbody.html(loadTxt);
            },
            success:function(res){
                var data=res.data;
                if(res.code==200){
                  //  var fmData=_this.formatData(data);//判断差异
                  if(data.length<1){
                      return  tbody.html("<tr><td colspan='11'>暂无结果!</td></tr>")
                  }
                    _this.renderData(data);
                }else{
                  tbody.html("<tr><td colspan='11'>"+res.msg+"</td></tr>");  
                }
            },
            Servererror: function(){
                tbody.html("<tr><td colspan='11'>请求出错,请稍后再试!</td></tr>")
            }
        })

    },
   
    renderData: function (data) {
        var html=PFT.Util.ParseTemplate(Tpl),
            render=html({data:data}),
            tbody=$("#tbody");
           // console.log(render)
        tbody.html(render);
    },
     expData:function(data){
         console.log(data);
        PFT.Util.Ajax('/r/Admin_OnlineSummary/summary',{
            type:"POST",
            dataType:"json",
            params:data,
            success:function(res){
                if(res.code==200){
                    if(res.data.length<1) return  PFT.Util.STip("fail", "暂无数据!", 3000);
                    window.open('/r/Admin_OnlineSummary/summary?payUser='+data["payUser"]+'&btime='+data["btime"]+'&etime='+data["etime"]+'&excel=1', '_blank');

                }else{
                    return PFT.Util.STip("fail", res.msg, 3000);
                }
            }
        })
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
/**
 * Created by Administrator on 2016/9/12.
 */
require("./index.scss");
var moment = require('moment');
var Calendar = require("COMMON/modules/calendar");
var When=require("COMMON/js/when.js");
var when=new When();
var Select = require("COMMON/modules/select");
var tpl=require("./index.xtpl");


var TrecordCount={
    init:function () {
        var _this=this;
        $(".trecordCount_box").html(tpl)
        /*查询部分*/
        //获取元素
        this.stime_inp=$("#start_time");
        this.etime_inp=$("#end_time");
        //初始化input内容
        this.stime_inp.val(when.today());
        this.etime_inp.val(when.today());
        //日历插件部分
        var calendar = new Calendar();
        this.stime_inp.on("click",function(e){
            var max_day=_this.etime_inp.val();
            max_day=moment( Date.parse(max_day.replace(/-/g,'/'))+24 * 3600 * 1000 ).format('YYYY-MM-DD');
            calendar.show(_this.stime_inp.val(),{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
                picker : $("#start_time"),              //页面上点击某个picker弹出日历(请使用input[type=text])
                top : 0,                       //日历box偏移量
                left : 0,                     //日历box偏移量
                // min : "2016-05-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
                max : max_day,          //2016-07-10往后的日期都不可选 会自动挂上disable类名
                onBefore : function(){},     //弹出日历前callback
                onAfter : function(){}       //弹出日历后callback
            });
            return this;
        });
        this.etime_inp.on("click",function(e){
            var min_day=_this.stime_inp.val();
            // console.log(   new Date( Date.parse(min_day.replace(/-/g,'/'))-24 * 3600 * 1000 ).Format("yyyy-MM-dd")   );
            min_day=moment( Date.parse(min_day.replace(/-/g,'/'))-24 * 3600 * 1000 ).format('YYYY-MM-DD');
            calendar.show(_this.etime_inp.val(),{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
                picker : $("#end_time"),              //页面上点击某个picker弹出日历(请使用input[type=text])
                top : 0,                       //日历box偏移量
                left : 0,                     //日历box偏移量
                min : min_day,              //2016-06-20往前的日期都不可选 会自动挂上disable类名
                // max : when.today(),          //2016-07-10往后的日期都不可选 会自动挂上disable类名
                onBefore : function(){},     //弹出日历前callback
                onAfter : function(){}       //弹出日历后callback
            })
        });
        this.bind();
    },
    bind:function(){
        var _this=this;
        //时间段列表绑定事件
        $("ul.time_area").on("click","li",function () {
            var li_id=$(this).get(0).id;
            switch (li_id) {
                case "today_btn":{
                    _this.stime_inp.val(when.today());
                    _this.etime_inp.val(when.today());
                }break;
                case "yestoday_btn":{
                    _this.stime_inp.val(when.yestoday());
                    _this.etime_inp.val(when.yestoday());
                }break;
                case "thisweek_btn":{
                    _this.stime_inp.val(when.week()[0]);
                    _this.etime_inp.val(when.week()[1]);
                }break;
                case "lastweek_btn":{
                    _this.stime_inp.val(when.lastweek()[0]);
                    _this.etime_inp.val(when.lastweek()[1]);
                }break;
                case "thismonth_btn":{
                    _this.stime_inp.val(when.month()[0]);
                    _this.etime_inp.val(when.month()[1]);
                }break;
                case "lastmonth_btn":{
                    _this.stime_inp.val(when.lastmonth()[0]);
                    _this.etime_inp.val(when.lastmonth()[1]);
                }break;
                default:{
                    alert("why ???")
                }
            }
        })
        //交易商户搜索框
        var select=new Select({
            source : "/call/jh_mem.php",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
            ajaxType : "get",
            ajaxParams : {
                action : "fuzzyGetDname_c",
                dtype : "1",
                danme : ""
            },
            filterType : "ajax",  //指定过滤方式为ajax
            field : {
                id : "id",
                name : "dname",
                keyword : "dname"
            },
            trigger : $("#trader_inp"),

            filter : true,
            adaptor : function(res){
                var reslut = { code:200};
                reslut["data"] = res;
                return reslut;
            }
        });
    }

};

$(function () {
    TrecordCount.init();
});
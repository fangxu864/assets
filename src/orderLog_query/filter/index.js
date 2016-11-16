/**
 * Created by Zhengjiashen on 2016/11/14.
 */

//引入css
require("./index.scss");
//引入tpl
var filer_tpl=require("./index.xtpl");

//引入日历
var Calendar = require("COMMON/modules/calendar");
var When=require("COMMON/js/when.js");
var when=new When();



var Filter=PFT.Util.Class({
    container:"#filter_box",
    EVENTS:{
        "click #search":"getParams",   //点击搜索
        "click #export":""            //点击导出
    },

    //init()方法在实例化以后会默认执行
    init:function () {
        $("#filter_box").append(filer_tpl);

        //必填提示部分
        $("#startTime").on("focus",function(){
            $("#warn1").toggle("fast");
        }).on("blur",function () {
            $("#warn1").toggle("fast");
        });

        $("#endTime").on("focus",function(){
            $("#warn2").toggle("fast");
        }).on("blur",function () {
            $("#warn2").toggle("fast");
        });

        //日历插件部分
        var calendar = new Calendar();

        $("#startTime").on("click",function () {

            calendar.show("",{
                picker : $("#startTime"),
                top : 0,
                left : 0,
                // min : "2015-06-20",
                // max : "2017-07-10",
                onBefore : function(){},
                onAfter : function(){}
            })
        });

        $("#endTime").on("click",function () {
            calendar.show("",{
                picker : $("#endTime"),
                top : 0,
                left : 0,
                // min : "2015-06-20",
                // max : "2017-07-10",
                onBefore : function(){},
                onAfter : function(){}
            })
        })
    },
    
    //生成参数盒子
    getParams:function () {
        var _this = this;
        var paramBox = {};
        paramBox.fxname=$("#merchant").val();  //可能不存在
        paramBox.btime=$("#startTime").val();   //开始时间
        paramBox.etime=$("#endTime").val();     //结束时间
        paramBox.ordernum=$("#orderNumber").val();   //订单编号
        paramBox.ename=$("#operatePerson").val();   //操作人姓名
        paramBox.action=$("#operateType").find(':selected').val();  //操作类型
        paramBox.source=$("#operateTerminal").find(':selected').val(); //操作终端

        var Params = paramBox;


        //检测必填项
        if(!Params.btime||!Params.etime){
            if(!Params.btime){
                $("#warn1").toggle("fast");
                window.setTimeout(function () {
                    $("#warn1").toggle("fast");
                },1500)
            };

            if(!Params.etime){
                $("#warn2").toggle("fast");
                window.setTimeout(function () {
                    $("#warn2").toggle("fast");
                },1500)
            }
            return false
        }


        console.log(Params);
        //发布"更新参数"事件
        _this.trigger("refreshParams",Params);
    }
    

});

module.exports=Filter;




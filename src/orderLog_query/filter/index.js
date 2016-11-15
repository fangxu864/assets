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
        "click #search":"getData",   //点击搜索
        "click #export":""            //点击导出
    },

    //init()方法在实例化以后会默认执行
    init:function () {
        $("#filter_box").append(filer_tpl);
        //日历插件部分
        var calendar = new Calendar();

        $("#startTime").on("click",function () {
            //var warnTip =$("");
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
        var paramBox = {};
        paramBox.merchant=$("#merchant").val();
        paramBox.startTime=$("#startTime").val();
        paramBox.endTime=$("#endTime").val();
        paramBox.orderNumber=$("#orderNumber").val();
        paramBox.operatePerson=$("#operatePerson").val();
        paramBox.operateType=$("#operateType").find(':selected').text();
        paramBox.operateTerminal=$("#operateTerminal").find(':selected').text();
        return paramBox;
    },

    //发布获取表单事件
    getData:function () {
        var Params = this.getParams();
        this.trigger("getTable");
        /*$.ajax({
            url: "http://www.hzhuti.com",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: Params,    //参数值
            type: "POST",   //请求方式
            
            success: function(req) {
                //请求成功时处理
            }
        });*/
    }


});

module.exports=Filter;




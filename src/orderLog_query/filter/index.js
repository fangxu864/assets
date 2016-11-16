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

        /*//必填提示部分
        $("#startTime,#endTime").on("focus",function(){
            var Left = $(this).offset().left,
                Top = $(this).offset().top;

            var warn = $("<span>操作时间必填</span>>").addClass("warn").css({
                "position":"relative",
                "top":Top-10,
                "left":Left-100

            });

            $(this).after(warn);
        }).on("blur",function(){
            $(this).find(".warn").remove();
        });*/

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
        var paramBox = {};
        paramBox.merchant=$("#merchant").val();  //可能不存在
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
        /*//提交时判断必要参数时候完整
        if(!$("#startTime").val()||!$("#endTime").val()){
            $("#startTime,#endTime").trigger("focus");
            return false
        }*/

        //发布更新参数
        var Params = this.getParams();
        //this.trigger("refreshParams",data);

        //发布处理表格

        $.ajax({
            url: "http://www.hzhuti.com",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: Params,    //参数值
            type: "POST",   //请求方式
            
            success: function(data) {
                alert(1)
                this.trigger("getTable",data);
            }
        });
    }


});

module.exports=Filter;




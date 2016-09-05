/**
 * Created by Administrator on 2016/9/5.
 */
var Calendar = require("COMMON/modules/calendar");
$(function () {
    AddCalendar.init();
});
var AddCalendar ={
    init:function(){
            var that= this;
            that.Calendar = new Calendar();
            that.Calendar.on("selcet",function(data){});
            that.CreatCalendar("#storage_open");

    },
    CreatCalendar:function(id){
            var that = this;
            $(id).on("focus",function (e) {
                var picker = $(e.target);
                var date = picker.val();
                that.Calendar.show(date,{
                    picker:$(e.target),
                    top:0,
                    left:-278,
                    min:"2010-06-20",
                    max:"2019-09-30",
                    onBefore:function(){

                    },
                    onAfter:function(){

                    }
                });
            })

    }

}
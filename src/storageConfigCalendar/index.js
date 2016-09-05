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
            that.CreatCalendar("#storage_open");

    },
    CreatCalendar:function(id){
            var that = this;
            $(id).on("focus",function (e) {
                alert("fdsafjlds")
                var picker = $(e.target);
                var date = picker.val();
                that.Calendar.show(date,{
                    picker:$(e.target),
                    top:100,
                    left:200,
                    min:"2016-06-20",
                    max:"2016-09-30",
                    onBefore:function(){

                    },
                    onAfter:function(){

                    }
                });
            })

    }

}
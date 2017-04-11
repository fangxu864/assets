
require("./index.scss");

var Toast = require("./Toast/index");

var Calendar = require("./calendar/index");

var main = {

    init : function(){

        var that = this;

        this.toast1 = new Toast();
        this.toast2 = new Toast();

        this.calendar = new Calendar({

            date : "2017-02-17", //初始天数,默认为当天
            maxDate : false, //最大天数
            minDate : false, //最小天数
            disableTodayBefore : false, //是否今天之前都为disable

        });

        this.bind();


        //调试日历
        console.log(this.calendar);        
        // this.calendar.show();
        //订阅
        this.calendar.on("prev",function(){
            console.log("prev"); //do something
            var list = that.calendar.getNowMonthList();            
            console.log(list); //用于遍历
        });
        this.calendar.on("next",function(){
            console.log("next");//do something
            var list = that.calendar.getNowMonthList();
            console.log(list); //用于遍历
        });
        this.calendar.on("daySelect",function(){
            console.log(that.calendar.selectedDay);
            console.log(that.calendar.nowTarget);
        });

        
        
    },


    bind : function(){

        var that = this;

        //测试loading
        $("#btn1").on("click",function(){
            that.toast1.show("loading");            
            
            setTimeout(function(){
                that.toast2.hide();   //toast2的隐藏对toast1无影响   
            },1000);

            setTimeout(function(){
                that.toast1.hide();   
            },2000);

        });
        //测试日历
        $("#btn2").on("click",function(){
            that.calendar.show();
        });

    }

}

$(function(){
    main.init();    
});






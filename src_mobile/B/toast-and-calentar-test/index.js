
require("./index.scss");

var Toast = require("./Toast/index");

var Calendar = require("./calendar/index");

var main = {

    init : function(){

        var that = this;

        this.toast1 = new Toast();
        this.toast2 = new Toast();

        this.calendar = new Calendar();

        $("#btn1").on("a",function(){
            
            console.log("订阅");

        });

        this.bind();

        //调试
        console.log(this.calendar);        
        this.calendar.show();
        
    },


    bind : function(){

        var that = this;

        //测试loading
        $("#btn1").on("click",function(){

            that.toast1.show("loading");            

            setTimeout(function(){

                that.toast2.hide();   

            },1000);


        });

        //测试日历
        $("#btn2").on("click",function(){

            // console.log(that.calendar);

            that.calendar.show();

        });

        //测试jq发布订阅
        $("#btn3").on("click",function(){
            $("#btn1").trigger("a");
        });
        



    }



}


$(function(){

    main.init();    


});






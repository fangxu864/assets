/**
 * Created by Administrator on 2017/4/10.
 */
var Contact = require("./Common/contact/index.js");
var DatePricePicker = require("./Common/Datepicker/index.js");
var contact = new Contact('.contact-rely-box');

var num = 0;
contact.render(num);


var datePricePicker = new DatePricePicker();

datePricePicker.on("datePick",function (data) {
    console.log(data)
})

$(function () {
    $(".inp").on("click",function () {
        var _this = $(this);
        datePricePicker.show( '2015-06-03' ,{ //日历均为字符串，格式为 XXXX-XX-XX ,initDate表示初始化日期，若无则默认为今日
            relyInp: _this,     //依托的input
            max:'',    //最大日期
            min: '2017-03-02'     //最小日期 设置日期小于今天会重置到今天
        });
    });
    
    $(document).on("keydown", function (e) {

        if(e.keyCode == 38){
            num ++
            contact.render(num);
        }
        if(e.keyCode == 40){
            num --
            contact.render(num);
        }

    })
})

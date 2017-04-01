var DatePicker = require("./Common/Datepicker/index.js");
var hotelDateList = require("./Common/hotelDateList/index.js");



$(function () {
    var datePicker = new DatePicker();


    $(".inp").on("click" ,function () {
        var _this = $(this);

        datePicker.show('2017-4-2',{
            relyInp: _this,
            max:'',
            min: '2017-3-2'
        });

    });

    datePicker.on("datePick",function (data) {
        console.log(data);
        console.log(this);
    })

    hotelDateList.render({
        container:$(".hotel-date-list-box")
    });


});
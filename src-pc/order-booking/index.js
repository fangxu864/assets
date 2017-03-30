var DatePicker = require("./Common/Datepicker/index.js");


$(function () {
    var datePicker = new DatePicker();

    console.log(datePicker.prototype);


    $(".inp").on("click" ,function () {
        var _this = $(this);

        datePicker.show('2017-3-30',{
            relyInp: _this,
            max:'',
            min: '2017-3-2'
        });

    });

    console.log(datePicker.prototype);
    datePicker.on("datePick",function (data) {
        console.log(data)
    })


});
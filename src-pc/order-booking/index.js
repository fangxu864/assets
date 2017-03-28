var DatePicker = require("./Common/Datepicker/index.js");


$(function () {
    var datePicker = new DatePicker();
    $(".inp").on("click" ,function () {
        var _this = $(this);

        datePicker.show({
            relyInp: _this
        });
    })


});
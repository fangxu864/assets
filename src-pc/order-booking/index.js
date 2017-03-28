var DatePicker = require("./Common/Datepicker/index.js");


$(function () {
    var datePicker = new DatePicker();
    $(".inp").on("click" ,function () {
        var _this = $(this);

        datePicker.show('2017-03-29',{
            relyInp: _this,
            max:'2017-05-20',
            min: '2017-03-20'
        });
        datePicker.on("datePick",function (date) {
            console.log(date,'****');
            alert("dfsfsff")
        })
    })


});
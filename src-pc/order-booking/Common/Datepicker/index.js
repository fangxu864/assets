
require('./index.scss');
var tpl = require("./index.xtpl");
var CalendarCore = require("COMMON/js/calendarCore.js");

var res = CalendarCore.outputDate("2017-03")
console.log(res);

var DatePicker = PFT.Util.Class({

    init: function (opt) {
        var _this = this;
        this.container = $("<div class='calendar-price' style='display: none'></div>");
        $('body').append(_this.container);
    },

    show: function (opt) {
        var _this = this;
        var hostObj = this.hostObj = typeof opt.hostObj === 'string' ? $(opt.hostObj) : opt.hostObj;
        this.container.html(tpl);
        var host_H = hostObj.offset().top - $(window).scrollTop() + hostObj.outerHeight(); //依托对象相对窗口的Top值
        var host_W = hostObj.offset().left - $(window).scrollLeft(); //依托对象相对窗口的left值
        this.container.css({
            'left' : host_W,
            'top' : host_H,
            'display':'block'
        });


    }

});


module.exports = DatePicker;

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
        _this.countYearMonth('2017-03',3)
    },

    bind: function () {
        var _this = this;
        this.container.on("click" , ".control-nav .prev-btn" ,function (e) {

        })
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


    },

    /**
     * @method 年月加减计算
     * @param currentYM 当前年月
     * @param act 加或减多少月
     */
    countYearMonth: function (currentYM , act) {
        var curYear = Number( currentYM.match(/^\d+/)[0] );
        var curMonth = Number( currentYM.match(/\d+$/)[0] ) - 1;
        month = curMonth + Number( act ) % 11 ;
        year = curYear + Math.floor(curMonth / 11);
        console.log(year,month)
    }


});


module.exports = DatePicker;
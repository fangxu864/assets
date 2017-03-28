
require('./index.scss');
var tpl = require("./index.xtpl");
var tbTpl = require("./tablecon.xtpl");
var CalendarCore = require("COMMON/js/calendarCore.js");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");



var DatePicker = PFT.Util.Class({

    init: function (opt) {
        var _this = this;
        this.container = $("<div class='calendar-price' style='display: none;z-index: 666;'></div>");
        this.container.html(tpl);
        this.mask = $('<div class="calendarPriceMask" style="position: absolute;width: 100% ;height: 100%;display: none;z-index: 665;"></div>');
        $('body').append(_this.container).append(_this.mask);
        this.bind();
    },

    bind: function () {
        var _this = this;
        //加减月份按钮点击
        this.container.on("click" , ".control-nav .prev-btn" ,function (e) {
            _this.renderData.curYM = _this.countYearMonth( _this.renderData.curYM ,-1 );
            _this.renderData.list = CalendarCore.outputDate( _this.renderData.curYM );
            console.log(_this.renderData);
            _this.renderTB(_this.renderData);
        });
        this.container.on("click" , ".control-nav .next-btn" ,function (e) {
            _this.renderData.curYM = _this.countYearMonth( _this.renderData.curYM , +1 );
            _this.renderData.list = CalendarCore.outputDate( _this.renderData.curYM );
            _this.renderTB(_this.renderData)
        });
        //点击某一个日期
        this.container.on("click" , '.calendar-tb td.usable' ,function (e) {
            var tarBtn = $(this);
            var pickDate = tarBtn.attr('data-date');
            _this.relyInp.val(pickDate);
            _this.closeCalendar();
            _this.trigger("datePick" , pickDate)
        });
        //点击mask
        this.mask.on("click",function () {
            _this.closeCalendar();
        })
    },

    /**
     * @method 主方法
     */
    show: function (curDate,opt) {
        var _this = this;
        //依托对象
        var relyInp = this.relyInp = typeof opt.relyInp === 'string' ? $(opt.relyInp) : opt.relyInp;
        //最大日期
        var max = opt.max || '9999-99-99';
        //最小日期
        var min = opt.min || CalendarCore.gettoday();
        //当前的天数
        var curDay = curDate || relyInp.val() ||  CalendarCore.gettoday();
        this.renderData = {
            max: max,
            min: min,
            curDay: curDay,
            curYM: curDay.match(/\d+\-\d+/)[0]
        };
        this.renderData.list = CalendarCore.outputDate( curDay.match(/\d+\-\d+/)[0] );
        _this.renderTB(this.renderData);
        this.openCalendar();
    },

    /**
     * @method 打开关闭calendar
     */
    closeCalendar: function () {
        var _this = this;
        _this.container.hide();
        _this.mask.hide();
    },
    openCalendar: function () {
        var _this = this;
        var host_H = this.relyInp.offset().top - $(window).scrollTop() + this.relyInp.outerHeight(); //依托对象相对窗口的Top值
        var host_W = this.relyInp.offset().left - $(window).scrollLeft(); //依托对象相对窗口的left值
        this.mask.show();
        this.container.css({
            'left' : host_W,
            'top' : host_H,
            'display':'block'
        });
    },

    showLoading: function (type , text) {
        var _this = this;
        var box = _this.container.find('.loading-box');
        switch (type){
            case 'loading':
                box.html('<img src="http://static.12301.cc/images/icons/gloading.gif" alt="加载中..."/>')
                    .show();
                break;
            case 'error':
                box.html(text)
                    .show();
                break;
            default:
                box.html('<img src="http://static.12301.cc/images/icons/gloading.gif" alt="加载中..."/>')
                    .show();
                break;
        }
    },
    hideLoading: function () {
        this.container.find('.loading-box').fadeOut(100)
    },

    /**
     * @method 渲染日历主体
     */
    renderTB: function (data) {
        var _this = this;
        _this.showLoading('loading','请求出错');
        var html = _this.tbTemplate({data: data});
        var newStr = _this.renderData.curYM.match(/^\d+/) + '年' + Number( _this.renderData.curYM.match(/\d+$/) ) + '月';
        this.container.find('.title').text(newStr);
        this.container.find('.calendar-tb tbody').html(html);
        setTimeout(function () {
            _this.hideLoading()
        },200)
    },
    tbTemplate: ParseTemplate(tbTpl),

    /**
     * @method 年月加减计算
     * @param date 当前年月
     * @param act 加或减多少月
     */
    countYearMonth: function (date , act) {
        var curYear = Number( date.match(/^\d+/)[0] );
        var curMonth = Number( date.match(/\d+$/)[0] ) - 1;
        curMonth += Number(act);
        var month = curMonth >= 0 ? curMonth % 12 + 1 : 12 + curMonth % 12 + 1;
        var year =curYear + Math.floor( curMonth / 12 );
        month = month > 9 ? month : 0 + '' + month;
        return year + '-' + month
    },

    /**
     * @method 修正格式化日期
     */
    formatDate: function (date) {
        var year = date.match(/^\d+/)[0];
        var month = date.match(/(\-)(\d+)(\-)/)
    }
});


module.exports = DatePicker;
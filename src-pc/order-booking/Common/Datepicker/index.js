
require('./index.scss');
var tpl = require("./index.xtpl");
var tbTpl = require("./tablecon.xtpl");
var CalendarCore = require("COMMON/js/calendarCore.js");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");



var DatePicker = PFT.Util.Class({

    init: function (opt) {
        var _this = this;
        var CurDate = new Date();
        this.curYM = CurDate.getFullYear() + '-' + ( CurDate.getMonth() > 9 ? CurDate.getMonth() + 1 : '0' + ( CurDate.getMonth() + 1 ) );
        this.container = $("<div class='calendar-price' style='display: none;z-index: 666;'></div>");
        this.createMask();
        $('body').append(_this.container);
        this.bind();

    },

    bind: function () {
        var _this = this;
        //加减月份按钮点击
        this.container.on("click" , ".control-nav .prev-btn" ,function (e) {
            _this.curYM = _this.countYearMonth( _this.curYM ,-1 );
            var Data = CalendarCore.outputDate( _this.curYM );
            console.log(Data)
            _this.renderTB(Data);
        });
        this.container.on("click" , ".control-nav .next-btn" ,function (e) {
            _this.curYM = _this.countYearMonth( _this.curYM , +1 );
            var Data = CalendarCore.outputDate( _this.curYM );
            console.log(_this.curYM);
            _this.renderTB(Data)
        });
        //点击某一个日期
        this.container.on("click" , '.calendar-tb td.usable' ,function (e) {
            var tarBtn = e.currentTarget;
            console.log(tarBtn)
        });
        //点击mask
        this.mask.on("click",function () {
            _this.container.hide();
            $(this).hide();
        })
    },

    /**
     * @method 打开
     */
    show: function (opt) {
        var _this = this;
        var relyInp = this.relyInp = typeof opt.relyInp === 'string' ? $(opt.relyInp) : opt.relyInp;
        this.container.html(tpl);
        var host_H = relyInp.offset().top - $(window).scrollTop() + relyInp.outerHeight(); //依托对象相对窗口的Top值
        var host_W = relyInp.offset().left - $(window).scrollLeft(); //依托对象相对窗口的left值
        var Data = CalendarCore.outputDate( _this.curYM );
        _this.renderTB(Data);
        this.mask.show();
        this.container.css({
            'left' : host_W,
            'top' : host_H,
            'display':'block'
        });
    },

    /**
     * @method 关闭
     */
    close: function () {
        var _this = this;
        this.container.hide();
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
        this.container.find('.loading-box').hide()
    },

    /**
     * @method 创建遮罩层
     */
    createMask: function () {
        var _this = this;
        var zIndex = Number( _this.container.css('z-index') );
        console.log(zIndex)
        var mask = this.mask = $('<div class="calendarPriceMask" style="position: absolute;width: 100% ;height: 100%;display: block"></div>');
        $('body').append(mask);
        mask.css('z-index',zIndex -1)
    },

    /**
     * @method 渲染日历主体
     */
    renderTB: function (data) {
        var _this = this;
        _this.showLoading('loading','请求出错');
        var html = _this.tbTemplate({data: data});
        var newStr = _this.curYM.match(/^\d+/) + '年' + Number( _this.curYM.match(/\d+$/) ) + '月';
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
    }
    


});


module.exports = DatePicker;
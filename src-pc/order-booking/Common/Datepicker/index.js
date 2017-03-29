
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
    show: function (initDate,opt) {
        var _this = this;
        //依托对象
        var relyInp = this.relyInp = typeof opt.relyInp === 'string' ? $(opt.relyInp) : opt.relyInp;
        //最大日期
        var max = opt.max || '9999-99-99';
        max = this.formatDate(max);
        //最小日期
        var min = opt.min || CalendarCore.gettoday();
        min = this.formatDate(min);
        //当前的天数
        var curDay = relyInp.val() || initDate || CalendarCore.gettoday();
        curDay = this.formatDate(curDay);
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
        var month = Number( date.match(/(?:\-)(\d+)(?:\-)/)[1] );
        var day = Number( date.match(/\d+$/)[0] );
        month = month > 9 ? month : 0 + '' + month;
        day = day > 9 ? day : 0 + '' + day;
        return year + '-' + month + '-' + day
    },

    /**
     * @method 获取数据
     */
    getData: function ( params ) {
        var _this = this;
        //显示查询状态
        _this.CR.pubSub.pub("queryStateBox.querying");
        //关闭tableCon
        _this.CR.pubSub.pub("tableConBox.close");
        //关闭tableTicket
        _this.CR.pubSub.pub("tableTicket.close");
        //关闭pagination
        _this.CR.pubSub.pub("paginationBox.close");
        //看看是否有缓存
        if(_this.cacheHub[$.param(params)]){
            //通知table模块render
            setTimeout(function () {
                var res = _this.cacheHub[$.param(params)];
                dealRes( res )
            },100);
            return false;
        }
        $.ajax({
            url: "/r/Order_Booking/getCalendarInfo",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: params,    //参数值
            type: "POST",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                // 请求成功时处理
                //缓存数据
                _this.cacheHub[$.param(params)] = $.extend({},res);
                dealRes( res )
            },
            complete: function(res,status) {
                //请求完成的处理
                if(status=="timeout"){
                    alert("请求超时")
                }
            },
            error: function() {
                //请求出错处理
            }
        });

        function dealRes( res ) {
            if(res.code == 200 ){
                //通知table模块render
                if( _this.judgeTrue( res.data) && _this.judgeTrue(res.data.list) ){
                    res.data.Jtype = params.type;
                    _this.CR.pubSub.pub("queryStateBox.close");
                    _this.CR.pubSub.pub("tableConBox.render", res );
                    _this.CR.pubSub.pub("paginationBox.Render", {currentPage: res.data.page , totalPage: Math.ceil( Number ( res.data.total / 10 ) )} )

                }else{
                    _this.CR.pubSub.pub("queryStateBox.showError" ,"未查询到任何数据，请重新输入条件搜索...");
                }
            }else{
                //通知queryState模块显示错误信息
                _this.CR.pubSub.pub("queryStateBox.showError",res.msg)
            }
        }
    },

    /**
     * @mehtod 判断真假
     */
    judgeTrue: function( param ) {
        var type = Object.prototype.toString.call(param);
        switch (type){
            case '[object Array]':
                return param.length === 0 ?  !1 : !0 ;
                break;
            case '[object Object]':
                var t;
                for (t in param)
                    return !0;
                return !1;
                break;
            case '[object String]':
                return param === '' ? !1 : !0 ;
                break;
            case '[object Number]':
                return param === 0 ? !1 : !0 ;
                break;
            case '[object Boolean]':
                return param === false ? !1 : !0;
                break;
            case '[object Null]':
                return !1;
                break;
            case '[object Undefined]':
                return !1;
                break;
            default :
                return type;
        }
    },

    /**
     * @method 参数仓库
     */
    paramHub: {
        pid: location.href.match(/(?:pid=)(\d+)/)[1],
        aid: location.href.match(/(?:aid=)(\d+)/)[1],
        startDate: '',
        endDate: ''
    },

    /**
     * @Object 缓存仓库
     */
    cacheHub: {}
});


module.exports = DatePicker;
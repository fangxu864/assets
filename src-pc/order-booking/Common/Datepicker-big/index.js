
require('./index.scss');
var tpl = require("./index.xtpl");
var tbTpl = require("./tablecon.xtpl");
var Util = require("./dateUtil.js");
var CalendarCore = require("COMMON/js/calendarCore.js");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");



var DatePicker = PFT.Util.Class({

    init: function (opt) {
        var _this = this;
        this.container = $("<div class='calendar-price' style='display: none;z-index: 666;'></div>");
        this.container.html(tpl);
        this.mask = $('<div class="calendarPriceMask" style="position: fixed;width: 100% ;height: 100%;top:0;left:0;display: none;z-index: 665;background-color: rgba(0,0,0,0.1)"></div>');
        $('body').append(_this.container).append(_this.mask);
        this.bind();
    },

    bind: function () {
        var _this = this;
        //加减月份按钮点击
        this.container.on("click" , ".control-nav .prev-btn" ,function (e) {
            _this.renderData.curYM = Util.countYearMonth( _this.renderData.curYM ,-1 );
            _this.getData();
        });
        this.container.on("click" , ".control-nav .next-btn" ,function (e) {
            _this.renderData.curYM = Util.countYearMonth( _this.renderData.curYM , +1 );
            _this.getData();
        });
        //点击某一个日期
        this.container.on("click" , '.calendar-tb td.usable' ,function (e) {
            var tarBtn = $(this);
            var pickDate = tarBtn.attr('data-date');
            var storage = tarBtn.attr('data-storage');
            _this.relyInp.val(pickDate);
            _this.closeCalendar();
            _this.trigger("datePick" , {pickDate:pickDate ,storage: storage})
        });
        //点击mask
        this.mask.on("click",function () {
            _this.closeCalendar();
        });
        //点击日历关闭按钮
        this.container.on("click" , ".control-nav .close-btn" ,function (){
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
        max = Util.formatDate(max);
        //最小日期
        var today =  CalendarCore.gettoday();
        var min = Util.formatDate(opt.min) && Util.formatDate(opt.min) > today ? Util.formatDate(opt.min) : today;
        min = Util.formatDate(min);
        //当前的天数
        var curDate = Util.formatDate(initDate) && Util.formatDate(initDate) > today ? Util.formatDate(initDate) : today;
        var curDay = relyInp.val() || curDate || CalendarCore.gettoday();
        curDay = Util.formatDate(curDay);
        this.renderData = {
            max: max,
            min: min,
            curDay: curDay,
            curYM: curDay.match(/\d+\-\d+/)[0]
        };
        this.getData();

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
        // var host_H = this.relyInp.offset().top - $(window).scrollTop() + this.relyInp.outerHeight(); //依托对象相对窗口的Top值
        // var host_W = this.relyInp.offset().left - $(window).scrollLeft(); //依托对象相对窗口的left值
        var host_H =( $(window).innerHeight() - this.container.outerHeight() ) / 2;
        var host_W =( $(window).innerWidth() - this.container.outerWidth() ) / 2;
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
        var loadingStr = '<img src="http://static.12301.cc/images/icons/gloading.gif" alt="加载中..."/>';
        switch (type){
            case 'loading':
                box.html(loadingStr)
                    .show();
                break;
            case 'error':
                box.html(text)
                    .show();
                break;
            default:
                box.html(loadingStr)
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
    renderTB: function () {
        var _this = this;
        var tbody = this.container.find('.calendar-tb tbody');
        this.renderData.list = CalendarCore.outputDate( _this.renderData.curYM );
        var html = _this.tbTemplate({data: this.renderData});
        var newStr = _this.renderData.curYM.match(/^\d+/) + '年' + Number( _this.renderData.curYM.match(/\d+$/) ) + '月';
        //判断时候显示切换月份按钮
        //当前月的最大和最小的一天
        var curMonMaxDay =_this.renderData.curYM + '-' + Util.getMonthDays(_this.renderData.curYM);
        var curMonMinDay =_this.renderData.curYM + '-01';
        if(curMonMaxDay > _this.renderData.max){
            _this.container.find(".control-nav .next-btn").hide();
        }else{
            _this.container.find(".control-nav .next-btn").show();
        }
        if(curMonMinDay < _this.renderData.min){
            _this.container.find(".control-nav .prev-btn").hide();
        }else{
            _this.container.find(".control-nav .prev-btn").show();
        }
        this.container.find('.title').text(newStr);
        tbody.html(html);
    },
    tbTemplate: ParseTemplate(tbTpl),
    
    /**
     * @method 获取数据
     */
    getData: function () {
        var _this = this;
        _this.renderTB();
        _this.paramHub.startDate = _this.getDateRange(this.renderData.curYM).min;
        _this.paramHub.endDate = _this.getDateRange(this.renderData.curYM).max;
        var params = _this.paramHub;
        //看看是否有缓存
        if(_this.cacheHub[$.param(_this.paramHub)]){
            //render
            setTimeout(function () {
                var res = _this.cacheHub[$.param(params)];
                dealRes( res )
            },100);
            return false;
        }else{
            //显示查询状态
            _this.showLoading('loading');
        }
        $.ajax({
            url: "/r/Book_Booking/getCalendarInfo",    //请求的url地址
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
                _this.hideLoading();
                if(status=="timeout"){
                    alert("请求超时")
                }
            },
            error: function() {
                //请求出错处理
                _this.hideLoading();
            }
        });

        function dealRes( res ) {
            if(res.code == 200 ){
                if(Util.judgeTrue(res.data)){
                    //渲染价格显示
                    var tbody = _this.container.find('.calendar-tb tbody');
                    var curPrice = {};
                    var curTd = {};

                    for(var key in res.data){
                        curPrice =  tbody.find('td[data-date = '+ key +'] .price');
                        curTd = tbody.find('td[data-date = '+ key +']');
                        //test
                        // if(/5$/.test(key)){
                        //     res.data[key].storage = 0
                        // }

                        if(res.data[key].storage == 0){
                            curPrice.text('售罄');
                        }else{
                            curPrice.text('¥' + res.data[key].price);
                            curTd.removeClass("disable").addClass("usable");
                            curTd.attr("data-storage",res.data[key].storage)
                        }
                    }
                    _this.hideLoading();
                }else{
                    _this.hideLoading();
                    // _this.showLoading("error","暂无价格数据");
                }
            }else{
                //通知queryState模块显示错误信息
                _this.showLoading("error",res.msg);
            }
        }
    },

    /**
     * @method 输入年月，获取当月可用日期范围
     * @return 如{min: '2017-03-01' , max: '2017-03-28'}
     */
    getDateRange: function ( yearMonth ) {
        var maxDate = yearMonth + '-' + Util.getMonthDays( yearMonth );
        var minDate = yearMonth + '-01';
        minDate = minDate > this.renderData.min ? minDate : this.renderData.min;
        maxDate = maxDate > this.renderData.max ? this.renderData.max : maxDate;
        return {
            max: maxDate,
            min: minDate
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
// http://my.12301.local/productOrder.html?pid=26462&aid=3385
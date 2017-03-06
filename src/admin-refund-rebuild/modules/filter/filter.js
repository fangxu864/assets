/**
 * Created by Administrator on 2017/2/24.
 */

require("./filter.scss");
var tpl = require("./filter.xtpl");
var DatePicker = require("COMMON/modules/datepicker");
var Tip = require("COMMON/modules/tips");
var Tips = new Tip();



/**
 * 本模块为条件筛选模块
 * 负责与用户交互查询并数据
 */
var Filter = {
    container: $("<div class='filterBox'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.container.html( tpl );
        this.initDatepicker();
        this.bind();
        this.container.find(".btn_query").trigger("click");
    },

    bind: function () {
        var _this = this;
        //点击确认按钮
        this.container.on("click", ".btn_query" ,function () {
            var params = {};
            //设置初始化分页器的条件为true
            params["isInitPagination"] = true ;
            params["page"] = 1 ;
            _this.CR.pubSub.pub("filterBox.dataCenter" , params);
        });
        //点击导出
        this.container.on("click", ".btn_excel" ,function () {
            var params = _this.container.find("#filterForm").serialize() + "&Export=1";
            var downLoadUrl = "/r/Admin_Refund/getRefundInfo/?" + params;
            _this.outExcel(downLoadUrl);
        });
        //点击打印提现清单按钮
        this.container.on("click", ".btn_print" ,function () {
            //判断结束起始时间是否填写
            var beginInp = _this.container.find(".bTimeInp");
            var endInp = _this.container.find(".eTimeInp");
            if(!beginInp.val() || !endInp.val()){
                if( !beginInp.val() ){
                    Tips.closeAllTips();
                    Tips.show({
                        lifetime : 1000 ,
                        direction : top,
                        hostObj : beginInp ,
                        content : "打印需要输入起始时间",
                        bgcolor : "orange"
                    });
                }else{
                    Tips.closeAllTips();
                    Tips.show({
                        lifetime : 1000 ,
                        direction : top,
                        hostObj : endInp ,
                        content : "打印需要输入结束时间",
                        bgcolor : "orange"
                    })
                }
                return false;
            }
            //打印时间跨度不能超过30天
            if(_this.GetDateDiff(beginInp.val(), endInp.val()) > 30){
                Tips.show({
                    lifetime : 1000 ,
                    direction : top,
                    hostObj : endInp ,
                    content : "打印时间跨度不能超过30天",
                    bgcolor : "orange"
                });
                return false;
            }
            var filterParams =  _this.deSerialize ( _this.container.find("#filterForm").serialize() );
            var newParams = $.extend({}  , filterParams );
            delete newParams.type;
            _this.getPrintListData( newParams );
        });
        //点击状态
        this.container.on("click", ".line4 input[type=radio]" ,function () {
            if( $(this).hasClass("radioResolved")){
                _this.container.find(".btn_print").show();
            }else{
                _this.container.find(".btn_print").hide();
            }
        });
        //请求数据中心
        this.CR.pubSub.sub("filterBox.dataCenter",function (params) {
            var filterParams =  _this.deSerialize ( _this.container.find("#filterForm").serialize() );
            var newParams = $.extend({} , params , filterParams );
            _this.dataCenter( newParams )
        })
    },

    /**
     * @method 初始化日历
     */
    initDatepicker : function(){
        var _this = this;
        var beginInp = _this.container.find(".bTimeInp");
        var endInp = _this.container.find(".eTimeInp");
        var today = DatePicker.CalendarCore.gettoday();
        beginInp.val(today);
        endInp.val(today);
        var datepicker = this.datepicker = new DatePicker();
        this.container.on("click",".bTimeInpBox",function(e){
            var tarInp = $(this).find(".bTimeInp");
            var endtime = endInp.val();
            var date = tarInp.val();
            if(!date) date = today ;
            var max = endtime ? endtime.substr(0,10) : "";
            datepicker.open(date,{
                picker : tarInp,
                todayAfterDisable : false,
                max : max
            });
        });
        this.container.on("click",".eTimeInpBox",function(e){
            var tarInp = $(this).find(".eTimeInp");
            var beingTime = beginInp.val();
            var beginDate = beingTime.substr(0,10);
            var date = tarInp.val();
            if(!date) date = today ;
            var min = beingTime ? beingTime.substr(0,10) : "";
            datepicker.open(date,{
                picker : tarInp,
                todayAfterDisable : false,
                min : min
            });
        });
    },

    /**
     * @method 对象化序列参数
     */
    deSerialize: function ( str ) {
        var arr = str.split("&");
        var obj = {};
        for( var i= 0 ; i< arr.length ;i++ ){
            obj[ arr[i].split("=")[0] ] = arr[i].split("=")[1]
        }
        return obj;
    },

    /**
     * @method 数据中心
     */
    dataCenter: function ( params ) {
        var _this = this;
        //显示查询状态
        _this.CR.pubSub.pub("queryStateBox.querying");
        //关闭tableCon
        _this.CR.pubSub.pub("tableConBox.close");
        //关闭pagination
        _this.CR.pubSub.pub("paginationBox.close");
        $.ajax({
            url: "/r/Admin_Refund/getRefundInfo/",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: params,    //参数值
            type: "POST",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                //请求成功时处理
                if(res.code == 200 ){
                    _this.CR.pubSub.pub("queryStateBox.close");
                    if(res.data.position == 1){
                        _this.container.find(".line4").show();
                    }
                    //通知table模块render
                    _this.CR.pubSub.pub("tableConBox.render", res );
                    //是否初始化分页器
                    if( params.isInitPagination){
                        _this.CR.pubSub.pub("paginationBox.initRender", {currentPage: res.data.page , totalPage: res.data.total } )
                    }
                    //通知pagination模块打开
                    _this.CR.pubSub.pub("paginationBox.open");
                }else{
                    //通知queryState模块显示错误信息
                    _this.CR.pubSub.pub("queryStateBox.showError",res.msg)
                }
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
    },

    /**
     * @method 获取打印清单数据
     */
    getPrintListData: function ( params ) {
        var _this = this;
        $.ajax({
            url: "/r/Admin_Refund/getPrintInfo/",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: params,    //参数值
            type: "POST",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                //请求成功时处理
                if(res.code == 200 ){
                    _this.CR.pubSub.pub("print.printList", res)
                }else{
                    PFT.Util.STip("fail",res.msg)
                }


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
    },

    /**
     * @method导出excel
     */
    outExcel:function (downloadUrl) {
        var iframeName="iframe"+new Date().getTime();
        $("body").append(' <iframe style="display: none" name="'+iframeName+'"></iframe>');
        window.open(downloadUrl, iframeName);
    },

    //计算两个日期间的天数
    GetDateDiff: function(startDate,endDate) {
        var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();
        var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();
        var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
        return  dates;
    }

};

module.exports = Filter;
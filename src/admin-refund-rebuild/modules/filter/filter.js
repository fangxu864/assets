/**
 * Created by Administrator on 2017/2/24.
 */

require("./filter.scss");
var tpl = require("./filter.xtpl");
var DatePicker = require("COMMON/modules/datepicker");



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
        this.bind()
    },

    bind: function () {
        var _this = this;
        this.container.on("click", ".btn_query" ,function () {
            _this.CR.pubSub.pub("queryStateBox.querying");
            var params =  _this.deSerialize (_this.container.find("#filterForm").serialize() );
            params["isInitPagination"] = true ;
            _this.ajaxGetData( params );
        });
        this.container.on("click", ".btn_excel" ,function () {
            _this.CR.pubSub.pub("queryStateBox.close");
            _this.CR.pubSub.pub("tableConBox.render");
        });
        this.container.on("click", ".btn_print" ,function () {
            _this.CR.pubSub.pub("print.print");
        });
        this.container.on("click", ".line4 input[type=radio]" ,function () {
            if( $(this).hasClass("radioResolved")){
                _this.container.find(".btn_print").show();
            }else{
                _this.container.find(".btn_print").hide();
            }
        })
    },

    /**
     * @method  初始化日历
     */
    initDatepicker : function(){
        var _this = this;
        var datepicker = this.datepicker = new DatePicker();
        this.container.on("click",".bTimeInpBox",function(e){
            var tarInp = $(this).find(".bTimeInp");
            var endInp = _this.container.find(".eTimeInp");
            var endtime = endInp.val();
            var date = tarInp.val();
            if(!date) date = DatePicker.CalendarCore.gettoday() ;
            var max = endtime ? endtime.substr(0,10) : "";
            datepicker.open(date,{
                picker : tarInp,
                todayAfterDisable : false,
                max : max
            });
        });
        this.container.on("click",".eTimeInpBox",function(e){
            var tarInp = $(this).find(".eTimeInp");
            var beginInp = _this.container.find(".bTimeInp");
            var beingTime = beginInp.val();
            var beginDate = beingTime.substr(0,10);
            var date = tarInp.val();
            if(!date) date = DatePicker.CalendarCore.gettoday() ;
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
     * @method 获取数据
     */
    ajaxGetData: function ( params ) {
        var _this = this;
        $.ajax({
            url: "/r/Admin_Refund/getRefundInfo/",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: { "page": 1 },    //参数值
            type: "POST",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
                _this.CR.pubSub.pub("queryStateBox.querying");
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
                    _this.CR.pubSub.pub("tableConBox.render", res );
                    if( params.isInitPagination){
                        _this.CR.pubSub.pub("paginationBox.initRender", {currentPage: res.data.page , totalPage: res.data.total } )
                    }
                }else{
                    alert(res.msg)
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
    }





};

module.exports = Filter;
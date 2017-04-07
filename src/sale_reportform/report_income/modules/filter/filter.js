/**
 * Created by Administrator on 2017/2/24.
 */

require("./filter.scss");

var Select = require("COMMON/modules/select");
var Calendar = require("COMMON/modules/calendar");
var When=require("COMMON/js/when.js");
var when=new When();
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
        this.isAdmin=$("#is_admin").val();
        // this.initDatepicker();
        this.sub();
        this.bind();

        // setTimeout(function () {
        //     _this.container.find(".query_btn").click();
        // },0)


    },

    sub:function () {
        var _this = this;
        this.CR.pubSub.sub("filterBox.clickQBtn", function (page) {
            _this.FilterParamsHub['page'] = page;
            _this.gotoDC();
        })

    },

    bind: function () {
        var _this = this;

        //清除商户搜索框按钮
        $(".clear_inp").on("click",function () {
            $(this).siblings("input").val("").attr("data-id","");
        });

        //admin 商户搜索框
        if(_this.isAdmin==1){
            this.container.find(".line1").show();
            //交易商户搜索框
            var select1=new Select({
                source : "/call/jh_mem.php",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
                ajaxType : "get",
                ajaxParams : {
                    action : "fuzzyGetDname_c",
                    dtype : "1",
                    danme : ""
                },
                height:300,
                isFillContent:false,
                filterType : "ajax",  //指定过滤方式为ajax
                field : {
                    id : "id",
                    name : "dname",
                    keyword : "dname"
                },
                trigger : $("#trader_inp"),

                filter : true,
                adaptor : function(res){
                    var reslut = { code:200};
                    reslut["data"] = res;
                    return reslut;
                }
            });
        }
        //filter line1 td2 勾选过滤测试账号
        this.container.find(".line1 .td2 .option").on("click",function () {
            $(this).toggleClass("checked nocheck")
        });

        //日历插件部分
        //获取元素
        this.stime_inp=$("#start_time");
        this.etime_inp=$("#end_time");
        //初始化input内容
        _this.stime_inp.val(_this.getCookie("start_time")!==""?_this.getCookie("start_time"):when.week()[0]);
        _this.etime_inp.val(_this.getCookie("end_time")!==""?_this.getCookie("end_time"):when.week()[1]);
        var calendar = new Calendar();
        this.stime_inp.on("click",function(e){
            var max_day=_this.etime_inp.val();
            // max_day=moment( Date.parse(max_day.replace(/-/g,'/'))+24 * 3600 * 1000 ).format('YYYY-MM-DD');
            calendar.show(_this.stime_inp.val(),{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
                picker : $("#start_time"),              //页面上点击某个picker弹出日历(请使用input[type=text])
                top : 0,                       //日历box偏移量
                left : 0,                     //日历box偏移量
                // min : "2016-05-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
                max : max_day,          //2016-07-10往后的日期都不可选 会自动挂上disable类名
                onBefore : function(){},     //弹出日历前callback
                onAfter : function(){}       //弹出日历后callback
            });
            return this;
        });
        this.etime_inp.on("click",function(e){
            var min_day=_this.stime_inp.val();
            // min_day=moment( Date.parse(min_day.replace(/-/g,'/'))-24 * 3600 * 1000 ).format('YYYY-MM-DD');
            calendar.show(_this.etime_inp.val(),{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
                picker : $("#end_time"),              //页面上点击某个picker弹出日历(请使用input[type=text])
                top : 0,                       //日历box偏移量
                left : 0,                     //日历box偏移量
                min : min_day,              //2016-06-20往前的日期都不可选 会自动挂上disable类名
                // max : when.today(),          //2016-07-10往后的日期都不可选 会自动挂上disable类名
                onBefore : function(){},     //弹出日历前callback
                onAfter : function(){}       //弹出日历后callback
            })
        });
        calendar.on("select",function(data){
            var inputId=data.picker[0].id;
            var startDate=_this.stime_inp.val();
            var endDate=_this.etime_inp.val();
            _this.setCookie("start_time",startDate,1000*60*60);
            _this.setCookie("end_time",endDate,1000*60*60);
            var dateDiff=GetDateDiff(startDate,endDate);
            var curDate;
            if(dateDiff>90){
                if(inputId==="start_time"){
                    curDate=moment( Date.parse(startDate.replace(/-/g,'/'))+90*24 * 3600 * 1000 ).format('YYYY-MM-DD');
                    _this.etime_inp.val(curDate);
                    _this.setCookie("start_time",startDate,1000*60*60);
                    _this.setCookie("end_time",curDate,1000*60*60)
                }else if(inputId==="end_time"){
                    curDate=moment( Date.parse(endDate.replace(/-/g,'/'))-90*24 * 3600 * 1000 ).format('YYYY-MM-DD');
                    _this.stime_inp.val(curDate);
                    _this.setCookie("start_time",curDate,1000*60*60);
                    _this.setCookie("end_time",endDate,1000*60*60)
                }
            }
            //计算两个日期间的天数
            function GetDateDiff(startDate,endDate) {
                var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();
                var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();
                var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
                return  dates;
            }
        });

        //时间段列表绑定事件
        this.container.on("click","ul.time_area li",function () {
            var li_id=$(this).get(0).id;
            switch (li_id) {
                case "today_btn":{
                    _this.stime_inp.val(when.today());
                    _this.etime_inp.val(when.today());
                    _this.setCookie("start_time",when.today(),1000*60*60);
                    _this.setCookie("end_time",when.today(),1000*60*60)
                }break;
                case "yestoday_btn":{
                    _this.stime_inp.val(when.yestoday());
                    _this.etime_inp.val(when.yestoday());
                    _this.setCookie("start_time",when.yestoday(),1000*60*60);
                    _this.setCookie("end_time",when.yestoday(),1000*60*60)
                }break;
                case "thisweek_btn":{
                    _this.stime_inp.val(when.week()[0]);
                    _this.etime_inp.val(when.week()[1]);
                    _this.setCookie("start_time",when.week()[0],1000*60*60);
                    _this.setCookie("end_time",when.week()[1],1000*60*60)
                }break;
                case "lastweek_btn":{
                    _this.stime_inp.val(when.lastweek()[0]);
                    _this.etime_inp.val(when.lastweek()[1]);
                    _this.setCookie("start_time",when.lastweek()[0],1000*60*60);
                    _this.setCookie("end_time",when.lastweek()[1],1000*60*60)
                }break;
                case "thismonth_btn":{
                    _this.stime_inp.val(when.month()[0]);
                    _this.etime_inp.val(when.month()[1]);
                    _this.setCookie("start_time",when.month()[0],1000*60*60);
                    _this.setCookie("end_time",when.month()[1],1000*60*60)
                }break;
                case "lastmonth_btn":{
                    _this.stime_inp.val(when.lastmonth()[0]);
                    _this.etime_inp.val(when.lastmonth()[1]);
                    _this.setCookie("start_time",when.lastmonth()[0],1000*60*60);
                    _this.setCookie("end_time",when.lastmonth()[1],1000*60*60)
                }break;
                default:{
                    alert("why ???")
                }
            }
            $(".query_btn").click();
        });

        //产品名称搜索框
        this.ajaxParams={"search_id":""};
        if(_this.isAdmin==1){
            this.select2=new Select({
                source : "/r/report_statistics/searchLands/",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
                ajaxType : "post",
                height:300,
                ajaxParams : _this.ajaxParams,
                filterType : "ajax",  //指定过滤方式为ajax
                field : {
                    id : "id",
                    name : "name",
                    keyword : "keyword"
                },
                trigger : $("#product_name_inp"),
                isFillContent:false,

                filter : true,
                adaptor : function(res){
                    var reslut = {};
                    reslut["code"]=200;
                    reslut["msg"]=res.msg;
                    var arr=[];
                    var data=res.data;
                    for(var i in data){
                        arr.push(data[i]);
                    }
                    reslut["data"] =arr;
                    return reslut;
                }
            });
        }else{
            this.select2=new Select({
                source : "/r/report_statistics/getLandList/",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
                ajaxType : "get",
                ajaxParams : {
                    action : "fuzzyGetDname_c",
                    dtype : "1",
                    danme : ""
                },
                height:300,
                filterType : "",  //指定过滤方式为ajax
                field : {
                    id : "id",
                    name : "title",
                    keyword : "title"
                },
                trigger : $("#product_name_inp"),
                isFillContent:false,

                filter : true,
                adaptor : function(res){
                    var reslut = {};
                    reslut["code"]=res.code;
                    reslut["msg"]=res.msg;
                    var arr=[];
                    var data=res.data;
                    for(var i in data){
                        arr.push(data[i]);
                    }
                    reslut["data"] =arr;
                    return reslut;
                }
            });
        }

        //应收应付按钮
        //分销商供应商列表数据缓存容器
        _this.select3_cache_data = {};
        this.container.on("click" , ".self-radio" ,function (e) {
            $(this).addClass("checked").siblings(".self-radio").removeClass("checked");
            var type =  $(this).find("input").val();
            var select_fg =  $("#select_fg");
            console.log(_this.select3_cache_data);
            console.log(type)
            if( type == '1' ){
                select_fg.text("分销商:");
                $("#fenxiaoshang_name_inp").prop('placeholder','请输入分销商名称');
                //如果存在分销商缓存
                select_fg.attr("search_type" , 1);
                if( _this.select3_cache_data["Reseller"]){
                    _this.select3.refresh(_this.select3_cache_data["Reseller"]);
                }else{
                    $.post("/r/report_statistics/getResellerList/" , function (res) {
                        _this.select3_cache_data["Reseller"] = res.data;

                        //分销商搜索框
                        _this.select3=new Select({
                            isFillContent:false,
                            ajaxParams : {
                                action : "fuzzyGetDname_c",
                                dtype : "1",
                                danme : ""
                            },
                            height:300,
                            // filterType : "",  //指定过滤方式为ajax
                            field : {
                                id : "id",
                                name : "name",
                                keyword : "name"
                            },
                            trigger : $("#fenxiaoshang_name_inp"),

                            filter : true,
                            data: _this.select3_cache_data["Reseller"]
                        });
                        if( _this.isAdmin != 1){
                            _this.select3.refresh(res.data);
                        }
                    });
                }
            }else{
                $("#select_fg").text("供应商:");
                $("#fenxiaoshang_name_inp").prop('placeholder','请输入供应商名称');
                select_fg.attr("search_type" , 2);
                //如果存在供应商缓存
                if( _this.select3_cache_data["Supplier"]){
                    _this.select3.refresh(_this.select3_cache_data["Supplier"]);
                }else{
                    $.post("/r/report_statistics/getSupplierList" , function (res) {
                        _this.select3_cache_data["Supplier"] = res.data;
                        if( _this.isAdmin != 1){
                            _this.select3.refresh(res.data);
                        }
                    })
                }
            }
        });
        this.container.find(".self-radio")[0].click();

        //管理员账号时，点击分销商搜索框时更新此框数据
        if(_this.isAdmin==1){
            $("#fenxiaoshang_name_inp").on("focus",function () {
                var member_id=_this.getFilterParams()["merchant_id"]?_this.getFilterParams()["merchant_id"]:"";
                var api = '';
                if($("#select_fg").attr("search_type") == 1){
                    api="/r/report_statistics/getResellerList/?action=fuzzyGetDname_c&dtype=1&danme=&member_id="+member_id;
                }else{
                    api="/r/report_statistics/getSupplierList?action=fuzzyGetDname_c&dtype=1&danme=&member_id="+member_id;
                }

                $.ajax({
                    url: api,                                //请求的url地址"/r/report_statistics/orderList/"
                    dataType: "json",                            //返回格式为json
                    async: true,                                  //请求是否异步，默认为异步，这也是ajax重要特性
                    data: {},                            //参数值
                    type: "GET",                                  //请求方式
                    beforeSend: function() {
                        //请求前的处理
                    },
                    success: function(res) {
                        var reslut = {};
                        reslut["code"]=res.code;
                        reslut["msg"]=res.msg;
                        var arr=[];
                        var data=res.data;
                        for(var i in data){
                            arr.push(data[i]);
                        }
                        reslut["data"] =arr;
                        _this.select3.refresh(reslut.data);
                    },
                    complete: function() {
                        //请求完成的处理
                    },
                    error: function() {
                        //请求出错处理
                    }
                });
            });
            $("#product_name_inp").on("focus",function () {
                var member_id = _this.getFilterParams()["merchant_id"] ? _this.getFilterParams()["merchant_id"] : "";
                _this.ajaxParams["search_id"]=member_id;
            })
        }

        this.container.on("click" , '.self-checkbox' , function () {
            $(this).toggleClass("checked");
        });

        //点击确认按钮
        this.container.on("click", ".query_btn" ,function () {
            _this.FilterParamsHub = _this.getFilterParams();
            _this.FilterParamsHub["page"] = 1 ;
            _this.gotoDC();
        });
        // //点击导出
        this.container.on("click", ".excel_btn" ,function () {
            var params = $.param(_this.FilterParamsHub) + "&is_excel=1";
            var  downLoadUrl = "/r/report_statistics/checkedPaywayList?" + params;
            _this.outExcel(downLoadUrl);
        });
    },

    /**
     * @method goToDC 去数据中心取数据
     */
    gotoDC: function (  ) {
        var _this = this;
        //判断是否按票查询
        //按票查询
        if( _this.FilterParamsHub.searchTicket ){
            _this.CR.pubSub.pub("DC.getTicketData" , _this.FilterParamsHub);
        }
        //默认的查询方式
        else{
            _this.CR.pubSub.pub("DC.getMainData" , _this.FilterParamsHub);
        }
    },

    /**
     * @method 初始化日历
     */
    initDatepicker : function(){
        var _this = this;
        var beginInp = _this.container.find(".bTimeInp");
        var endInp = _this.container.find(".eTimeInp");
        var today = DatePicker.CalendarCore.gettoday();
        // beginInp.val(today);
        // endInp.val(today);
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
            obj[ arr[i].split("=")[0] ] = decodeURIComponent( arr[i].split("=")[1] )
        }
        return obj;
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
    },

    /**
     * @method 获取filter 参数
     */
    getFilterParams: function () {
        var _this = this;
        var params = {};
        params["size"] = _this.CR.PAGESIZE;
        params["page"] = 1;
        params["begin_date"] = _this.stime_inp.val();
        params["end_date"] = _this.etime_inp.val();
        params["type"] = Number ( $("#select_fg").attr("search_type") );
        params["searchTicket"] = $('#searchTicket').prop('checked');

        //产品id
        if($("#product_name_inp").attr("data-id")){
            params["land_id"]=$("#product_name_inp").attr("data-id");
        }
        //分销商id
        if($("#fenxiaoshang_name_inp").attr("data-id")){
            params["reseller_id"]=$("#fenxiaoshang_name_inp").attr("data-id");
        }
        //商户id
        if(_this.isAdmin==1){
            console.log(_this.container.find(".line1 .td2 .option "))
            if($("#trader_inp").attr("data-id")){
                params["merchant_id"]=$("#trader_inp").attr("data-id");
            }
            if(_this.container.find(".line1 .td2 .option ").hasClass("checked")){
                params["exclude_test"]=1;
            }else{
                params["exclude_test"]=0;
            }
        }
        return params;
    },

    /**
     * @object 参数缓存容器
     */
    FilterParamsHub:{},

    //处理cookie的函数
    setCookie:function (name, value, time) {
        var oDate=new Date();
        oDate.setTime(oDate.getTime()+time);
        document.cookie=name+'='+encodeURIComponent(value)+';expires='+oDate;
    },
    getCookie:function (name) {
        var arr=document.cookie.split('; ');
        var i=0;
        for(i=0;i<arr.length;i++)
        {
            //arr2->['username', 'abc']
            var arr2=arr[i].split('=');

            if(arr2[0]==name)
            {
                var getC = decodeURIComponent(arr2[1]);
                return getC;
            }
        }

        return '';
    },
    removeCookie:function (name) {
        setCookie(name, '1', -1);
    }

};

module.exports = Filter;
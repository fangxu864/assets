/**
 * Created by Administrator on 2016/9/20.
 */


require("../index.scss");
var SelectShort=require("COMMON/modules/select_short");
var Calendar = require("COMMON/modules/calendar");
var When=require("COMMON/js/when.js");
var when=new When();
// var title_tpl=require("../tpl/title.xtpl");
var filter_tpl=require("../tpl/filter.xtpl");
// var total_tpl=require("../tpl/total.xtpl");
var tablecon_tpl=require("../tpl/tablecon.xtpl");
var querying_tpl=require("../tpl/querying.xtpl");
var queryerror_tpl=require("../tpl/queryerror.xtpl");
var querynodata_tpl=require("../tpl/querynodata.xtpl");
var Select = require("COMMON/modules/select");
var Pagination = require("COMMON/modules/pagination-x");

var STip = require('COMMON/js/util.simple.tip'),
    Toast = require('COMMON/modules/Toast'),
    toast = new Toast,
    Dialog = require('COMMON/Components/Dialog-Simple');

var isResourceAccount = require("../common.js").isResourceAccount;

var Book_form={
    AJAX_URLS: {
        exportDetails: '/r/MassData_ExportListen/Judge/',
        exportSingleDetail: '/r/report_statistics/getOrderInfoByReport'
    },

    // 导出明细
    // 4:预订
    // 5:验证
    // 6:取消
    // 7:撤销
    JUDGE_TYPE: 6,

    init:function () {
        var _this=this;
        this.isAdmin=$("#is_admin").val();
        //获取四个容器
        // this.title_box=$(".title_box");
        this.filter_box=$(".filter_box");
        this.tablecon_box=$(".tablecon_box");
        // this.total_box=$(".total_box");
        this.pagination_wrap=$("#pagination_wrap");
        this.queryState_box=$(".queryState_box");
        //往容器添加内容
        // this.title_box.html(title_tpl);
        // this.total_box.html(total_tpl);

        $(".mctit_4").addClass("active");
        this.filter_box.html(filter_tpl);
        this.tablecon_box.html(tablecon_tpl);

        if(_this.isAdmin==1){
            $(".filter_box .filter .line1").show();

            //交易商户搜索框
            var select1=new Select({
                source : "/call/jh_mem.php",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
                ajaxType : "get",
                ajaxParams : {
                    action : "fuzzyGetDname_c",
                    dtype : "1",
                    danme : ""
                },
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
        //获取元素
        this.stime_inp=$("#start_time");
        this.etime_inp=$("#end_time");
        //初始化input内容
        _this.stime_inp.val(_this.getCookie("start_time")!==""?_this.getCookie("start_time"):when.week()[0]);
        _this.etime_inp.val(_this.getCookie("end_time")!==""?_this.getCookie("end_time"):when.week()[1]);
        //日历插件部分
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


        //产品名称搜索框
        this.ajaxParams={"search_id":""};
        if(_this.isAdmin==1){
            this.select2=new Select({
                source : "/r/report_statistics/searchLands/",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
                ajaxType : "post",

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

        //分销商供应商列表数据缓存容器
        _this.select3_cache_data = {};
        //分销商供应商选择
        var select_fg=new SelectShort({
            id:"select_fg",
            arr:["分销商","供应商"],
            callback:function (cur_opt){
                var Data = {
                    "分销商" : 0 ,
                    "供应商" : 1
                };
                $("#select_fg").attr("search_type" , Data[cur_opt]);


                if(cur_opt == "分销商"){
                    //如果存在分销商缓存
                    if( _this.select3_cache_data["Reseller"]){
                        _this.select3.refresh(_this.select3_cache_data["Reseller"]);
                    }else{
                        $.post("/r/report_statistics/getResellerList/" , function (res) {
                            _this.select3_cache_data["Reseller"] = res.data;

                            //分销商搜索框
                            _this.select3=new Select({
                                // source : "/r/report_statistics/getResellerList/",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
                                // ajaxType : "get",
                                isFillContent:false,
                                ajaxParams : {
                                    action : "fuzzyGetDname_c",
                                    dtype : "1",
                                    danme : ""
                                },
                                // filterType : "",  //指定过滤方式为ajax
                                field : {
                                    id : "id",
                                    name : "name",
                                    keyword : "name"
                                },
                                trigger : $("#fenxiaoshang_name_inp"),

                                filter : true,
                                // adaptor : function(res){
                                //     var reslut = {};
                                //     reslut["code"]=res.code;
                                //     reslut["msg"]=res.msg;
                                //     var arr=[];
                                //     var data=res.data;
                                //     for(var i in data){
                                //         arr.push(data[i]);
                                //     }
                                //     reslut["data"] =arr;
                                //     return reslut;
                                // },
                                data: _this.select3_cache_data["Reseller"]
                            });
                            if( _this.isAdmin != 1){
                                _this.select3.refresh(res.data);
                            }
                        });
                    }
                }else if(cur_opt == "供应商"){
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
            }
        });

        //产品类型选择框
        var select_huizong_type=new SelectShort({
            id:"huizong_type",
            arr:["按产品汇总","按门票汇总","按日期汇总","按分销商汇总","按预定渠道汇总","按分销商+票类汇总"],
            callback:function (cur_opt){
                var data={
                    "按产品汇总":"product",
                    "按门票汇总":"ticket",
                    "按日期汇总":"date",
                    "按分销商汇总":"reseller",
                    "按预定渠道汇总":"channel",
                    "按分销商+票类汇总":"resellerAndTicket"
                };
                $("#huizong_type").attr("count_way",data[cur_opt]);
            }
        });


        //分页器部分
        this.pagination = new Pagination({
            container : "#pagination_wrap" , //必须，组件容器id
            // count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });
        this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
            // toPage :      要switch到第几页
            // currentPage : 当前所处第几页
            // totalPage :   当前共有几页
            _this.pagination.render({current:toPage,total:totalPage});
            _this.filterParamsBox["page"]=toPage;
            _this.cacheKey=_this.JsonStringify(_this.filterParamsBox);
            if(_this.dataContainer[ _this.cacheKey ]){
                _this.dealReqData(_this.dataContainer[ _this.cacheKey ]);
            }else{
                _this.ajaxGetData({
                    "params":_this.filterParamsBox,
                    "isCacheData":true,
                    "cacheKey": _this.cacheKey,
                    "isInitPagination":false
                });
            }
        });


        this.bind();
        _this.queryState_box.show().html('<div style="text-align: center;line-height: 200px;font-size: 16px;color: #c3c3c3;">请选择查询条件再点击查询按钮进行查询</div>');
    },
    bind:function () {
        var _this=this;
        //时间段列表绑定事件
        $("ul.time_area").on("click","li",function () {
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
        //清除商户搜索框按钮
        $(".clear_inp").on("click",function () {
            $(this).siblings("input").val("").attr("data-id","");
        });
        //filter line1 td2 勾选过滤测试账号
        $(".filter_box .filter .line1 .td2 .option").on("click",function () {
            $(this).toggleClass("checked nocheck")
        });
        //查询按钮
        $(".query_btn").on("click",function () {
            // _this.dataContainer={};       //查询按钮点击时，清除数据缓存
            _this.filterParamsBox=_this.getParams();
            _this.filterParamsBox["page"]=1;
            _this.cacheKey=_this.JsonStringify(_this.filterParamsBox);
            _this.ajaxGetData({
                "params":_this.filterParamsBox,
                "isCacheData":true,
                "cacheKey": _this.cacheKey,
                "isInitPagination":true      //是否初始化分页器
            });
        })
        //导出按钮
        $(".excel_btn").on("click",function () {
            var api="/r/report_statistics/cancelList/";
            if(_this.isAdmin=="1"){
                api="/r/report_statistics/adminCancelList/";
            }
            var downUrl=api+"?export_excel=1&"+_this.JsonStringify(_this.filterParamsBox);
            _this.outExcel(downUrl);
        })
        //管理员账号时，点击分销商搜索框时更新此框数据
        if(_this.isAdmin==1){
            $("#fenxiaoshang_name_inp").on("focus",function () {
                var member_id=_this.getParams()["merchant_id"]?_this.getParams()["merchant_id"]:"";
                var api = '';
                if($("#select_fg").attr("search_type") == 0){
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
            })
            $("#product_name_inp").on("focus",function () {
                var member_id = _this.getParams()["merchant_id"] ? _this.getParams()["merchant_id"] : "";
                _this.ajaxParams["search_id"]=member_id;
            })
        }

        // 导出明细   added 2017/04/10
        $('#btnExportDetail').on( 'click', function(){
            var api = _this.AJAX_URLS.exportDetails,
                params = $.extend({}, _this.filterParamsBox, { judgeType: _this.JUDGE_TYPE });

            PFT.Util.Ajax( api, {
                type: 'post',

                params: params,

                loading: function(){
                    toast.show( 'loading');
                },

                success: function( res ){
                    toast.hide();

                    switch( res.code ) {
                        case 1:
                        case 4:
                            // 提示进入报表下载中心
                            var d = new Dialog({
                                header: '提示',
                                width: 400,
                                content: '<div class="dialog-content">明细报表已生成，请前往报表下载中心下载。<br /><a target="_blank" href="downloadcenter.html">点击进入报表下载中心</a></div>'
                            });
                            d.open();
                            break;
                        case 2:
                            // 失败
                            STip( 'fail', res.msg );
                            break;
                    }
                }
            })
        });

        // 点击对应th，降序排序 added 2017/04/10
        this.tablecon_box.on('click', '.orderby', function(){
            if( _this.queryState_box.is(':hidden') ) {
                _this.sortTableBy( $(this).attr('data-orderby') );
            }
        }).on('click', '.btn-export-single', function(){
            _this.outExcel( $(this).attr('data-url') );
        });
    },

    // 表格排序
    sortTableBy: function( orderby ){
        if( !!orderby ) {
            // this.sortArray( this.dataContainer[ this.cacheKey ].data.list, orderby );

            this.dataContainer[ this.cacheKey ].data.list.sort(function( a, b ){
                return Number(b[ orderby ]) - Number(a[ orderby ]);
            });
        }

        this.dealReqData( this.dataContainer[ this.cacheKey ] );
    },

    //获取filter参数
    getParams:function () {
        var _this=this;
        var params={};
        params["size"]=_this.perPageNum;
        params["begin_date"]=_this.stime_inp.val();
        params["end_date"]=_this.etime_inp.val();
        params["search_type"] = $("#select_fg").attr("search_type");
        params["count_way"]= $("#huizong_type").attr("count_way");
        if($("#product_name_inp").attr("data-id")){
            params["land_id"]=$("#product_name_inp").attr("data-id");
        }
        if($("#fenxiaoshang_name_inp").attr("data-id")){
            params["reseller_id"]=$("#fenxiaoshang_name_inp").attr("data-id");
        }
        if(_this.isAdmin==1){
            if($("#trader_inp").attr("data-id")){
                params["merchant_id"]=$("#trader_inp").attr("data-id");
            }
            if($(".filter_box .filter .line1 .td2 .option ").hasClass("checked")){
                params["exclude_test"]=1;
            }else{
                params["exclude_test"]=0;
            }
        }
        return params;
    },
    //处理合计数据
    dealTotal:function (data) {
        var _this=this;
        var name={
            "costMoney": "支出(元)",
            "couPonMoney":"优惠金额(元)",
            "couPonNum":"优惠券数量",
            "orderNum":"订单数",
            "saleMoney":"收入(元)",
            "ticketNum":"票数"
        };
        var html="<dt>合计</dt>";
        for(var i in data){
            html+="<dd>"+name[i]+"："+data[i]+"</dd>";
        }
        $(".total_box .total dl").html(html);
        _this.total_box.fadeIn(200);
    },
    //处理分销商与票类表情况
    resellerAndTicket : function(data){
        var _this=this,
            list=data.list,
            sum=data.sum,
            theadHtml="",
            listHtml="",
            url = [_this.AJAX_URLS.exportSingleDetail + '?is_detail=1&' + 'judgeType=' + _this.JUDGE_TYPE + '&' + _this.JsonStringify(_this.filterParamsBox)];

        url[1] = '&detail_tid=';
        url[2] = '&detail_reseller_id=';

        theadHtml='<th class="th1">分销商名称</th> <th class="th2">景区门票名称</th><th class="th3 orderby" data-orderby="order_num">订单数</th> <th class="th4 orderby" data-orderby="ticket_num">退票数</th> <th class="th5 orderby" data-orderby="cost_money">退票收入(元)</th>';
        if(!isResourceAccount()){
            theadHtml += '<th class="th6 orderby" data-orderby="cancel_money">退票支出元)</th>'
        }
        theadHtml += '<th class="th7 orderby" data-orderby="service_money_in">退票手续费收入(元)</th>';
        if(!isResourceAccount()){
            theadHtml += '<th class="th7 orderby" data-orderby="service_money_out">退票手续费支出(元)</th>'
        }
        theadHtml += '<th class="th8">操作</th>';
        // theadHtml='<th class="th1">分销商名称</th> <th class="th2">景区门票名称</th><th class="th3 orderby" data-orderby="order_num">订单数</th> <th class="th4 orderby" data-orderby="ticket_num">退票数</th> <th class="th5 orderby" data-orderby="cost_money">退票收入(元)</th> <th class="th6 orderby" data-orderby="cancel_money">退票支出元)</th> <th class="th7 orderby" data-orderby="service_money_in">退票手续费收入(元)</th><th class="th7 orderby" data-orderby="service_money_out">退票手续费支出(元)</th> <th class="th8">操作</th>';
        $(".tablecon_box .con_tb thead tr").html(theadHtml);
        listHtml+='<tr> <td class="th2 heji" colspan="2">合计:</td>'+
            '<td class="th3">'+sum.orderNum+'</td>'+
            '<td class="th4">'+sum.ticketNum+'</td>'+
            '<td class="th5">'+sum.costMoney+'</td>';
        if(!isResourceAccount()) listHtml += '<td class="th6">'+sum.cancelMoney+'</td>';
        listHtml += '<td class="th7">'+sum.serviceMoneyIn+'</td>'
        if(!isResourceAccount()) listHtml += '<td class="th8">'+sum.serviceMoneyOut+'</td>';
        
        listHtml += '<td class="th8"></td>'+
            '</tr>';
        for(var i=0;i<list.length;i++){

            listHtml+='<tr> <td class="th1">'+list[i].reseller_title+'</td>'+
                '<td class="th2"></td>'+
                '<td class="th3">'+list[i].order_num+'</td>'+
                '<td class="th4">'+list[i].ticket_num+'</td>'+
                '<td class="th5">'+list[i].cost_money+'</td>';
                if(!isResourceAccount()) listHtml += '<td class="th6">'+list[i].cancel_money+'</td>';
                listHtml += '<td class="th7">'+list[i].service_money_in+'</td>';
                if(!isResourceAccount()) listHtml += '<td class="th8">'+list[i].service_money_out+'</td>';
                listHtml += '<td class="th8"></td>'+
                '</tr>';
            for(var j=0;j<list[i].tickets.length;j++){
                listHtml+='<tr> <td class="th1"></td>'+
                    '<td class="th2">'+list[i].tickets[j].title+'</td>'+
                    '<td class="th3">'+list[i].tickets[j].order_num+'</td>'+
                    '<td class="th4">'+list[i].tickets[j].ticket_num+'</td>'+
                    '<td class="th5">'+list[i].tickets[j].cost_money+'</td>';
                    if(!isResourceAccount()) listHtml += '<td class="th6">'+list[i].tickets[j].cancel_money+'</td>';
                    listHtml += '<td class="th7">'+list[i].tickets[j].service_money_in+'</td>';
                    if(!isResourceAccount()) listHtml += '<td class="th7">'+list[i].tickets[j].service_money_out+'</td>';
                    listHtml += '<td class="th8"><a href="javascript:;" class="btn-export-single" data-url="' + url[0] + url[1] + list[i].tickets[j].tid + url[2] + list[i].tickets[j].reseller_id + '">导出明细</a></td>'+
                    '</tr>';
            }

        }
        $(".tablecon_box .con_tb tbody").html(listHtml);
        $(".tablecon_box .con_tb *").addClass("resellerAndTicket");     //全部加class以区分
        $(".tablecon_box .con_tb tbody .th5").css("color","#3DBA3F");
        $(".tablecon_box .con_tb tbody .th6").css("color","#F07845");
        $(".tablecon_box .con_tb tbody tr:odd").addClass("gray");
    },
    //处理其他表
    otherform : function(data,kindsTitle){
        var _this=this,
            list=data.list,
            sum=data.sum,
            theadHtml="",
            listHtml="",
            url = _this.AJAX_URLS.exportSingleDetail + '?is_detail=1&' + 'judgeType=' + _this.JUDGE_TYPE + '&' + _this.JsonStringify(_this.filterParamsBox),
            prop = '';

        switch( _this.filterParamsBox.count_way ) {
            case "product":
                url += '&detail_lid=';
                prop = 'lid';
                break;
            case "ticket":
                url += '&detail_tid=';
                prop = 'tid';
                break;
            case "date":
                url += '&detail_date=';
                prop = 'date';
                break;
            case "reseller":
                url += '&detail_reseller_id=';
                prop = 'reseller_id';
                break;
            case "channel":
                url += '&detail_channel=';
                prop = 'channel';
                break;
        }
        theadHtml='<th class="th1">'+kindsTitle+'</th> <th class="th2 orderby" data-orderby="order_num">订单数</th> <th class="th3 orderby" data-orderby="ticket_num">退票数</th><th class="th4 orderby" data-orderby="cost_money">退票收入(元)</th>';
        if(!isResourceAccount()) theadHtml += '<th class="th5 orderby" data-orderby="cancel_money">退票支出(元)</th>';
        theadHtml += '<th class="th6 orderby" data-orderby="service_money_in">退票手续费收入(元)</th>';
        if(!isResourceAccount()) theadHtml += '<th class="th7 orderby" data-orderby="service_money_out">退票手续费支出(元)</th>';
        theadHtml += '<th class="th8">操作</th>';
        // theadHtml='<th class="th1">'+kindsTitle+'</th> <th class="th2 orderby" data-orderby="order_num">订单数</th> <th class="th3 orderby" data-orderby="ticket_num">退票数</th><th class="th4 orderby" data-orderby="cost_money">退票收入(元)</th> <th class="th5 orderby" data-orderby="cancel_money">退票支出(元)</th><th class="th6 orderby" data-orderby="service_money_in">退票手续费收入(元)</th> <th class="th7 orderby" data-orderby="service_money_out">退票手续费支出(元)</th><th class="th8">操作</th>';
        $(".tablecon_box .con_tb thead tr").html(theadHtml);
        listHtml+='<tr> <td class="th1 heji">合计:</td>'+
            '<td class="th2">'+sum.orderNum+'</td>'+
            '<td class="th3">'+sum.ticketNum+'</td>'+
            '<td class="th4">'+sum.costMoney+'</td>';
            if(!isResourceAccount()) listHtml += '<td class="th5">'+sum.cancelMoney+'</td>';
            listHtml += '<td class="th6">'+sum.serviceMoneyIn+'</td>';
            if(!isResourceAccount()) listHtml += '<td class="th7">'+sum.serviceMoneyOut+'</td>';
            listHtml += '<td class="th8"></td>'+
            '</tr>';
        for(var i=0;i<list.length;i++){
            listHtml+='<tr> <td class="th1">'+list[i].title+'</td>'+
                '<td class="th2">'+list[i].order_num+'</td>'+
                '<td class="th3">'+list[i].ticket_num+'</td>'+
                '<td class="th4">'+list[i].cost_money+'</td>';
                if(!isResourceAccount()) listHtml += '<td class="th5">'+list[i].cancel_money+'</td>';
                listHtml += '<td class="th6">'+list[i].service_money_in+'</td>';
                if(!isResourceAccount()) listHtml += '<td class="th7">'+list[i].service_money_out+'</td>';
                listHtml += '<td class="th8"><a href="javascript:;" class="btn-export-single" data-url="' + url + list[i][prop] + '">导出明细</a></td>'+
                '</tr>'
        }
        $(".tablecon_box .con_tb tbody").html(listHtml);
        $(".tablecon_box .con_tb tbody tr:odd").addClass("gray");
    },
    //处理表
    dealTablecon:function (data) {
        var _this=this,
            list=data.list,
            sum=data.sum,
            theadHtml="",
            listHtml="" ;
        var thead={
            "title" : "名称",
            "order_num" : "订单数",
            "ticket_num" : "票数",
            "sale_money" : "收入(元)",
            "cost_money" : "支出(元)",
            "coupon_num" : "优惠券数量",
            "coupon_money" : "优惠金额(元)"
        };
        var titleName={
            "product":"产品名称",
            "ticket":"票类名称",
            "date":"日期",
            "reseller":"分销商名称",
            "channel":"预订渠道",
            "resellerAndTicket":"分销商/票类"
        };
        var kindsTitle=titleName[_this.filterParamsBox.count_way];
        if(list[0]["service_money_out"]!==undefined){    //非景区账号
            if(kindsTitle == "分销商/票类"){     //分销商票类页面单独渲染
                this.resellerAndTicket(data);
            }else{
                this.otherform(data,kindsTitle);
            }
        }else{
            if(kindsTitle == "分销商/票类"){     //分销商票类页面单独渲染
                this.resellerAndTicket(data);
            }else{
                this.otherform(data,kindsTitle);
            }
        }
        _this.tablecon_box.fadeIn(200);
    },
    //处理分页器
    dealPagination:function (currentPage,totalPages) {
        var _this=this;
        if(totalPages>1){
            this.pagination.render({current:currentPage,total:totalPages});
            this.pagination_wrap.show(200);
        }
    },
    //ajax获取数据
    ajaxGetData:function (data) {
        var _this=this;
        var api="/r/report_statistics/cancelList/";
        if(_this.isAdmin=="1"){
            api="/r/report_statistics/adminCancelList/";
        }
        $.ajax({
            url: api,                                //请求的url地址"/r/report_statistics/orderList/"
            dataType: "json",                            //返回格式为json
            async: true,                                  //请求是否异步，默认为异步，这也是ajax重要特性
            data: data.params,                            //参数值
            type: "GET",                                  //请求方式
            beforeSend: function() {
                //请求前的处理
                // _this.total_box.hide();
                _this.tablecon_box.hide();
                _this.pagination_wrap.hide();
                _this.queryState_box.show().html(querying_tpl);
            },
            success: function(req) {
                if(req.code==200){
                    if(req.data.list.length==0){
                        // _this.total_box.hide();
                        _this.tablecon_box.hide();
                        _this.pagination_wrap.hide();
                        _this.queryState_box.show().html(querynodata_tpl);
                    }else{
                        _this.queryState_box.hide();
                        _this.dealReqData(req);
                        if(data.isCacheData){            //缓存查询的数据
                            _this.dataContainer[data.cacheKey]=req;
                        }
                        if(data.isInitPagination){       //是否初始化分页器
                            var totalPages= Math.ceil(req.data.total/_this.perPageNum);
                            var currentPage= 1;
                            _this.dealPagination(currentPage,totalPages);
                        }else{
                            _this.pagination_wrap.show(200);
                        }
                    }
                }
                else{
                    $(".querying").text(req.msg);
                }

            },
            complete: function() {
                //请求完成的处理
            },
            error: function() {
                //请求出错处理
                // _this.total_box.hide();
                _this.tablecon_box.hide();
                _this.pagination_wrap.hide();
                _this.queryState_box.show().html(queryerror_tpl);
            }
        });
    },
    //处理总的数据的方法
    dealReqData:function (data) {
        var _this=this;
        // var total= data.data.sum;
        var list= data.data;
        // _this.dealTotal(total);
        _this.dealTablecon(list);
    },
    //导出excel
    outExcel:function (downloadUrl) {
        var iframeName="iframe"+new Date().getTime();
        $("body").append(' <iframe style="display: none" name="'+iframeName+'"></iframe>');
        window.open(downloadUrl, iframeName);
    },
    //定义一个filter参数暂存容器，只有当查询按钮点击时才会更新此容器
    filterParamsBox:{},
    //定义一个数据缓存容器，存储分页获取的数据
    dataContainer:{},
    //定义每页显示的条数
    perPageNum:15,
    //JsonStringify 对象序列化方法
    JsonStringify:function (obj) {
        var str="";
        var arr=[];
        for(var key in obj){
            str=key+"="+obj[key];
            arr.push(str);
        }
        return arr.join("&");
    },
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


$(function () {
    Book_form.init();
    // $(".query_btn").click();
});
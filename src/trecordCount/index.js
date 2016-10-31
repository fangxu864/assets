/**
 * Created by Administrator on 2016/9/12.
 */
require("./index.scss");
var Calendar = require("COMMON/modules/calendar");
var When=require("COMMON/js/when.js");
var when=new When();
var Select = require("COMMON/modules/select");
// var Pagination = require("COMMON/modules/pagination");
var tpl=require("./index.xtpl");
var dialogtpl=require("./dialogtpl.xtpl");
var tableTR_tpl=require("./tableTR.xtpl");
var dialogTR_tpl=require("./detailTR.xtpl");
var querying_tpl=require("./querying.xtpl");
var Pagination = require("COMMON/modules/pagination-x");

var Dialog=require("COMMON/modules/dialog-simple");
var Dial=new Dialog({
    width : 500,
    closeBtn : true,
    content : dialogtpl,
    drag : true,
    speed : 100,
    // onCloseAfter : function(){
    //     $(".select_down_pages .pages_wrap .con").off("click.click_pages");
    //     $(".select_down_pages .btn_wrap .ok_btn").off("click.ok_down");
    //     $(".select_down_pages .btn_wrap .all_btn").off("click.down_all")
    // }
});

var TrecordCount={
    init:function () {
        var _this=this;
        //获取三个容器
        this.trecordCount_box= $(".trecordCount_box");
        this.pagination_box=$("#pagination_wrap");
        this.queryState_box=$(".queryState_box");
        this.trecordCount_box.html(tpl);
        this.tableCon_box=$(".table_box");
        /*查询部分*/
        //获取元素
        this.stime_inp=$("#start_time");
        this.etime_inp=$("#end_time");
        //初始化input内容
        this.stime_inp.val(when.today());
        this.etime_inp.val(when.today());
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
            // console.log(   new Date( Date.parse(min_day.replace(/-/g,'/'))-24 * 3600 * 1000 ).Format("yyyy-MM-dd")   );
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
        //分页器部分
        this.pagination = new Pagination({
            container : "#pagination_wrap" , //必须，组件容器id
            count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });
        this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
            // toPage :      要switch到第几页
            // currentPage : 当前所处第几页
            // totalPage :   当前共有几页
            _this.pagination.render({current:toPage,total:totalPage});
            _this.filterParamsBox["page"]=toPage;
            _this.filterParamsBox["export"]= 0;
            var cacheKey=_this.JsonStringify(_this.filterParamsBox);
            if(_this.dataContainer[cacheKey]){
                _this.dealReqData(_this.dataContainer[cacheKey]);
            }else{
                _this.ajaxGetData({
                    "api":"/r/Finance_TradeRecord/getRecordCountInfo/",
                    "params":_this.filterParamsBox,
                    "isCacheData":true,
                    "cacheKey":cacheKey,
                    "isInitPagination":false
                });
            }
            $("html body").animate({"scrollTop":377},200)
        });
        // Dial.open();
        this.bind();
    },
    bind:function(){
        var _this=this;
        //时间段列表绑定事件
        $("ul.time_area").on("click","li",function () {
            var li_id=$(this).get(0).id;
            switch (li_id) {
                case "today_btn":{
                    _this.stime_inp.val(when.today());
                    _this.etime_inp.val(when.today());
                }break;
                case "yestoday_btn":{
                    _this.stime_inp.val(when.yestoday());
                    _this.etime_inp.val(when.yestoday());
                }break;
                case "thisweek_btn":{
                    _this.stime_inp.val(when.week()[0]);
                    _this.etime_inp.val(when.week()[1]);
                }break;
                case "lastweek_btn":{
                    _this.stime_inp.val(when.lastweek()[0]);
                    _this.etime_inp.val(when.lastweek()[1]);
                }break;
                case "thismonth_btn":{
                    _this.stime_inp.val(when.month()[0]);
                    _this.etime_inp.val(when.month()[1]);
                }break;
                case "lastmonth_btn":{
                    _this.stime_inp.val(when.lastmonth()[0]);
                    _this.etime_inp.val(when.lastmonth()[1]);
                }break;
                default:{
                    alert("why ???")
                }
            }
            $(".query_btn").click()
        });
        //交易商户搜索框
        var select=new Select({
            source : "/call/jh_mem.php",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
            ajaxType : "get",
            ajaxParams : {
                action : "fuzzyGetDname_c",
                dtype : "1",
                danme : ""
            },
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
        //交易商户搜索框 清除按钮
        $("i.clear_trader_inp").on("click",function () {
            $("#trader_inp").attr({
                "data-id":"",
                "data-dname":"",
                "placeholder":"请输入交易商户名称"
            }).val("")
        });
        //两种账户的单选按钮
        $(".count_dot_btn_box").on("click","span.cell",function () {
            $(".count_dot_btn_box span.cell").toggleClass("selected").toggleClass("not_selected")
        });
        //查询按钮
        $(".query_btn").on("click",function () {
            var params=_this.getFilterParams();
            params["export"]= 0;
            params["page"]=1;
            _this.filterParamsBox=params;
            var cacheKey=_this.JsonStringify(_this.filterParamsBox);
            _this.ajaxGetData({
                "api":"/r/Finance_TradeRecord/getRecordCountInfo/",
                "params":params,
                "isCacheData":true,
                "cacheKey":cacheKey,
                "isInitPagination":true      //是否初始化分页器
            });


        });
        //点击详细时
        $(".table_box").on("click",".detail_btn",function () {
            var reseller_id=$(this).attr("reseller_id");
            var params={
                "bTime":_this.filterParamsBox['bTime'],
                "eTime":_this.filterParamsBox['eTime'],
                "reseller_id":reseller_id
            }
            // Dial.open();
            $.ajax({
                url: "/r/Finance_TradeRecord/getRecordCountDetail",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                data: params,    //参数值
                type: "get",   //请求方式
                beforeSend: function() {
                    //请求前的处理
                },
                success: function(res) {
                    //请求成功时处理
                    if(res.code==0){
                        var list=[];
                        for(var i in res.res){
                          for(var j in res.res[i]){
                              var obj=res.res[i][j]
                              list.push(obj)
                          }
                        }
                        var html=_this.template_dialog({data:list})
                        $(".detail_box .detail_table_box .detail_table tbody").html(html)
                        Dial.open()
                    }else{
                        PFT.Util.STip("fail",res.msg)
                    }
                },
                complete: function(res,status) {//请求完成的处理
                },
                error: function() {//请求出错处理
                    alert("请求出错")
                }
            });
        });
        //导出按钮
        $("#excel_btn").on("click",function () {
            _this.filterParamsBox["export"]= 1;
            var cacheKey=_this.JsonStringify(_this.filterParamsBox);
            cacheKey=cacheKey.replace(/&page=\d+/,"");
            var downUrl='http://www.12301.local/r/Finance_TradeRecord/excelGetRecordCountInfo/?'+cacheKey;
            _this.outExcel(downUrl)
        })
    },
    //获取filter参数
    getFilterParams:function () {
        var _this=this;
        var params={};
        params["bTime"]=_this.stime_inp.val();
        params["eTime"]=_this.etime_inp.val();
        var reseller_id=$("#trader_inp").attr("data-id");
        if(reseller_id!=undefined){
            params["reseller_id"]=reseller_id;
        }
        params["ignoreType"]=$(".count_dot_btn_box .selected").attr("data_type");
        return params

    },
    //ajax获取数据
    ajaxGetData:function (data) {
        var _this=this;
        $.ajax({
            url: data.api,                                //请求的url地址"/r/report_statistics/orderList/"
            dataType: "json",                            //返回格式为json
            async: true,                                  //请求是否异步，默认为异步，这也是ajax重要特性
            data: data.params,                            //参数值
            type: "GET",                                  //请求方式
            beforeSend: function() {
                //请求前的处理
                // _this.total_box.hide();
                _this.tableCon_box.hide();
                _this.pagination_box.hide();
                _this.queryState_box.show().html(querying_tpl);
            },
            success: function(res) {
                var code=res.code;
                if(code==0){
                    var list=[];
                    for (var i in res.list){
                        var obj={};
                        obj["reseller_id"]=i;
                        for (var j in res.list[i]){
                            obj["blmoney"]= res.list[i]["blmoney"];
                            obj["elmoney"]= res.list[i]["elmoney"];
                            obj["expense"]= res.list[i]["expense"];
                            obj["income"]= res.list[i]["income"];
                            obj["name"]= res.list[i]["name"];
                        }
                        list.push(obj)
                    }

                    if(list.length==0){
                        _this.tableCon_box.hide();
                        _this.pagination_box.hide();
                        _this.queryState_box.show().html("未查询到任何数据，请重新输入条件搜索...");
                    }else{
                        _this.queryState_box.hide();
                        _this.dealReqData(res);
                        if(data.isCacheData){            //缓存查询的数据
                            _this.dataContainer[data.cacheKey]=res;
                        }
                        if(data.isInitPagination){       //是否初始化分页器
                            var totalPages= Math.ceil(res.total/15);
                            if(totalPages>1){
                                _this.pagination.render({current:1,total:totalPages});
                            }else{
                                _this.pagination_box.hide();
                            }
                        }else{
                            _this.pagination_box.show(200);
                        }
                    }
                }
                else{
                    _this.queryState_box.html("未查询到任何数据，请重新输入条件搜索...")
                }

            },
            complete: function() {
                //请求完成的处理
            },
            error: function() {
                //请求出错处理
                // _this.total_box.hide();
                _this.tableCon_box.hide();
                _this.pagination_box.hide();
                _this.queryState_box.show(200).text("查询出错，请重试...");
            }
        });
    },
    //处理总的数据的方法
    dealReqData:function (res) {
        var _this=this;
        var list=[];
        for (var i in res.list){
            var obj={};
            obj["reseller_id"]=i;
            for (var j in res.list[i]){
                obj["blmoney"]= res.list[i]["blmoney"];
                obj["elmoney"]= res.list[i]["elmoney"];
                obj["expense"]= res.list[i]["expense"];
                obj["income"]= res.list[i]["income"];
                obj["name"]= res.list[i]["name"];
            }
            list.push(obj)
        }
        var html=_this.template({data:list});
        _this.tableCon_box.find("table tbody").html(html);
        _this.tableCon_box.fadeIn();
    },
    //template
    template:PFT.Util.ParseTemplate(tableTR_tpl),
    template_dialog:PFT.Util.ParseTemplate(dialogTR_tpl),
    //定义一个filter参数暂存容器，只有当查询按钮点击时才会更新此容器
    filterParamsBox:{},
    //定义一个数据缓存容器，存储分页获取的数据
    dataContainer:{},
    //定义每页显示的条数
    perPageNum:10,
    //导出excel
    outExcel:function (downloadUrl) {
        var iframeName="iframe"+new Date().getTime();
        $("body").append(' <iframe style="display: none" name="'+iframeName+'"></iframe>');
        window.open(downloadUrl, iframeName);
    },
    //JsonStringify 对象序列化方法
    JsonStringify:function (obj) {
        var str="";
        var arr=[];
        for(var key in obj){
            str=key+"="+obj[key];
            arr.push(str);
        }
        return arr.join("&");
    }
};

$(function () {
    TrecordCount.init();
    $(".query_btn").click()
});
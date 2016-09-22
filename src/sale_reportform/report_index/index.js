/**
 * Created by Administrator on 2016/9/20.
 */


require("./index.scss");
var SelectShort=require("COMMON/modules/select_short");
var Calendar = require("COMMON/modules/calendar");
var When=require("COMMON/js/when.js");
var when=new When();
// var title_tpl=require("../tpl/title.xtpl");
var filter_tpl=require("../tpl/filter.xtpl");
var total_tpl=require("../tpl/total.xtpl");
var tablecon_tpl=require("../tpl/tablecon.xtpl");
var querying_tpl=require("../tpl/querying.xtpl");
var queryerror_tpl=require("../tpl/queryerror.xtpl");
var querynodata_tpl=require("../tpl/querynodata.xtpl");
var Select = require("COMMON/modules/select");
var Pagination = require("COMMON/modules/pagination-x");


var Book_form={
    init:function () {
        var _this=this;
        this.isAdmin=$("#is_admin").val();
        //定义一个存储查询数据的容器
        this.queryData="";
        //获取四个容器
        // this.title_box=$(".title_box");
        this.filter_box=$(".filter_box");
        this.tablecon_box=$(".tablecon_box");
        this.total_box=$(".total_box");
        this.pagination_wrap=$("#pagination_wrap");
        this.queryState_box=$(".queryState_box");
        //往容器添加内容
        // this.title_box.html(title_tpl);
        this.total_box.html(total_tpl);

        $(".mctit_1").addClass("active");
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
        this.stime_inp.val(when.today());
        this.etime_inp.val(when.today());
        //日历插件部分
        var calendar = new Calendar();
        this.stime_inp.on("click",function(e){
            var max_day=_this.etime_inp.val();
            max_day=moment( Date.parse(max_day.replace(/-/g,'/'))+24 * 3600 * 1000 ).format('YYYY-MM-DD');
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
            min_day=moment( Date.parse(min_day.replace(/-/g,'/'))-24 * 3600 * 1000 ).format('YYYY-MM-DD');
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

        //产品名称搜索框
        var select2=new Select({
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

        //分销商供应商选择
        var select_fg=new SelectShort({
            id:"select_fg",
            arr:["分销商","供应商"],
            callback:function (cur_opt){}
        });
        //分销商搜索框
        var select3=new Select({
            source : "/r/report_statistics/getResellerList/",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
            ajaxType : "get",

            ajaxParams : {
                action : "fuzzyGetDname_c",
                dtype : "1",
                danme : ""
            },
            filterType : "",  //指定过滤方式为ajax
            field : {
                id : "id",
                name : "name",
                keyword : "name"
            },
            trigger : $("#fenxiaoshang_name_inp"),

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
        //产品类型选择框
        var select_huizong_type=new SelectShort({
            id:"huizong_type",
            arr:["按产品汇总","按门票汇总","按分销商汇总","按预定渠道汇总"],
            callback:function (cur_opt){
                var data={
                    "按产品汇总":"product",
                    "按门票汇总":"ticket",
                    "按分销商汇总":"reseller",
                    "按预定渠道汇总":"channel"
                };
                $("#huizong_type").attr("count_way",data[cur_opt]);
            }
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
        });
        this.pagination.render({current:5,total:10});





        this.bind();
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
            $.ajax({
                url: "/r/report_statistics/orderList/",    //请求的url地址
                dataType: "json",                            //返回格式为json
                async: true,                                  //请求是否异步，默认为异步，这也是ajax重要特性
                data: _this.getParams(),                      //参数值
                type: "GET",                                 //请求方式
                beforeSend: function() {
                    //请求前的处理
                    _this.total_box.hide();
                    _this.tablecon_box.hide();
                    _this.pagination_wrap.hide();
                    _this.queryState_box.show().html(querying_tpl);
                },
                success: function(req) {
                    if(req.data.list.length==0){
                        _this.total_box.hide();
                        _this.tablecon_box.hide();
                        _this.pagination_wrap.hide();
                        _this.queryState_box.show().html(querynodata_tpl);
                    }else{
                        console.log(req);
                        _this.queryState_box.hide();
                        _this.queryData=req;
                        var total= _this.queryData.data.sum;
                        var list= _this.queryData.data.list;
                        _this.dealTotal(total);
                        _this.dealTablecon(list);

                    }
                },
                complete: function() {
                    //请求完成的处理
                },
                error: function() {
                    //请求出错处理
                    console.log("cuo")
                    _this.total_box.hide();
                    _this.tablecon_box.hide();
                    _this.pagination_wrap.hide();
                    _this.queryState_box.show().html(queryerror_tpl);
                }
            });
        })
    },
    getParams:function () {
        var _this=this;
        var params={};
        params["begin_date"]=_this.stime_inp.val();
        params["end_date"]=_this.etime_inp.val();
        params["count_way"]= $("#huizong_type").attr("count_way");
        params["land_id"]=$("#product_name_inp").attr("data-id");
        params["reseller_id"]=$("#fenxiaoshang_name_inp").attr("data-id");
        if(_this.isAdmin==1){
            params["merchant_id"]=$("#trader_inp").attr("data-id");
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
    //处理表
    dealTablecon:function (data) {
        var _this=this;
        var list=data;
        var theadHtml="", listHtml="";

        var thead={
            "title" : "名称",
            "order_num" : "订单数",
            "ticket_num" : "票数",
            "sale_money" : "收入(元)",
            "cost_money" : "支出(元)",
            "coupon_num" : "优惠券数量",
            "coupon_money" : "优惠金额(元)"
        };
        if(list[0]["cost_money"]){    //非景区账号
            console.log("feijingqu");
            var theadHtml='<th class="th1">产品</th> <th class="th2">订单数</th> <th class="th3">票数</th> <th class="th4">收入(元)</th> <th class="th5">支出(元)</th> <th class="th6">优惠券数量</th> <th class="th7">优惠金额(元)</th>';
            $(".tablecon_box .con_tb thead tr").html(theadHtml);
            var listHtml="";
            for(var i=0;i<list.length;i++){
                listHtml+='<tr> <td class="th1">'+list[i].title+'</td>'+
                    '<td class="th2">'+list[i].order_num+'</td>'+
                    '<td class="th3">'+list[i].ticket_num+'</td>'+
                    '<td class="th4">'+list[i].sale_money+'</td>'+
                    '<td class="th5">'+list[i].cost_money+'</td>'+
                    '<td class="th6">'+list[i].coupon_num+'</td>'+
                    '<td class="th7">'+list[i].coupon_money+'</td>'+
                    '</tr>'
            }
            $(".tablecon_box .con_tb tbody").html(listHtml);
        }else{
            console.log("jingqu")

        }
        _this.tablecon_box.fadeIn(200);
    }

};

$(function () {
    Book_form.init();
});
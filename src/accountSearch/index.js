/**
 * Created by Administrator on 2016/9/26.
 */


//引入css
require("./index.scss");
//引入tpl
var filter_tpl=require("./tpl/filter.xtpl");
var total_tpl=require("./tpl/total.xtpl");
var tableCon_tpl=require("./tpl/tableCon.xtpl");
var tableTR_tpl=require("./tpl/tableTR.xtpl");
var querying_tpl=require("./tpl/querying.xtpl");
//引入插件
var Calendar = require("COMMON/modules/calendar");
var When=require("COMMON/js/when.js");
var when=new When();
var Select = require("COMMON/modules/select");
var PaginationX = require("COMMON/modules/pagination-x");
var SelectShort=require("COMMON/modules/select_short");


var accountSearch={
    init:function () {
        var _this=this;
        /***初始化容器盒子和内容***/
        //获取容器盒子
        this.filter_box=$(".filter_box");
        this.total_box=$(".total_box");
        this.tableCon_box=$(".tableCon_box");
        this.pagination_box=$("#pagination_box");
        this.queryState_box=$(".queryState_box");
        //往容器盒子中添加内容
        this.filter_box.html(filter_tpl);
        this.total_box.html(total_tpl);
        this.tableCon_box.html(tableCon_tpl);
        //获取元素;
        this.etime_inp=$("#etime_inp");
        //初始化input内容
        this.etime_inp.val(when.today());
        //日历插件部分
        var calendar = new Calendar();
        this.etime_inp.on("click",function(e){
            var max_day=when.today();
            // max_day=moment( Date.parse(max_day.replace(/-/g,'/'))-24 * 3600 * 1000 ).format('YYYY-MM-DD');
            calendar.show(_this.etime_inp.val(),{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
                picker : $("#etime_inp"),              //页面上点击某个picker弹出日历(请使用input[type=text])
                top : 0,                       //日历box偏移量
                left : 0,                     //日历box偏移量
                // min : "2016-05-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
                max : max_day,          //2016-07-10往后的日期都不可选 会自动挂上disable类名
                onBefore : function(){},     //弹出日历前callback
                onAfter : function(){}       //弹出日历后callback
            });
            return this;
        });
        // var select=new Select({
        //     source : "/call/jh_mem.php",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
        //     ajaxType : "get",
        //     ajaxParams : {
        //         action : "fuzzyGetDname_c",
        //         dtype : "1",
        //         danme : ""
        //     },
        //     filterType : "ajax",  //指定过滤方式为ajax
        //     field : {
        //         id : "id",
        //         name : "dname",
        //         keyword : "dname"
        //     },
        //     trigger : $("#trader_inp"),
        //     height:300,
        //
        //     filter : true,
        //     adaptor : function(res){
        //         var reslut = { code:200};
        //         reslut["data"] = res;
        //         return reslut;
        //     }
        // });
        //分页器部分
        this.searchType_params_dialog={};
        this.search_type_select_dialog=new SelectShort({
            id:"search_type_select",
            arr:["企业名称","ID"],
            callback:function(cur_opt){
                var json={
                    "企业名称":0,
                    "ID":1
                };
                _this.searchType_params_dialog["type"]=json[cur_opt];
            }
        });
        this.search_inp_dialog=new Select({
            source : "/r/Finance_TradeRecord/getComNameByKeyWord",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
            ajaxType : "post",
            ajaxParams : _this.searchType_params_dialog,
            isFillContent:false,
            filterType : "ajax",  //指定过滤方式为ajax
            field : {
                id : "fid",
                name : "com_name",
                keyword : "keyword"
            },
            height : 260,
            trigger : $("#trader_inp"),
            offset : { //偏移量
                top : 0,
                left : 0,
                width : 0 //一般情况下，下拉框的宽度会取trigger的宽度，但程序获取trigger宽度有时会存在几个px的误差，此时，offset.width可让使用者来手动调整
            },
            filter : true,
            adaptor : function(res){
                var result={};
                result["code"] = 200;
                result["data"] = res.data;
                result["msg"] = res.msg;
                return result;
            }
        });

        this.pagination = new PaginationX({
            container : "#pagination_box" , //必须，组件容器id
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
                    "params":_this.filterParamsBox,
                    "isCacheData":true,
                    "cacheKey":cacheKey,
                    "isInitPagination":false
                });
            }
        });


        this.bind();
        _this.queryState_box.show().html('<div style="text-align: center;line-height: 200px;font-size: 16px;color: #c3c3c3;">请选择查询条件再点击查询按钮进行查询</div>');

    },
    bind:function () {
        var _this=this;
        //交易商户搜索框 清除按钮
        $("i.clear_trader_inp").on("click",function () {
            $("#trader_inp").attr({
                "data-fid":"",
                "data-com_name":"",
                "placeholder":"请输入商户名称/ID"
            }).val("")
        });
        //查询按钮点击
        $("#query_btn").on("click",function () {
            _this.filterParamsBox["end_time"]= _this.etime_inp.val();
            _this.filterParamsBox["reseller_id"]= $("#trader_inp").attr("data-fid")||"";
            _this.filterParamsBox["page"]= 1;
            _this.filterParamsBox["page_size"]= _this.perPageNum;
            _this.filterParamsBox["export"]= 0;
            var cacheKey=_this.JsonStringify(_this.filterParamsBox);
            _this.ajaxGetData({
                "params":_this.filterParamsBox,
                "isCacheData":true,
                "cacheKey":cacheKey,
                "isInitPagination":true      //是否初始化分页器
            });
        });
        //导出按钮
        $("#excel_btn").on("click",function () {
            _this.filterParamsBox["export"]= 1;
            var downUrl = "";
            var cacheKey=_this.JsonStringify(_this.filterParamsBox);
            if( _this.filterParamsBox.end_time == when.today()){
                downUrl='/r/Finance_TradeRecord/realTimeAccountBalance?'+cacheKey;
            }else{
                downUrl='/r/Finance_TradeRecord/accountBalance?'+cacheKey;
            }
            _this.outExcel(downUrl)
        })
    },
    //ajax获取数据
    ajaxGetData:function (data) {
        var api = "";
        if(data.params.end_time == when.today()){
            api="/r/Finance_TradeRecord/realTimeAccountBalance";
        }else{
            api="/r/Finance_TradeRecord/accountBalance";
        }
        var _this=this;
        $.ajax({
            url: api,                                //请求的url地址"/r/report_statistics/orderList/"
            dataType: "json",                            //返回格式为json
            async: true,                                  //请求是否异步，默认为异步，这也是ajax重要特性
            data: data.params,                            //参数值
            type: "GET",                                  //请求方式
            beforeSend: function() {
                //请求前的处理
                _this.total_box.hide();
                _this.tableCon_box.hide();
                _this.pagination_box.hide();
                _this.queryState_box.show().html(querying_tpl);
            },
            success: function(res) {
                // var RES={
                //     "code":200,
                //     "data": [
                //         {
                //             "dname":"三亚先行",
                //             "fid":"5648545",
                //             "lmoney":1000
                //         },
                //         {
                //             "dname":"三亚先行",
                //             "fid":"5648545",
                //             "lmoney":1000
                //         },
                //         {
                //             "dname":"三亚先行",
                //             "fid":"5648545",
                //             "lmoney":1000
                //         },
                //         {
                //             "dname":"三亚先行",
                //             "fid":"5648545",
                //             "lmoney":1000
                //         },
                //         {
                //             "dname":"三亚先行",
                //             "fid":"5648545",
                //             "lmoney":1000
                //         },
                //         {
                //             "dname":"三亚先行",
                //             "fid":"5648545",
                //             "lmoney":1000
                //         },
                //         {
                //             "dname":"三亚先行",
                //             "fid":"5648545",
                //             "lmoney":1000
                //         },
                //         {
                //             "dname":"三亚先行",
                //             "fid":"5648545",
                //             "lmoney":1000
                //         }
                //     ],
                //     "sum":{
                //         "shopSum":16,
                //         "lmoneySum":1514541
                //     },
                //     "totalPage":3
                //
                //
                // };
                // res=RES;
                if(res&&res.code==200){
                    if(res.data.length==0){
                        _this.total_box.hide();
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
                            // var totalPages= Math.ceil(res.data.total/_this.perPageNum);
                            var totalPages=res.num.totalpage;
                            if(totalPages>1){
                                _this.pagination.render({current:1,total:totalPages});
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

            },
            error: function() {
                //请求出错处理
                // _this.total_box.hide();
                // _this.tablecon_box.hide();
                // _this.pagination_wrap.hide();
                // _this.queryState_box.show().html(queryerror_tpl);
                alert("error")
            }
        });
    },
    //处理总的数据的方法
    dealReqData:function (data) {
        var _this=this;
        var list= data.data;
        var sum=data.sum;
        var listNew = [];
        var totalHtml=' <dl> <dt>合计</dt> <dd>商户数：'+sum.shopSum+'</dd> <dd>总余额：'+sum.lmoneySum+'元</dd> </dl>';
        for (var key in list ){
            listNew.push(list[key]);
        }
        var tableHtml=_this.template({data:listNew});
        this.tableCon_box.find("tbody").html(tableHtml);
        this.total_box.find(".total").html(totalHtml).show();
        _this.total_box.fadeIn(200);
        _this.tableCon_box.fadeIn(200);
    },
    //template
    template:PFT.Util.ParseTemplate(tableTR_tpl),
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
    perPageNum:10,
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
    accountSearch.init();
    // $("#query_btn").click()
});




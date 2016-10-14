/**
 * Created by Administrator on 2016/10/14.
 */

//引入css
require("./index.scss");
//引入tpl
var filter_tpl=require("./tpl/filter.xtpl");
var tableCon_tpl=require("./tpl/tableCon.xtpl");
var tableTR_tpl=require("./tpl/tableTR.xtpl");
var querying_tpl=require("./tpl/querying.xtpl");
var addRight_tpl=require("./tpl/addRight.xtpl");
//引入插件
var SelectShort=require("COMMON/modules/select_short");
var SelectScroll=require("COMMON/modules/select_scroll");
var Select = require("COMMON/modules/select");
var Pagination = require("COMMON/modules/pagination-x");
var Dialog_simple=require("COMMON/modules/dialog-simple");
var Dialog=new Dialog_simple({
    width : 500,
    height :500,
    closeBtn : true,
    content : addRight_tpl,
    drag : true,
    speed : 200,
    offsetX : 0,
    offsetY : 0,
    overlay : true,
    headerHeightMin : 46,
    events : {}
});
Dialog.open()

var OpenFun={
    init:function(){
        var _this=this;
        //获取容器
        this.filter_box=$(".filter_box");
        this.tableCon_box=$(".tableCon_box");
        this.queryState_box=$(".queryState_box");
        this.pagination_box=$("#pagination_box");
        //往容器添加内容
        this.filter_box.html(filter_tpl);
        this.tableCon_box.html(tableCon_tpl);
        this.open_fun_select=new SelectScroll({
            id:"open_function_select",
            arr:["全部","优惠券","营销活动","会员卡","团购导码","分销商首页","微商城票付通支持","线下充值","订单查询手机号部分隐藏","年卡会员管理"],
            callback:function(cur_opt){}
        });
        this.searchType_select=new SelectShort({
            id:"search_type_select",
            arr:["账号名称","账号","手机号"],
            callback:function(cur_opt){
                var json={
                    "账号名称":1,
                    "账号":2,
                    "手机号":3
                };
                _this.searchType_params["dtype"]=json[cur_opt];
            }
        });
        this.search_inp=new Select({
            source : "/call/jh_mem.php",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
            ajaxType : "get",
            ajaxParams : _this.searchType_params,
            isFillContent:false,
            filterType : "ajax",  //指定过滤方式为ajax
            field : {
                id : "id",
                name : "dname",
                keyword : "dname"
            },
            height : 260,
            trigger : $("#search_inp"),
            offset : { //偏移量
                top : -13,
                left : 0,
                width : 0 //一般情况下，下拉框的宽度会取trigger的宽度，但程序获取trigger宽度有时会存在几个px的误差，此时，offset.width可让使用者来手动调整
            },
            filter : true,
            adaptor : function(res){
                var reslut = { code:200};
                reslut["data"] = res;
                return reslut;
            }
        });

        this.open_fun_select_dialog=new SelectScroll({
            id:"open_fun_select_dialog",
            arr:["全部","优惠券","营销活动","会员卡","团购导码","分销商首页","微商城票付通支持","线下充值","订单查询手机号部分隐藏","年卡会员管理"],
            callback:function(cur_opt){}
        });
        this.searchType_select_dialog=new SelectShort({
            id:"searchType_select_dialog",
            arr:["账号名称","账号","手机号"],
            callback:function(cur_opt){
                var json={
                    "账号名称":1,
                    "账号":2,
                    "手机号":3
                };
                _this.searchType_params_dialog["dtype"]=json[cur_opt];
            }
        });
        this.search_inp_dialog=new Select({
            source : "/call/jh_mem.php",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
            ajaxType : "get",
            ajaxParams : _this.searchType_params_dialog,
            isFillContent:false,
            filterType : "ajax",  //指定过滤方式为ajax
            field : {
                id : "id",
                name : "dname",
                keyword : "dname"
            },
            height : 260,
            trigger : $("#search_inp_dialog"),
            offset : { //偏移量
                top : -13,
                left : 0,
                width : 0 //一般情况下，下拉框的宽度会取trigger的宽度，但程序获取trigger宽度有时会存在几个px的误差，此时，offset.width可让使用者来手动调整
            },
            filter : true,
            adaptor : function(res){
                var reslut = { code:200};
                reslut["data"] = res;
                return reslut;
            }
        });
        //分页器部分
        this.pagination = new Pagination({
            container : "#pagination_box" , //必须，组件容器id
            // count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });
        this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
            // toPage :      要switch到第几页
            // currentPage : 当前所处第几页
            // totalPage :   当前共有几页
            _this.pagination.render({current:toPage,total:totalPage});
            // _this.filterParamsBox["page"]=toPage;
            // var cacheKey=_this.JsonStringify(_this.filterParamsBox);
            // if(_this.dataContainer[cacheKey]){
            //     _this.dealReqData(_this.dataContainer[cacheKey]);
            // }else{
            //     _this.ajaxGetData({
            //         "params":_this.filterParamsBox,
            //         "isCacheData":true,
            //         "cacheKey":cacheKey,
            //         "isInitPagination":false
            //     });
            // }
        });
        _this.pagination.render({current:1,total:10});
        var html=this.template({data:[
            {
                "open_function":"优惠券1",
                "account_num":"15454551221",
                "account_name":"慢慢的店铺"
            },
            {
                "open_function":"优惠券2",
                "account_num":"15454551221",
                "account_name":"慢慢的店铺"
            },
            {
                "open_function":"优惠券3",
                "account_num":"15454551221",
                "account_name":"慢慢的店铺"
            },
            {
                "open_function":"优惠券4",
                "account_num":"15454551221",
                "account_name":"慢慢的店铺"
            },
            {
                "open_function":"优惠券5",
                "account_num":"15454551221",
                "account_name":"慢慢的店铺"
            }
        ]});
        this.tableCon_box.find("tbody").html(html);
        this.queryState_box.html(querying_tpl).show();
        this.bind()
    },
    bind:function () {
        var _this=this;
        //清除商户搜索框按钮
        $(".clear_inp").on("click",function () {
            $(this).siblings("input").val("").attr({"data-id":"","data-dname":""});
        });
    },
    //ajax获取数据
    ajaxGetData:function (data){

    },
    template:PFT.Util.ParseTemplate(tableTR_tpl),
    //搜索框的ajax过滤参数
    searchType_params:{
        "action":"fuzzyGetDname_c",
        "dtype" : "1",
        "danme" : ""
    },
    //搜索框的ajax过滤参数
    searchType_params_dialog:{
        "action":"fuzzyGetDname_c",
        "dtype" : "1",
        "danme" : ""
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
    }
};

$(function () {
   OpenFun.init();
});
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
    // height :500,
    closeBtn : true,
    content : addRight_tpl,
    drag : true,
    speed : 200,
    offsetX : 0,
    offsetY : 0,
    overlay : true,
    headerHeightMin : 46,
    events : {
        "click .btn_no":function (e) {
            Dialog.close()
        },
        "click .btn_yes":function (e) {
            var uid=$("#search_inp_dialog").attr("data-id");
            var uname=$("#search_inp_dialog").attr("data-dname");
            var status=$("#open_function_select_dialog").attr("data-status");
            var status_name=$("#open_function_select_dialog").attr("data-name");
            if(uid==undefined){
                alert("请选择所要开放权限的用户");
                return false;
            }
            var isOpen=confirm('是否开放"'+uname+'"的"'+status_name+'"权限');
            if(!isOpen) return false;
            var params={
                "status":status,
                "uid":uid
            }
            $.ajax({
                url: "/r/admin_Config/addConfig/",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                data: params,    //参数值
                type: "post",   //请求方式
                timeout:5000,   //设置超时 5000毫秒
                beforeSend: function() {//请求前的处理
                },
                success: function(res) {//请求成功时处理
                    if(res.code==200){
                        PFT.Util.STip("success","添加权限成功")
                    }else if(res.code==208){
                        PFT.Util.STip("fail","该用户已拥有该权限，请不要重复添加")
                    }else if(res.code==209){
                        PFT.Util.STip("fail","添加失败，请重试")
                    }else{
                        PFT.Util.STip("fail","返回的数据有误")
                    }
                },
                complete: function(res,status) {
                    //请求完成的处理
                    if(status=="timeout"){
                        alert("请求超时")
                    }
                },
                error: function() {//请求出错处理
                    PFT.Util.STip("fail","请求出错，请重试")
                }
            });

        }
    }
});


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
            arr:["全部","优惠券","营销管理","会员卡","团购导码","分销商首页","微商城票付通支持","线下充值","订单手机号隐藏","年卡会员管理"],
            callback:function(cur_opt){
                $("#open_function_select").attr("data-status",_this.SelectJson[cur_opt])
            }
        });
        this.searchType_select=new SelectShort({
            id:"search_type_select",
            arr:["账号名称","账号","手机号"],
            callback:function(cur_opt){
                var json={
                    "账号名称":0,
                    "账号":1,
                    "手机号":2
                };
                _this.searchType_params["type"]=json[cur_opt];
            }
        });
        this.search_inp=new Select({
            source : "/r/admin_Config/getSearch/",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
            ajaxType : "post",
            ajaxParams : _this.searchType_params,
            isFillContent:false,
            filterType : "ajax",  //指定过滤方式为ajax
            field : {
                id : "id",
                name : "dname",
                keyword : "keyword"
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
                var result={};
                 result["code"] = 200;
                result["data"] = res.data[0]==undefined?res.data:res.data[0];
                 result["msg"] = res.msg;
                return result;
            }
        });

        this.open_function_select_dialog=new SelectScroll({
            id:"open_function_select_dialog",
            arr:["优惠券","营销管理","会员卡","团购导码","分销商首页","微商城票付通支持","线下充值","订单手机号隐藏","年卡会员管理"],
            callback:function(cur_opt){
                $("#open_function_select_dialog").attr({"data-status":_this.SelectJson[cur_opt],"data-name":cur_opt})
            }
        });
        this.search_type_select_dialog=new SelectShort({
            id:"search_type_select_dialog",
            arr:["账号名称","账号","手机号"],
            callback:function(cur_opt){
                var json={
                    "账号名称":0,
                    "账号":1,
                    "手机号":2
                };
                _this.searchType_params_dialog["type"]=json[cur_opt];
            }
        });
        this.search_inp_dialog=new Select({
            source : "/r/admin_Config/getSearch/",//http://www.12301.cc/call/jh_mem.php?action=fuzzyGetDname_c&dname=sdf&dtype=1
            ajaxType : "post",
            ajaxParams : _this.searchType_params_dialog,
            isFillContent:false,
            filterType : "ajax",  //指定过滤方式为ajax
            field : {
                id : "id",
                name : "dname",
                keyword : "keyword"
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
                var result={};
                result["code"] = 200;
                result["data"] = res.data[0]==undefined?res.data:res.data[0];
                result["msg"] = res.msg;
                return result;
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
            _this.filterParamsBox["page"]=toPage;
            var cacheKey=_this.JsonStringify(_this.filterParamsBox);
            if(_this.dataContainer[cacheKey]){
                _this.dealresData(_this.dataContainer[cacheKey]);
            }else{
                _this.ajaxGetData({
                    "params":_this.filterParamsBox,
                    "isCacheData":true,
                    "cacheKey":cacheKey,
                    "isInitPagination":false
                });
            }
        });

        this.bind()
    },
    bind:function () {
        var _this=this;
        //清除商户搜索框按钮
        $(".clear_inp").on("click",function () {
            $(this).siblings("input").val("").attr({"data-id":"","data-dname":""});
        });
        //给搜索按钮添加事件
        $("#filter_search").on("click",function(){
            // _this.dataContainer={};       //查询按钮点击时，清除数据缓存
            _this.filterParamsBox={
                "status":$("#open_function_select").attr("data-status"),
                "fid":$("#search_inp").attr("data-id")
            };
            _this.filterParamsBox["page"]=1;
            _this.filterParamsBox["pagesize"]=_this.perPageNum;

            var cacheKey=_this.JsonStringify(_this.filterParamsBox);
            _this.ajaxGetData({
                "params":_this.filterParamsBox,
                "isCacheData":true,
                "cacheKey":cacheKey,
                "isInitPagination":true      //是否初始化分页器
            });
        });
        //给删除添加事件
        $(".tableCon_box").on("click",".delete_fun",function () {
            var tarBtn=$(this);
            if(tarBtn.hasClass("disabled"))  return false;
            var uid=$(this).parent().attr("uid");
            var dname=$(this).parent().attr("dname");
            var fid=$(this).parent().attr("fid");
            var access=$(this).parent().attr("access");
            var isDel=confirm('是否删除用户"'+dname+'"的"'+access+'"权限');
            if (!isDel) return false;
            var params={
                "status":fid,
                "uid":uid
            };
            $.ajax({
                url: "/r/admin_Config/delConfig/",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                data: params,    //参数值
                type: "GET",   //请求方式
                timeout:5000,   //设置超时 5000毫秒
                beforeSend: function() {//请求前的处理
                    tarBtn.text("删除中...").addClass("disabled")
                },
                success: function(res) {//请求成功时处理
                    if(res){
                        if(res.code=="200"){
                            PFT.Util.STip("success","删除成功");
                            tarBtn.text("已删除");
                            $("#filter_search").click()
                        }else{
                            PFT.Util.STip("fail",res.msg);
                            tarBtn.text("删除").removeClass("disabled")
                        }
                    }else{
                        alert("没有请求结果，请重试");
                        tarBtn.text("删除").removeClass("disabled")
                    }
                },
                complete: function(res,status) {
                    //请求完成的处理
                    if(status=="timeout"){
                        alert("请求超时，请重试");
                        tarBtn.text("删除").removeClass("disabled")
                    }
                },
                error: function() {//请求出错处理
                    alert("请求出错，请重试");
                    tarBtn.text("删除").removeClass("disabled")
                }
            });

        });
        //添加权限事件
        $("#btn_add_fun").on("click",function () {
            Dialog.open()
        })
    },
    //ajax获取数据
    ajaxGetData:function (data) {
        var _this=this;
        var api="/r/admin_Config/getConfig/";
        $.ajax({
            url: api,                                //请求的url地址"/r/report_statistics/orderList/"
            dataType: "json",                            //返回格式为json
            async: true,                                  //请求是否异步，默认为异步，这也是ajax重要特性
            data: data.params,                            //参数值
            type: "GET",                                  //请求方式
            beforeSend: function() {
                //请求前的处理
                // _this.total_box.hide();
                _this.tableCon_box.hide();
                _this.pagination_box.hide();
                _this.queryState_box.html(querying_tpl).show();
            },
            success: function(res) {
                if(res.code==200){
                    if(res.data.data.length==0){
                        // _this.total_box.hide();
                        _this.tableCon_box.hide();
                        _this.pagination_box.hide();
                        _this.queryState_box.show().text("未查询到任何数据，请重新输入条件搜索...");
                    }else{
                        _this.queryState_box.hide();
                        _this.dealresData(res);
                        if(data.isCacheData){            //缓存查询的数据
                            _this.dataContainer[data.cacheKey]=res;
                        }
                        if(data.isInitPagination){       //是否初始化分页器
                            var totalPages= Math.ceil(res.data.totalnum/_this.perPageNum);
                            var currentPage= 1;
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
                    _this.queryState_box.show().text(res.msg);
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
    //定义一个select Json
    SelectJson:{
        "全部":0,
        "优惠券":1,
        "营销管理":2,
        "会员卡":3,
        "团购导码":4,
        "分销商首页":5,
        "微商城票付通支持":6,
        "线下充值":7,
        "订单手机号隐藏":8,
        "年卡会员管理":9
    },
    template:PFT.Util.ParseTemplate(tableTR_tpl),
    dealresData:function (res) {
        var _this=this;
        var html=this.template({data:res.data.data})
        this.tableCon_box.find("tbody").html(html);
        _this.tableCon_box.fadeIn(200);
        _this.pagination_box.fadeIn(200);
    },
    //搜索框的ajax过滤参数
    searchType_params:{
        "type" : "0",
        "keyword":""
    },
    //搜索框的ajax过滤参数
    searchType_params_dialog:{
        "type" : "0",
        "keyword":""
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
   OpenFun.init();
    $("#filter_search").click()
});
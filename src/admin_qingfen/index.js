/**
 * Created by Administrator on 2016/9/27.
 */

/**
 * @mode                1=日结，2=周结，3=月结
 * @freeze_type        0=冻结未使用订单，1=按比例冻结，2=按固定金额冻结
 * @status             1=清分成功，2=待清算, 3=清算,待转账，4=清算或是清分出现问题,具体见备注
 * @settle_time       清分时间
 * @transfer_time     转账时间
 * @freeze_money      预留金额  -1表示暂未清算
 *
 */

//引入css
require("./index.scss");
//引入各种tpl
var tableCon_tpl=require("./tpl/tableCon.xtpl");
var qingfenTR_tpl=require("./tpl/qingfenTR.xtpl");
var dialogTR_tpl=require("./tpl/dialogTR.xtpl");
var dialog_tpl=require("./tpl/dialog.xtpl");
//引入各种插件
var Pagination = require("COMMON/modules/pagination-x");
var ParseTemplate=require("COMMON/js/util.parseTemplate.js");
var Dialog=require("COMMON/modules/dialog-simple");

var Dial=new Dialog({
    width : 600,
    offsetY : -80,
    closeBtn : true,
    content : dialog_tpl,
    drag : true,
    speed : 100,
    onCloseAfter : function(){
    }
});


var admin_qingfen={
    init:function () {
        var _this=this;
        this.fid=(location.href).match(/fid=[\d]+/g)[0].match(/[\d]+$/)[0];
        //获取内容盒子
        this.tableCon_box=$(".tableCon_box");
        this.pagination_wrap=$("#pagination_wrap");
        this.queryState_box=$(".queryState_box");
        //往盒子中添加内容
        this.tableCon_box.html(tableCon_tpl);

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
            _this.queryParamsBox={
                "page":toPage,
                "size":_this.perPageNum,
                "fid":_this.fid
            };
            var cacheKey=_this.JsonStringify(_this.queryParamsBox);
            if(_this.dataContainer[cacheKey]){
                _this.dealResData(_this.dataContainer[cacheKey]);
            }else{
                _this.ajaxGetData({
                    "api":"/r/Finance_SettleBlance/getRecords/",
                    "params":_this.queryParamsBox,
                    "isCacheData":true,
                    "cacheKey":cacheKey,
                    "isInitPagination":false
                });
            }
            _this.pagination.render({current:toPage,total:totalPage});
            $("html,body").animate({"scrollTop":257},200,"swing")
        });
        //弹框分页器部分
        this.pagination_wrap_dialog = new Pagination({
            container : "#pagination_wrap_dialog" , //必须，组件容器id
            count : 5,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });
        this.pagination_wrap_dialog.on("page.switch",function(toPage,currentPage,totalPage){
            // toPage :      要switch到第几页
            // currentPage : 当前所处第几页
            // totalPage :   当前共有几页
            _this.dialog_queryParamsBox["page"]=toPage;
            var cacheKey=_this.JsonStringify(_this.dialog_queryParamsBox);
            if(_this.dataContainer[cacheKey]){
                _this.dialog_dealResData(_this.dataContainer[cacheKey]);
            }else{
                _this.dialog_ajaxGetData({
                    "api":"/r/Finance_SettleBlance/getFrozeOrders/",
                    "params":_this.dialog_queryParamsBox,
                    "isCacheData":true,
                    "cacheKey":cacheKey,
                    "isInitPagination":false
                });
            }
            _this.pagination_wrap_dialog.render({current:toPage,total:totalPage});
        });


        this.queryParamsBox={
            "page":"1",
            "size":_this.perPageNum,
            "fid": _this.fid
        };
        this.ajaxGetData({
            "api":"/r/Finance_SettleBlance/getRecords/",
            "params": _this.queryParamsBox,
            "isInitPagination":true,
            "isCacheData":true,
            "cacheKey":_this.JsonStringify(_this.queryParamsBox)
        });
        this.bind();
    },
    bind:function(){
        var _this=this;
        //点击未使用订单时
        this.tableCon_box.on("click",".dongji_nouseorder",function(){
            Dial.open();
            var qingsuan_time=$(this).attr("time");
            var cycle_mark=$(this).attr("cycle_mark");
            var mode=$(this).attr("mode");
            _this.dialog_queryParamsBox={
                "cycle_mark":cycle_mark,
                "mode":mode,
                "fid":_this.fid
            };

            $.ajax({
                url: "/r/Finance_SettleBlance/getFrozeSummary/",      //请求的url地址
                dataType: "json",                                         //返回格式为json
                async: true,                                               //请求是否异步，默认为异步，这也是ajax重要特性
                data: _this.dialog_queryParamsBox,                       //参数值
                type: "post",                                              //请求方式
                beforeSend: function() {                                   //请求前的处理

                },
                success: function(res) {
                    $(".dialog_con .title ul").html('<li>清算时间：'+qingsuan_time+'</li><li>冻结金额：'+res.data.money/100+'</li>')
                },
                complete: function() {
                    //请求完成的处理
                },
                error: function() {
                    //请求出错处理
                }
            });
            _this.dialog_queryParamsBox={
                "cycle_mark":cycle_mark,
                "mode":mode,
                "fid":_this.fid,
                "page":1,
                "size":_this.perPageNum
            };
            _this.dialog_ajaxGetData({
                "api":"/r/Finance_SettleBlance/getFrozeOrders/",
                "params":_this.dialog_queryParamsBox,
                "isCacheData":true,
                "cacheKey":_this.JsonStringify(_this.dialog_queryParamsBox),
                "isInitPagination":true
            });
        })
    },
    /**
     *数据获取、适配加工、页面渲染部分
     */
    ajaxGetData:function (data) {
        var _this=this;
        $.ajax({
            url: data.api,                                //请求的url地址"/r/report_statistics/orderList/"
            dataType: "json",                            //返回格式为json
            async: true,                                  //请求是否异步，默认为异步，这也是ajax重要特性
            data: data.params,                            //参数值
            type: "post",                                  //请求方式
            beforeSend: function() {
                //请求前的处理
                _this.tableCon_box.hide();
                _this.pagination_wrap.hide();
                _this.queryState_box.show().text("查询数据中，请稍候...");
            },
            success: function(res) {

                if(res.code==200){
                    if(res.data.list.length==0){
                        _this.tableCon_box.hide();
                        _this.pagination_wrap.hide();
                        _this.queryState_box.show().text("未查询到任何数据，请重试...");
                    }else{
                        _this.dealResData(res);
                        if(data.isCacheData){            //缓存查询的数据
                            _this.dataContainer[data.cacheKey]=res;
                        }
                        if(data.isInitPagination){       //是否初始化分页器
                            if(parseInt(res.data.total_page)>1){
                                var totalPages= Math.ceil(res.data.count/_this.perPageNum);
                                var currentPage= 1;
                                _this.pagination.render({current:currentPage,total:totalPages});
                            }
                        }
                    }
                }else{
                    _this.queryState_box.show().text(res.msg);
                }
            },
            complete: function() {
                //请求完成的处理
            },
            error: function() {
                //请求出错处理
                _this.tableCon_box.hide();
                _this.pagination_wrap.hide();
                _this.queryState_box.show().text("查询出错，请重试...");
            }
        });

    },
    dialog_ajaxGetData:function (data) {
        var _this=this;
        $.ajax({
            url: data.api,                                           //请求的url地址""/r/Finance_SettleBlance/getFrozeOrders/"
            dataType: "json",                              //返回格式为json
            async: true,                                    //请求是否异步，默认为异步，这也是ajax重要特性
            data: data.params,            //参数值
            type: "post",                                   //请求方式
            beforeSend: function() {
                //请求前的处理
               $(".dialog_con .table_con").hide();
               $("#pagination_wrap_dialog").hide();
               $(".dialog_con .queryState_box").show().text("查询数据中，请稍候...");
            },
            success: function(res) {
                if(res.code==200){
                    if(res.data.list.length==0){
                        $(".dialog_con .table_con").hide();
                        $("#pagination_wrap_dialog").hide();
                        $(".dialog_con .queryState_box").show().text("未查询到任何数据，请重试...");
                    }else{
                        _this.dialog_dealResData(res);
                        if(data.isCacheData){            //缓存查询的数据
                            _this.dataContainer[data.cacheKey]=res;
                        }
                        if(data.isInitPagination){       //是否初始化分页器
                            if(parseInt(res.data.total_page)>1){
                                var totalPages= Math.ceil(res.data.count/_this.perPageNum);
                                var currentPage= 1;
                                _this.pagination_wrap_dialog.render({current:currentPage,total:totalPages});
                            }
                        }
                    }
                }else{
                    $(".dialog_con .queryState_box").show().text(res.msg);
                }
            },
            complete: function() {
                //请求完成的处理
            },
            error: function() {
                //请求出错处理
                $(".dialog_con .table_con").hide();
                $("#pagination_wrap_dialog").hide();
                $(".dialog_con .queryState_box").show().text("查询出错，请重试...");
            }
        });
    },
    dealResData:function (res) {
        var _this=this;
        var list=res.data.list;
        var adaptData=[];
        for(var i in list){
            var obj={};
            obj["settle_time"]=_this.timezone(list[i].settle_time,true);                          //清算时间
            var mode={
                "1":"日结",
                "2":"周结",
                "3":"月结"
            };
            obj["mode"]=mode[list[i].mode];                                                           //结算方式
            obj["init_money"]=list[i].init_money=="-1"?"0":list[i].init_money/100;                 //预计提现金额
            obj["transfer_money"]=list[i].transfer_money=="-1"?"0":list[i].transfer_money/100;      //转账金额
            obj["settle_money"]=list[i].settle_money=="-1"?"0":list[i].settle_money/100;          //清分时余额
            var freeze_type={
                "0":'<a class="dongji_nouseorder" cycle_mark="'+list[i].cycle_mark+'" mode="'+list[i].mode+'" time="'+obj["settle_time"]+'">冻结未使用订单</a>',
                "1":"按比例冻结",
                "2":"按固定金额冻结"
            };
            obj["freeze_type"]=freeze_type[list[i].freeze_type];                                    //冻结方式
            obj["freeze_money"]=list[i].freeze_money=="-1"?"0":list[i].freeze_money/100;          //冻结金额
            var status={
                "1":"转账成功",
                "2":"待清算",
                "3":"清算,待转账,预计转账时间:"+_this.timezone(list[i].transfer_time,true),
                "4":list[i].settle_remark
            };
            obj["status"]=status[list[i].status];                                                      //状态
            adaptData.push(obj)
        }


        var html=_this.template({data:adaptData});

        $(".tableCon_box table.con_tb tbody").html(html);
        $(".tableCon_box table.con_tb tbody tr:odd").addClass("gray");
        _this.tableCon_box.fadeIn(200);
        _this.queryState_box.hide()

    },
    dialog_dealResData:function (res) {
        var _this=this;
        var list=res.data.list;
        var html=_this.dialog_template({data:list});
        $(".dialog_con .table_con .dialog_tb tbody").html(html);
        $(".dialog_con .table_con .dialog_tb tbody tr:odd").addClass("gray")
        $(".dialog_con .table_con").fadeIn(200);
        $(".dialog_con .queryState_box").hide();
    },
    template:ParseTemplate(qingfenTR_tpl),
    dialog_template:ParseTemplate(dialogTR_tpl),
    //定义一个query参数暂存容器，只有当查询数据时才会更新此容器
    queryParamsBox:{},
    //定义一个query参数暂存容器，只有当查询数据时才会更新此容器
    dialog_queryParamsBox:{},
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
    },
    //php时间戳转化成时间函数
    timezone:function (time,isFull){
        var v = time;
        if (/^(-)?\d{1,10}$/.test(v)) {
            v = v * 1000;
        } else if (/^(-)?\d{1,13}$/.test(v)) {
            v = v * 1;
        } else {
            alert("时间戳格式不正确");
            return;
        }
        var dateObj = new Date(v);
        var ymdhis = "";
        ymdhis += dateObj.getFullYear() + '-';
        ymdhis += (dateObj.getMonth() + 1)+ '-';
        ymdhis += dateObj.getDate()+'';
        if (isFull === true)
        {
            ymdhis += " " + dateObj.getHours() + ':';
            var gmin = dateObj.getMinutes();
            var gsec = dateObj.getSeconds();
            if((String(gmin)).length == 1){
                ymdhis += "0"+gmin+':';
            }else{
                ymdhis += gmin+':';
            }
            if((String(gsec)).length == 1){
                ymdhis += "0"+gsec;
            }else{
                ymdhis += gsec;
            }
        }
        return ymdhis;
}
};

$(function () {
    admin_qingfen.init();
});

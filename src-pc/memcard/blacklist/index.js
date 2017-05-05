/**
 * Created by Administrator on 2017/4/28.
 */

//-------------css--------------
require("./index.scss");

//-------------tpl--------------
var frameTpl = require("./tpl/frame.xtpl");

//-----------modules------------
var Message = require("pft-ui-component/Message");
var renderNav = require("../common/nav/index.js");
var Pagination = require("COMMON/modules/pagination-x");
//增加黑名单
var Dialog_add = require("./dialog-add/dialog.js");
//导入excel
var Dialog_excel = require("./dialog-excel/dialog.js");
//编辑
var Dialog_edit = require("./dialog-edit/dialog.js");
var Select = require("COMMON/modules/select");
//公共资源common resource
var CR = require("./CR.js");


var blackList = PFT.Util.Class({

    init: function () {
        var _this = this;
        this.container = $("#GBlacklistWrap");
        this.container.html(frameTpl);
        //初始化导航栏
        renderNav("2" , this.container.find(".nav-box"));
        //初始化分页器
        this.pagination = new Pagination({
            container : _this.container.find(".pag-box") , //必须，组件容器id
            count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });
        this.pagination.render({current:1,total:10});
        this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
            _this.pagination.render({current:toPage,total:totalPage});
        });
        this.getLandsData();
        this.bind()
    },

    bind: function () {
        var _this = this ;
        var CON = this.container;

        //点击导入excel
        CON.on("click" ,".filter-box .leading-in" ,function (e) {
            //判断是否new过
            if( !_this.dialog_excel ){
                _this.dialog_excel = new Dialog_excel();
                _this.dialog_excel.show();
            }else{
                _this.dialog_excel.show();
            }
        });

        //点击主页面产品选择框
        CON.on("click" ,".filter-box #landInpMain" ,function (e) {
            //点击时才初始化产品选择框
            if( !_this.mainLandSelect ){
                _this.mainLandSelect = new Select({
                    height:300,
                    field : {
                        id : "id",
                        name : "title",
                        keyword : "title"
                    },
                    trigger : $("#landInpMain"),
                    data: _this.landListData
                });
                $(this).click();
            }
        });

        //点击添加黑名单按钮
        CON.on("click" ,".filter-box .add-btn" ,function (e) {
            //判断是否new过
            if( !_this.dialog_add ){
                _this.dialog_add = new Dialog_add({landListData: _this.landListData});
                _this.dialog_add.show();
            }else{
                _this.dialog_add.show();
            }
        });

        //点击编辑按钮
        CON.on("click" ,".table-box .edit-btn" ,function (e) {
            //判断是否new过
            if( !_this.dialog_edit ){
                _this.dialog_edit = new Dialog_edit({landListData: _this.landListData});
                _this.dialog_edit.show();
            }else{
                _this.dialog_edit.show();
            }
        });

        //点击删除按钮
        CON.on("click" ,".table-box .delete-btn" ,function (e) {
            Message.confirm("是否删除？",function (result) {
                console.log(result)
            })
        });

        //点击搜索
        CON.on("click" ,".filter-box .search-btn", function (e) {

        })

    },

    /**
     * 获取产品列表数据
     */
    getLandsData: function () {
        var _this = this;
        $.ajax({
            url: CR.url.getLand,    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: {},    //参数值
            type: "GET",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                // 请求成功时处理
                _this.landListData = res.data;
            },
            complete: function(res,status) {
                //请求完成的处理
                if(status=="timeout"){
                    Message.warning("获取产品列表数据，请求超时");
                }
            },
            error: function() {
                //请求出错处理
                Message.warning("获取产品列表数据，请求出错");
            }
        });
    },

    /**
     * @method 获取景区黑名单
     */
    getBlacklistData: function () {
        var _this = this;
        _this.paramHub.id_card = _this.container.find(".filter-box .id-card-inp").val();
        _this.paramHub.lid = _this.container.find(".filter-box .land-inp").val();
        var params = _this.paramHub;
        //看看是否有缓存
        if(_this.cacheHub[$.param(_this.paramHub)]){
            //render
            var res = _this.cacheHub[$.param(params)];
            dealRes( res );
            return false;
        }else{
            //显示查询状态
            _this.showLoading('loading');
        }
        $.ajax({
            url: CR.url.getBlacklist,    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: params,    //参数值
            type: "POST",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                // 请求成功时处理
                //缓存数据
                _this.cacheHub[$.param(params)] = $.extend({},res);
                console.log(res)
                // dealRes( res )
            },
            complete: function(res,status) {
                //请求完成的处理
                // _this.hideLoading();
                if(status=="timeout"){
                    alert("请求超时")
                }
            },
            error: function() {
                //请求出错处理
                // _this.hideLoading();
            }
        });

        function dealRes( res ) {
            if(res.code == 200 ){
                if(_this.judgeTrue(res.data)){

                }else{
                    _this.hideLoading();
                    // _this.showLoading("error","暂无价格数据");
                }
            }else{
                //通知queryState模块显示错误信息
                _this.showLoading("error",res.msg);
            }
        }
    },

    /**
     * @method 参数仓库
     */
    paramHub: {},

    /**
     * @Object 缓存仓库
     */
    cacheHub: {},

    /**
     * @mehtod 判断真假
     */
    judgeTrue: function( param ) {
        var type = Object.prototype.toString.call(param);
        switch (type){
            case '[object Array]':
                return param.length === 0 ?  !1 : !0 ;
                break;
            case '[object Object]':
                var t;
                for (t in param)
                    return !0;
                return !1;
                break;
            case '[object String]':
                return param === '' ? !1 : !0 ;
                break;
            case '[object Number]':
                return param === 0 ? !1 : !0 ;
                break;
            case '[object Boolean]':
                return param === false ? !1 : !0;
                break;
            case '[object Null]':
                return !1;
                break;
            case '[object Undefined]':
                return !1;
                break;
            default :
                return type;
        }
    }




});

$(function () {
    new blackList();
});

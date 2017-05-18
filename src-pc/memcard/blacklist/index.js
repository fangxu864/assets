/**
 * Created by Administrator on 2017/4/28.
 */

//-------------css--------------
require("./index.scss");

//-------------tpl--------------
var frameTpl = require("./tpl/frame.xtpl");
var mainTbTpl = require("./tpl/maintb.xtpl");
//-----------通用插件-----------
var Message = require("pft-ui-component/Message");
var Pagination = require("COMMON/modules/pagination-x");
var Select = require("COMMON/modules/select");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
var tips = require("COMMON/modules/tips/index.js");
var Tips = new tips ();
//-----------自建模块-----------
var renderNav = require("../common/nav/index.js");
//增加黑名单
var Dialog_add = require("./dialog-add/dialog.js");
//导入excel
var Dialog_excel = require("./dialog-excel/dialog.js");
//编辑
var Dialog_edit = require("./dialog-edit/dialog.js");
//公共资源common resource
var CR = require("./CR.js");
var readIdCard = require("../common/readIdCard/index.js");
var readIdCard1 = new readIdCard();


var blackList = PFT.Util.Class({

    init: function () {
        var _this = this;
        this.container = $("#GBlacklistWrap");
        this.container.html(frameTpl);
        this.mainTbContainer =  this.container.find(".table-box .main-tb tbody");
        //初始化导航栏
        renderNav("2" , this.container.find(".nav-box"));
        //初始化分页器
        this.pagination = new Pagination({
            container : _this.container.find(".pag-box") , //必须，组件容器id
            count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });

        this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
            _this.paramHub.page = toPage;
            _this.getBlacklistData();
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
                _this.dialog_excel = new Dialog_excel({landListData: _this.landListData});
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
                    isFillContent:true,
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
                _this.dialog_add.on("blackListAddSuccess",function (opt) {
                    CON.find("#landInpMain").val(opt.val).attr("data-id" , opt.lid);
                    CON.find(".filer-box .id-card-inp").val("");
                    CON.find(".search-btn").click();
                })
            }else{
                _this.dialog_add.show();
            }
        });

        //点击编辑按钮
        CON.on("click" ,".table-box .edit-btn" ,function (e) {
            var curBtn = $(this);
            var opt = {};
            opt.id = curBtn.attr("data-id");
            opt.lid = curBtn.attr("data-lid");
            opt.landName = $("#landInpMain").val();
            opt.name = curBtn.attr("data-name");
            opt.id_card = curBtn.attr("data-idnum");
            //判断是否new过
            if( !_this.dialog_edit ){
                _this.dialog_edit = new Dialog_edit({landListData: _this.landListData});
                _this.dialog_edit.on("editSuccess" , function () {
                    _this.getBlacklistData();
                });
                _this.dialog_edit.show(opt);
            }else{
                _this.dialog_edit.show(opt);
            }
        });

        //点击删除按钮
        CON.on("click" ,".table-box .delete-btn" ,function (e) {
            var id = $(this).attr("data-id");
            var lid = $(this).attr("data-lid");
            Message.confirm("是否删除？",function (result) {
                if(result){
                    $.ajax({
                        url: CR.url.deleteBlacklist,    //请求的url地址
                        dataType: "json",   //返回格式为json
                        async: true, //请求是否异步，默认为异步
                        data: {id:id,lid:lid},    //参数值
                        type: "POST",   //请求方式
                        timeout:5000,   //设置超时 5000毫秒
                        beforeSend: function() {
                            //请求前的处理
                        },
                        success: function(res) {
                            // 请求成功时处理
                            if(res.code == 200 ){
                                console.log("fdsfs");
                                _this.getBlacklistData();
                                Message.success("删除成功");
                            }else{
                                Message.error(res.msg);
                            }
                        },
                        complete: function(res,status) {
                            //请求完成的处理
                            if(status=="timeout"){
                                Message.error("发送删除的请求超时");
                            }
                        },
                        error: function() {
                            //请求出错处理
                            Message.error("请求出错");
                        }
                    });
                }
            })
        });

        //点击搜索
        CON.on("click" ,".filter-box .search-btn", function (e) {
            var landInp =  _this.container.find(".filter-box .land-inp");
            var idNumInp =  _this.container.find(".filter-box .id-card-inp");
            _this.paramHub.id_card = $.trim( idNumInp.val());
            _this.paramHub.lid = landInp.attr("data-id");
            if(!CR.judgeTrue(_this.paramHub.lid )){
                Tips.closeAllTips();
                Tips.show({
                    lifetime : 1500 ,
                    direction:'right',
                    hostObj : landInp ,
                    content : "请选择产品",
                    bgcolor : "#f0c245"
                });
                return false;
            }
            if(_this.paramHub.id_card !=  ""){
                if(!PFT.Util.Validate.idcard(_this.paramHub.id_card)){
                    Tips.closeAllTips();
                    Tips.show({
                        lifetime : 1500 ,
                        direction:'right',
                        hostObj : idNumInp ,
                        content : "请填写正确的身份证号",
                        bgcolor : "#f0c245"
                    });
                    return false;
                }

            }
            _this.paramHub.page = 1;
            _this.getBlacklistData();
        });

        //点击读卡
        CON.on("click" ,".filter-box .get-idNum" ,function (e) {
            readIdCard1.doSend('{"cmd":"idread"}');
        });

        readIdCard1.on("socketMessage" ,function (data) {
            CON.find(".filter-box .id-card-inp").val(data.code)
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
                //初始化处理
                _this.mainLandSelect = new Select({
                    isFillContent:true,
                    height:300,
                    field : {
                        id : "id",
                        name : "title",
                        keyword : "title"
                    },
                    trigger : $("#landInpMain"),
                    data: _this.landListData
                });
                _this.container.find(".filter-box .search-btn").click();
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
        var params = _this.paramHub;
        var loadingStr = PFT.Util.LoadingPc("努力加载中...",{
            tag : "tr",
            colspan : 4,
            height : 200
        });
        //看看是否有缓存
        // if(_this.cacheHub[$.param(_this.paramHub)]){
        //     //render
        //     var res = _this.cacheHub[$.param(params)];
        //     dealRes( res );
        //     return false;
        // }else{
        //     //显示查询状态
        //     // _this.showLoading('loading');
        // }
        $.ajax({
            url: CR.url.getBlacklist,    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: params,    //参数值
            type: "POST",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
                _this.mainTbContainer.html(loadingStr);
            },
            success: function(res) {
                // 请求成功时处理
                //缓存数据
                _this.cacheHub[$.param(params)] = $.extend({},res);
                dealRes( res )
            },
            complete: function(res,status) {
                //请求完成的处理
                // _this.hideLoading();
                if(status=="timeout"){
                    Message.alert("请求超时")
                }
            },
            error: function() {
                //请求出错处理
                _this.mainTbContainer.html("<tr><td colspan='4' style='height: 200px;text-align: center;font-size: 14px;color: orangered'>请求出错，请稍后重试...</td></tr>");
            }
        });

        function dealRes( res ) {
            if(res.code == 200 ){
                if(CR.judgeTrue(res.data.list)){
                    var html = _this.mainTbTemplate({data: res.data});
                    _this.mainTbContainer.html(html);
                    _this.pagination.render({current:res.data.page ,total: Math.ceil(Number(res.data.count) / _this.pageSize )});
                }else{
                    // _this.hideLoading();
                    //如果最后一页没数据，但是总数大于0，请求前一页的数据
                    if( Number(res.data.count) > 0){
                        _this.paramHub.page = Number(res.data.page) - 1;
                        _this.getBlacklistData();
                    }else{
                        _this.container.find(".pag-box").hide();
                        _this.mainTbContainer.html("<tr><td colspan='4' style='height: 200px;text-align: center;font-size: 14px;color: orangered'>暂无数据，请重新输入条件搜索</td></tr>");
                    }
                   }
            }else{
                //通知queryState模块显示错误信息
                _this.mainTbContainer.html("<tr><td colspan='4' style='height: 200px;text-align: center;font-size: 14px;color: orangered'>"+res.msg+"</td></tr>");
                _this.container.find(".pag-box").hide();
            }
        }
    },
    mainTbTemplate: ParseTemplate(mainTbTpl),

    /**
     * @method 参数仓库
     */
    paramHub: {
        page_size: 10
    },

    /**
     * @Object 缓存仓库
     */
    cacheHub: {},

    pageSize:10




});

$(function () {
    new blackList();
});

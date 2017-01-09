/**
 * Created by Administrator on 2016/12/28.
 */
//css
require("./index.scss");
//tpl
var tpl = require("./tpl/index.xtpl");
$("#download_center").html(tpl);
var table_tr_tpl = require ("./tpl/table_tr.xtpl");
var querying_tpl = require ("./tpl/querying.xtpl");
//module
var Pagination = require("COMMON/modules/pagination-x");



var DownloadCenter = {
    /**
     * @method 初始化
     */
    init : function () {
        var _this = this ;
        //获取三个容器
        this.table_box=$("#table_box");
        this.pagination_box=$("#pagination_box");
        this.query_state_box=$("#query_state_box");

        //分页器部分
        this.pagination = new Pagination({
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
            var cacheKey = $.param(_this.filterParamsBox);
            if(_this.dataContainer[cacheKey]){
                _this.renderResData(_this.dataContainer[cacheKey]);
            }else{
                _this.ajaxGetTabData({
                    "params":_this.filterParamsBox,
                    "isCacheData":true,
                    "cacheKey":cacheKey,
                    "isInitPagination":false
                });
            }
        });
        this.bind();

        //初始页面，请求数据
        this.ajaxGetTabData({
            params : _this.filterParamsBox ,
            isCacheData : true ,
            cacheKey : $.param(_this.filterParamsBox) ,
            isInitPagination :true
        })
    } ,


    /**
     * bind
     */
    bind : function () {
        var _this = this;
        //给下载按钮添加绑定事件
        $("#table_box").on("click",".down_href",function () {
            if($(this).hasClass("disabled")) return false ;
            var downUrl = "/r/MassData_StartDown/index?id=" + $(this).attr("data-id");
            $.get(downUrl,function(res){
                if(res.code){
                    PFT.Util.STip("fail",res.msg)
                }else{
                    _this.outExcel(downUrl)
                }
            })
        })
    },


    /**
     * @method 表格数据行的解析模板
     */
    tableTrTemplate : PFT.Util.ParseTemplate(table_tr_tpl) ,


    /**
     * @method 获取表格数据
     */
    ajaxGetTabData : function (opt) {
        var _this = this ;
        $.ajax({
            url: "/r/MassData_StartDown/getList",      //请求的url地址
            dataType: "json",                            //返回格式为json
            async: true,                                  //请求是否异步，默认为异步，这也是ajax重要特性
            data: opt.params,                             //参数值
            type: "POST",                                 //请求方式
            timeout: 10000 ,
            beforeSend: function() {
                //请求前的处理
                _this.table_box.hide();
                _this.pagination_box.hide();
                _this.query_state_box.show().html(querying_tpl);
            },
            success: function(res) {
                if(res.code==200){
                    if(res.data.list.length==0){
                        _this.table_box.hide();
                        _this.pagination_box.hide();
                        _this.query_state_box.show().text("暂无任何可下载任务...");
                    }else{

                        _this.query_state_box.hide();
                        _this.renderResData(res);
                        if(opt.isCacheData){            //缓存查询的数据
                            _this.dataContainer[opt.cacheKey]=res;
                        }
                        if(opt.isInitPagination){       //是否初始化分页器
                            var totalPages= res.data.totalPage;
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
                    _this.query_state_box.show().text(res.msg);
                }
            },
            complete: function(res,status) {
                //请求完成的处理
                if(status=="timeout"){
                    alert("请求超时");
                }
            },
            error: function() {
                //请求出错处理
                alert("请求出错");
            }
        });
    },


    /**
     * @method 处理渲染表格数据
     * @param res
     */
    renderResData:function (res) {
        var _this=this;

        var html = _this.tableTrTemplate({data : res.data.list});
        _this.table_box.find(".total_table tbody").html(html);
        _this.table_box.fadeIn(200);
        _this.pagination_box.fadeIn(200);
    },


    /**
     * @property 定义一个数据缓存容器，存储分页获取的数据
     */
    dataContainer : { },


    /**
     * @property 定义一个filter参数暂存容器，只有当查询按钮点击时才会更新此容器
     */
    filterParamsBox:{
        "page" : 1 ,
        "pageSize" : 10
    },


    /**
     * @method                   导出excel
     * @param downloadUrl        下载url
     */
    outExcel : function (downloadUrl) {
        var iframeName = "iframe" + new Date().getTime();
        $("body").append(' <iframe style="display: none" name="'+iframeName+'"></iframe>');
        window.open(downloadUrl, iframeName);
    },


};


$(function () {
    DownloadCenter.init();
});
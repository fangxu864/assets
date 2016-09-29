/**
 * Created by Administrator on 2016/9/27.
 */

require("./index.scss");
//引入各种tpl
var tableCon_tpl=require("./tpl/tableCon.xtpl");


var admin_qingfen={
    init:function () {
        var _this=this;
        //获取内容盒子
        this.tableCon_box=$(".tableCon_box");
        //往盒子中添加内容
        this.tableCon_box.html(tableCon_tpl);

        this.ajaxGetData({
            "api":"/r/Finance_SettleBlance/getRecords/",
            "params":{
                "page":"1",
                "size":"20",
                "fid":"2"
            }
            
        })
    },
    bind:{
        
    },
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

    }
    
}

$(function () {
    admin_qingfen.init();
})

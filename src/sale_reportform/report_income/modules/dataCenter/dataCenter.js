
var DataCenter = {
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.bind();
    },

    bind: function () {
        var _this = this;
        // 获取主要数据
        this.CR.pubSub.sub("DC.getMainData", function ( params ) {
            _this.getMainData( params );
        });
    },

    /**
     * @method 获取主要数据
     */
    getMainData: function ( params ) {
        var _this = this;
        //显示查询状态
        _this.CR.pubSub.pub("queryStateBox.querying");
        // //关闭tableCon
        // _this.CR.pubSub.pub("tableConBox.close");
        // //关闭pagination
        // _this.CR.pubSub.pub("paginationBox.close");`
        $.ajax({
            url: " /r/report_statistics/checkedPaywayList",    //请求的url地址
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
                if(res.code == 200 ){
                    _this.CR.pubSub.pub("queryStateBox.close");
                    if(res.data.position == 1){
                        _this.container.find(".line4").show();
                    }
                    //通知table模块render
                    _this.CR.pubSub.pub("tableConBox.render", res );
                    //是否初始化分页器
                    if( params.isInitPagination){
                        _this.CR.pubSub.pub("paginationBox.initRender", {currentPage: res.data.page , totalPage: res.data.total } )
                    }
                    //通知pagination模块打开
                    _this.CR.pubSub.pub("paginationBox.open");
                }else{
                    //通知queryState模块显示错误信息
                    _this.CR.pubSub.pub("queryStateBox.showError",res.msg)
                }
            },
            complete: function(res,status) {
                //请求完成的处理
                if(status=="timeout"){
                    alert("请求超时")
                }
            },
            error: function() {
                //请求出错处理
            }
        });
    }


}

module.exports = DataCenter;

var DataCenter = {
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.sub();
        this.bind();
    },

    /**
     * @events 本模块订阅的事件
     */
    sub: function () {
        var _this = this;
        // 获取主要数据
        this.CR.pubSub.sub("DC.getMainData", function ( params ) {
            _this.getMainData( params );
        });
        this.CR.pubSub.sub("DC.getTicketData", function ( params ) {
            _this.getTicketData( params );
        });
    },

    bind: function () {
        var _this = this;
    },

    /**
     * @method 获取默认方式查询的数据
     */
    getMainData: function ( params ) {
        var _this = this;
        //显示查询状态
        _this.CR.pubSub.pub("queryStateBox.querying");
        //关闭tableCon
        _this.CR.pubSub.pub("tableConBox.close");
        //关闭tableTicket
        _this.CR.pubSub.pub("tableTicket.close");
        //关闭pagination
        _this.CR.pubSub.pub("paginationBox.close");
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
                    //通知table模块render
                    _this.CR.pubSub.pub("tableConBox.render", res );
                    //是分页器模块render
                    // var totalPage = Math.ceil( Number ( res.data.total / 10 ) );
                    // if(totalPage > 1){
                        _this.CR.pubSub.pub("paginationBox.Render", {currentPage: res.data.page , totalPage: Math.ceil( Number ( res.data.total / 10 ) )} )
                    // }
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
    },


    /**
     * @method 获取按票统计时的数据
     */
    getTicketData: function ( params ) {
        var _this = this;
        //显示查询状态
        _this.CR.pubSub.pub("queryStateBox.querying");
        //关闭tableCon
        _this.CR.pubSub.pub("tableConBox.close");
        //关闭tableTicket
        _this.CR.pubSub.pub("tableTicket.close");
        //关闭pagination
        _this.CR.pubSub.pub("paginationBox.close");
        $.ajax({
            url: "/r/report_statistics/checkedPaywayListByTicket",    //请求的url地址
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
                    //通知table模块render
                    _this.CR.pubSub.pub("tableTicket.render", res );
                    //是分页器模块render
                    // var totalPage = Math.ceil( Number ( res.data.total / 10 ) );
                    // if(totalPage > 1){
                        _this.CR.pubSub.pub("paginationBox.Render", {currentPage: res.data.page , totalPage: Math.ceil( Number ( res.data.total / 10 ) )} )
                    // }
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
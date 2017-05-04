
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
        //看看是否有缓存
        if(_this.cacheHub[$.param(params)]){
            //通知table模块render
            setTimeout(function () {
                var res = _this.cacheHub[$.param(params)];
                dealRes( res )
            },100);
            return false;
        }
        // console.log(params)
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
                //缓存数据
                _this.cacheHub[$.param(params)] = $.extend({},res);
                dealRes( res )
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

        function dealRes( res ) {
            if(res.code == 200 ){
                //通知table模块render
                if( _this.judgeTrue( res.data) && _this.judgeTrue(res.data.list) ){
                    res.data.Jtype = params.type;

                    // 增加导出单条明细地址到res
                    res.export_url = _this.CR.EXPORT_DETAIL_URL.single + '?is_detail=1&' + 'judgeType=' + _this.CR.JUDGE_TYPE + '&' + $.param(params);
                    // 增加filter参数到res（根据票数排序）
                    res.filter_params = $.param(params);

                    _this.CR.pubSub.pub("queryStateBox.close");
                    _this.CR.pubSub.pub("tableConBox.render", res );
                    _this.CR.pubSub.pub("paginationBox.Render", {currentPage: res.data.page , totalPage: Math.ceil( Number ( res.data.total / 10 ) )} )

                }else{
                    _this.CR.pubSub.pub("queryStateBox.showError" ,"未查询到任何数据，请重新输入条件搜索...");
                }
            }else{
                //通知queryState模块显示错误信息
                _this.CR.pubSub.pub("queryStateBox.showError",res.msg)
            }
        }
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
        //看看是否有缓存
        if(_this.cacheHub[$.param(params)]){
            //通知table模块render
            setTimeout(function () {
                var res = _this.cacheHub[$.param(params)];
                dealRes( res );
            },100);
            return false;
        }
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
                //缓存数据
                _this.cacheHub[$.param(params)] = $.extend({},res);
                dealRes( res );
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

        function dealRes( res ) {
            if(res.code == 200 ){
                //通知table模块render
                if( _this.judgeTrue( res.data) && _this.judgeTrue(res.data.list) ){
                    res.data.Jtype = params.type;

                    // 增加导出单条明细地址到res
                    res.export_url = _this.CR.EXPORT_DETAIL_URL.single + '?is_detail=1&' + 'judgeType=' + _this.CR.JUDGE_TYPE + '&' + $.param(params);
                    res.filter_params = $.param(params);

                    _this.CR.pubSub.pub("queryStateBox.close");
                    _this.CR.pubSub.pub("tableTicket.render", res );
                    _this.CR.pubSub.pub("paginationBox.Render", {currentPage: res.data.page , totalPage: Math.ceil( Number ( res.data.total / 10 ) )} )
                }else{
                    _this.CR.pubSub.pub("queryStateBox.showError" ,"未查询到任何数据，请重新输入条件搜索...");
                }
            }else{
                //通知queryState模块显示错误信息
                _this.CR.pubSub.pub("queryStateBox.showError",res.msg)
            }
        }
    },

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
    },

    /**
     * @Object 缓存仓库
     */
    cacheHub: {}


};

module.exports = DataCenter;
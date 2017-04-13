
//引入M-con模块
var Mcon = require("../content/index.js");
var Pagination = require("../pagination/pagination.js");
var pag = new Pagination();
console.log(pag);
var mcon = new Mcon();
var dataCenter = PFT.Util.Class({

    /**
     * @method 获取列表数据
     * @param params
     * @returns {boolean}
     */
    //缓存仓库
    cacheHub: {},
    getMainData: function ( params ) {
        var _this = this;
        //显示查询状态
        mcon.showLoading();
        //关闭pagination
        pag.close();
        //看看是否有缓存
        if(_this.cacheHub[$.param(params)]){
            //通知table模块render
            setTimeout(function () {
                var res = _this.cacheHub[$.param(params)];
                dealRes( res )
            },100);
            return false;
        }
        $.ajax({
            url: "/r/product_Evolute/getProList",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: params,    //参数值
            type: "GET",   //请求方式
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
                    mcon.showError("请求超时");
                }
            },
            error: function() {
                //请求出错处理
                mcon.showError("请求出错");
            }
        });

        function dealRes( res ) {
            if(res.code == 200 ){
                //通知table模块render
                if( _this.judgeTrue( res.data) && _this.judgeTrue(res.data.lists) ){
                    mcon.render(res);
                    pag.render( res.data.page ,res.data.totalPage )
                }else{
                    mcon.showError("未查询到任何数据，请重新输入条件搜索...");
                }
            }else{
                //通知queryState模块显示错误信息
                mcon.showError(res.msg);
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
    }


});


module.exports = dataCenter;
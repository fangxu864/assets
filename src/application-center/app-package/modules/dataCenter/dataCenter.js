
var DataCenter = {
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.bind();
    },
    
    bind: function () {
        var _this = this;
        // 获取首页的套餐情况
        this.CR.pubSub.sub("DC.getPackageList", function () {
            _this.getPackageList();
        })

    },

    /**
     * @method 获取首页的套餐情况
     */
    getPackageList: function () {
        var _this = this;
        $.ajax({
            url: "/r/Appcenter_ModuleList/getPackageList",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: {},    //参数值
            type: "POST",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
                _this.CR.pubSub.pub("queryStateBox.querying",{dom: ".progressBox"});
            },
            success: function(res) {
                //请求成功时处理
                if(res.code == 200 && res.data ){
                    _this.CR.pubSub.pub("queryStateBox.close");
                    _this.CR.pubSub.pub("first_packPick.render" , res.data)
                }else{
                    _this.CR.pubSub.pub("queryStateBox.querying",{dom: ".progressBox" ,text : res.msg});
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

};


module.exports = DataCenter;
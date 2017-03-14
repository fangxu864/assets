
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
        });
        // 获取第1步中的套餐详情
        this.CR.pubSub.sub("DC.getFirstPackageDetail", function (role) {
            _this.getFirstPackageDetail(role);
        });
        // 获取第2步中的套餐详情
        this.CR.pubSub.sub("DC.getSecondPackageDetail", function (moduleId) {
            return _this.getSecondPackageDetail(moduleId);
        });

    },

    /**
     * @method 获取首页的套餐情况
     */
    getPackageList: function () {
        var _this = this;
        $.ajax({
            url: "/r/AppCenter_ModuleList/getPackageList",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: {},    //参数值
            type: "POST",   //请求方式
            timeout: 5000,   //设置超时 5000毫秒
            beforeSend: function () {
                //请求前的处理
                _this.CR.pubSub.pub("queryStateBox.querying", {dom: ".progressBox"});
            },
            success: function (res) {
                //请求成功时处理
                if (res.code == 200 && res.data) {
                    _this.CR.pubSub.pub("queryStateBox.close");
                    _this.CR.pubSub.pub("first_packPick.render", res.data);
                    var role = "2";
                    var j = 0;
                    for (var key in res.data) {
                        ++j;
                        if (j < 2) {
                            role = res.data[key].role
                        }
                    }
                    //将供应商还是分销商存储进入CR
                    _this.CR.dtype = role;
                    _this.CR.pubSub.pub("First_packDetailModule.render", _this.getFirstPackageDetail(role))

                } else {
                    _this.CR.pubSub.pub("queryStateBox.querying", {dom: ".progressBox", text: res.msg});
                }
            },
            complete: function (res, status) {
                //请求完成的处理
                if (status == "timeout") {
                    alert("请求超时")
                }
            },
            error: function () {
                //请求出错处理
            }
        });

    },
    
    /**
     * @method 获取第一步套餐详情
     */
    getFirstPackageDetail: function (role) {
        //供应商
        if (role == 1) {
            return {
                //基础模块
                "base": [
                    ["产品预订", 1, 1],
                    ["订单查询", 1, 1],
                    ["票券验证", 1, 1],
                    ["交易记录", 1, 1],
                    ["合作伙伴", 1, 1],
                    ["系统设置", 1, 1],
                    ["系统通知", 1, 1]
                ],
                //产品模块
                "product": [
                    ["景区", 1, 1],
                    ["酒店", 1, 1],
                    ["线路", 1, 1],
                    ["演出", 1, 1],
                    ["餐饮", 1, 1],
                    ["产品打包（套票）", 1, 1],
                    ["转分销产品", 1, 1]
                ],
                //应用中心模块
                "appCenter": [
                    ["B2C商城（PC端）", 1, 1],
                    ["OTA平台分销", 1, 1],
                    ["同业平台分销", 1, 1],
                    ["线下票务系统", 1, 1],
                    ["数据罗盘", 1, 1],
                    ["计调下单", 1, 1],
                    ["APP下载", 1, 1],
                    ["结算自动入账", 1, 1],
                    ["微信直销（微商城）", 0, 1],
                    ["分销第三方产品", 0, 1],
                    ["全民营销", 0, 1],
                    ["海报推广", 0, 1],
                    ["链接广告", 0, 1],
                    ["优惠券", 0, 1]
                ],
                //价格
                //第三个值为moduleId
                "price": {
                    "base": [7880, 6800 , 1],
                    "super": [15780, 9800 , 2]
                },
                //表头
                "title": ["标准版", "旗舰版"],
            };
        }
            //分销商
        else if (role == 2) {
                return {
                    //基础模块
                    "base": [
                        ["产品预订", 1, 1],
                        ["订单查询", 1, 1],
                        ["交易记录", 1, 1],
                        ["合作伙伴", 1, 1],
                        ["系统设置", 1, 1],
                        ["提现/充值", 1, 1],
                        ["销售报表", 1, 1]
                    ],
                    //产品模块
                    "product": [
                        ["转分销产品", 0, 1]
                    ],
                    //应用中心模块
                    "appCenter": [
                        ["OTA平台分销", 0, 1],
                        ["同业平台分销", 0, 1],
                        ["数据罗盘", 0, 1],
                        ["计调下单", 0, 1],
                        ["APP下载", 0, 1],
                        ["结算自动入账", 0, 1]
                    ],
                    //价格
                    //第三个值为moduleId
                    "price": {
                        "base": [0, 0 , 3],
                        "super": [5220, 980 ,4]
                    },
                    //表头
                    "title": ["免费版", "标准版"],
                }
            }
        },

    /**
     * @method 获取第二步中的套餐详情
     */
    getSecondPackageDetail: function (moduleId) {
        switch (moduleId){
            case "1":
                return{
                    "base":[
                        ["产品预订", 0],
                        ["订单查询",0],
                        ["票券验证", 0],
                        ["交易记录", 0],
                        ["合作伙伴", 0],
                        ["系统设置", 0],
                        ["系统通知", 0]
                    ],
                    "product":[
                        ["景区", 0],
                        ["酒店", 0],
                        ["线路",0],
                        ["演出", 0],
                        ["餐饮", 0],
                        ["产品打包（套票）", 0],
                        ["转分销产品", 0]
                    ],
                    "appCenter":[
                        ["B2C商城（PC端）",680],
                        ["OTA平台分销", 1980],
                        ["同业平台分销", 1980],
                        ["线下票务系统",1980],
                        ["数据罗盘", 680],
                        ["计调下单", 580],
                        ["APP下载", 0],
                        ["结算自动入账", 0]
                    ],
                    "price":[7880 , 6800 , 1]
                };
                break;
            case "2":
                return{
                    "base":[
                        ["产品预订", 0],
                        ["订单查询",0],
                        ["票券验证", 0],
                        ["交易记录", 0],
                        ["合作伙伴", 0],
                        ["系统设置", 0],
                        ["系统通知", 0]
                    ],
                    "product":[
                        ["景区", 0],
                        ["酒店", 0],
                        ["线路",0],
                        ["演出", 0],
                        ["餐饮", 0],
                        ["产品打包（套票）", 0],
                        ["转分销产品", 0]
                    ],
                    "appCenter":[
                        ["B2C商城（PC端）",680],
                        ["OTA平台分销", 1980],
                        ["同业平台分销", 1980],
                        ["线下票务系统",1980],
                        ["数据罗盘", 680],
                        ["计调下单", 580],
                        ["APP下载", 0],
                        ["结算自动入账", 0],
                        ["微信直销（微商城）", 2200],
                        ["分销第三方产品", 1980],
                        ["全民营销", 1680],
                        ["海报推广", 680],
                        ["链接广告", 680],
                        ["优惠券", 680]
                    ],
                    "price":[15780 , 9800 , 2]
                };
                break;
            case "3":
                return {
                    //基础模块
                    "base": [
                        ["产品预订", 0],
                        ["订单查询", 0],
                        ["交易记录", 0],
                        ["合作伙伴", 0],
                        ["系统设置", 0],
                        ["提现/充值", 0],
                        ["销售报表", 0]
                    ],
                    "price":[0 , 0 , 3]
                };
                break;
            case "4":
                return {
                    //基础模块
                    "base": [
                        ["产品预订", 0],
                        ["订单查询", 0],
                        ["交易记录", 0],
                        ["合作伙伴", 0],
                        ["系统设置", 0],
                        ["提现/充值", 0],
                        ["销售报表", 0]
                    ],
                    //产品模块
                    "product": [
                        ["转分销产品",1980]
                    ],
                    //应用中心模块
                    "appCenter": [
                        ["OTA平台分销", 1980],
                        ["同业平台分销", 1980],
                        ["数据罗盘", 680],
                        ["计调下单", 580],
                        ["APP下载", 0],
                        ["结算自动入账", 0]
                    ],
                    "price":[5220 , 980 , 4]
                };
                break;
            default:
                alert("moduleId出错")
        }

        
    }

}

module.exports = DataCenter;
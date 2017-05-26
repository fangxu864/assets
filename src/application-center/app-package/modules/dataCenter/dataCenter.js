

var Message = require("pft-ui-component/Message");
var VTb = require("../../virtualTable.js");

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

                    _this.CR.pubSub.pub("First_packDetailModule.render", _this.getFirstPackageDetail(res))

                } else {
                    _this.CR.pubSub.pub("queryStateBox.showError", {dom: ".progressBox", text: res.msg});
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
    getFirstPackageDetail: function (res) {
        var _this = this;

        var titleTb = ['模块名称'];

        //-------------------------baseTb-----------------------
        //基础模块的虚拟表
        var all_base = res.data.all_base;
        var package_info = res.data.package_info;

        //表列数和列id映射关系
        var mainTbColRelation = {moduleName:0};
        //表行数和行id映射关系
        var baseTbRowRelation = {};
        //基础模块表行数
        var baseTbRowLength = _this.getObjLength(all_base);
        //基础模块表列数
        var mainTbColLength = _this.getObjLength(package_info) + 1 ;
        var baseTb = VTb.createTb( baseTbRowLength , mainTbColLength);


        //表行数和行id建立映射关系
        var Index1 = 0;
        for(var all_baseKey in all_base){
            baseTbRowRelation[all_baseKey] = Index1;
            Index1++
        }

        //表列数和列id建立映射关系
        var Index2 = 1;
        for(var package_infoKey in package_info ){
            mainTbColRelation[package_infoKey] = Index2;
            titleTb.push(package_info[package_infoKey]["name"]);
            Index2 ++
        }

        //给表充满0
        for(var i = 0 ; i<baseTbRowLength ; i++ ){
            for (var k = 0; k <mainTbColLength ; k++){
                VTb.insert(baseTb , i ,k ,0)
            }
        }

        //装填数据的第一列，即基础模块名称
        var curColFlag , curRowFlag;
        for(var key_base in all_base){
            //当前行标
            curRowFlag = baseTbRowRelation[key_base];
            //当前列标
            curColFlag = mainTbColRelation['moduleName'];
            VTb.insert(baseTb ,curRowFlag ,curColFlag ,all_base[key_base] )
        }

        //装填其他列
        for(var info_key in package_info){
            for(var info_base_key in package_info[info_key]['base_module']){
                //当前行标
                curRowFlag = baseTbRowRelation[ package_info[info_key]['base_module'][info_base_key] ];
                //当前列标
                curColFlag = mainTbColRelation[package_info[info_key]["id"]];
                VTb.insert(baseTb ,curRowFlag ,curColFlag ,1 )
            }
        }

        //---------------------appTb-----------------
        //应用模块的虚拟表
        var all_app = res.data.all_app;

        //表列数和列id映射关系
        var appTbColRelation = {moduleName:0};
        //表行数和行id映射关系
        var appTbRowRelation = {};
        //基础模块表行数
        var appTbRowLength = _this.getObjLength(all_app);
        var appTb = VTb.createTb( appTbRowLength , mainTbColLength);


        //表行数和行id建立映射关系
        var Index3 = 0;
        for(var all_appKey in all_app){
            appTbRowRelation[all_appKey] = Index3;
            Index3++
        }

        //给表充满0
        for(var y = 0 ; y<appTbRowLength ; y++ ){
            for (var t = 0; t <mainTbColLength ; t++){
                VTb.insert(appTb , y ,t ,0)
            }
        }


        //装填数据的第一列，即应用模块名称
        for(var key_app in all_app){
            //当前行标
            curRowFlag = appTbRowRelation[key_app];
            //当前列标
            curColFlag = mainTbColRelation['moduleName'];
            VTb.insert(appTb ,curRowFlag ,curColFlag ,all_app[key_app] )
        }

        //装填其他列
        for(var info_app in package_info){
            for(var info_app_key in package_info[info_app]['app_module']){
                //当前行标
                curRowFlag = appTbRowRelation[ package_info[info_app]['app_module'][info_app_key] ];
                //当前列标
                curColFlag = mainTbColRelation[package_info[info_app]["id"]];
                VTb.insert(appTb ,curRowFlag ,curColFlag ,1 )
            }
        }

        //----------------------priceTb----------------

        // var priceTb= {
        //     "base": [7880, 6800 , 1],
        //         "super": [15780, 9800 , 2]
        // }



        return{
            base: baseTb,
            app: appTb ,
            price: package_info,
            title: titleTb
        };
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
                "title": ["标准版", "旗舰版"]
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
        var _this = this;
        var params = {
            target_id : moduleId
        };
        var paramsKey = $.param(params);

        //判断缓存，有的话就不发请求了
        if(_this.cacheHub[paramsKey]){
            dealRes(_this.cacheHub[paramsKey]);
            return ;
        }
        PFT.Util.Ajax("/r/AppCenter_ModuleList/getPackageModuleInfo",{
            type : "post",
            params : params,
            loading : function(){
                _this.CR.pubSub.pub("queryStateBox.querying", {dom: ".progressBox"});
            },
            complete : function(){
                _this.CR.pubSub.pub("queryStateBox.close");
            },
            success : function(res){
                _this.cacheHub[paramsKey] = $.extend({},res);
                dealRes(res);
            },
            tiemout : function(){ Message.error(PFT.AJAX_TIMEOUT_TEXT)},
            serverError : function(){ Message.error(PFT.AJAX_ERROR_TEXT)}
        });
        function dealRes(res){
            if(res.code == "200"){
                res.data["moduleId"] = moduleId;
                _this.CR.pubSub.pub("Second_packDetailModule.render" , res)
            }else{
                Message.error(res.msg)
            }
        }

    },
    
    cacheHub: {},

    getObjLength: function (obj) {
        var type = Object.prototype.toString.call(obj);
        if( type !== "[object Object]" ){
            throw Error("使用getObjlength()需要传入一个对象！");
            return false;
        }
        var length = 0;
        for(var i in obj){
            length ++;
        }
        return length;
    }

};

module.exports = DataCenter;
/**
 * Created by Administrator on 2017/2/9.
 */
require("./index.scss");
var ParseTemplate = require("COMMON/js/util.parseTemplate");
var DialogSign=require("COMMON/modules/dialog-simple");
var tpl = require("./loading.xtpl");
var con_tpl = require("./index.xtpl");
//日历插件部分
var Calendar = require("COMMON/modules/calendar");
//日期的格式化
Date.prototype.Format = function (fmt) {
    //输入格式字符串，然后替换字符串，就是这么简单！
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    //RegExp.$1第一个 以括号为标志 的 子匹配字符串；
    if (/(y+)/i.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o){
        if (new RegExp("(" + k + ")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};
var calendar_new = new Calendar();


var SigningStaff = {
    /**
     * @method 初始化
     * @param Data
     */
    init : function (Data) {
        var _this = this ;
        this.fid = Data.fid;
        //弹框的container
        this.container = $(_this.Dial.container).find(".gSimpleDialog-content");
        _this.getInitInfo(Data);
        _this.Dial.open();
        this.bind()

    } ,

    /**
     * @method 绑定事件
     */
    bind : function () {
        var _this = this;
        //日期
        this.container.off();
        this.container.on("click" , ".protocol_start" ,function () {
            var _this = $(this);
            var initVal = _this.val() ;
            if(initVal){
                initVal= new Date(Date.parse(initVal.replace(/-/g,'/'))).Format('yyyy-MM-dd');
            }
            calendar_new.show(initVal,{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
                picker : _this,              //页面上点击某个picker弹出日历(请使用input[type=text])
                top : 0,                       //日历box偏移量
                left : 0,                     //日历box偏移量
                // min : "2016-05-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
                // max : max_day,          //2016-07-10往后的日期都不可选 会自动挂上disable类名
                onBefore : function(){},     //弹出日历前callback
                onAfter : function(){}       //弹出日历后callback
            });
        });
        this.container.on("click" , ".protocol_end" ,function () {
            var _this = $(this);
            var initVal = _this.val() ;
            if(initVal){
                initVal= new Date(Date.parse(initVal.replace(/-/g,'/'))).Format('yyyy-MM-dd');
            }
            calendar_new.show(initVal,{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
                picker : _this,              //页面上点击某个picker弹出日历(请使用input[type=text])
                top : 0,                       //日历box偏移量
                left : 0,                     //日历box偏移量
                // min : "2016-05-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
                // max : max_day,          //2016-07-10往后的日期都不可选 会自动挂上disable类名
                onBefore : function(){},     //弹出日历前callback
                onAfter : function(){}       //弹出日历后callback
            });
        });
        //全选事件
        this.container.on("click" ,".openApp .selectAll", function (e) {
            if($(this).get(0).checked){
                _this.container.find(".openApp .line1 input.notSelf[type = checkbox]").attr("checked",true);
            }else{
                _this.container.find(".openApp .line1 input.notSelf[type = checkbox]").attr("checked",false);
            }
        });
        //含“自”checkbox 不予点击
        this.container.on("click" ,".openApp .line1 input.self",function(){
            return false;
        });
        //给合作模式select添加事件
        this.container.on("change" ,".signInfo .contract_model",function(){
            switch ($(this).find("option:selected").val()){
                /**
                 * 1 套餐  2 票务  3 订单
                 * 当合作模式为套餐时，凭证费=平台手续费=0 ，允许配置开通应用
                 * 票务时，凭证费 = 0,不允许配置开通应用
                 * 订单时，凭证费 = 1，不允许配置开通应用
                 */
                case "1" :
                    //平台使用费
                    _this.container.find(".feeConfig .fee_platform").val(0);
                    //凭证费
                    _this.container.find(".feeConfig .fee_code").val(0);
                    _this.container.find(".openApp").show();
                    break;
                case "2" :
                    //凭证费
                    _this.container.find(".feeConfig .fee_code").val(0);
                    _this.container.find(".openApp").hide();
                    break;
                case "3" :
                    //凭证费
                    _this.container.find(".feeConfig .fee_code").val(1);
                    _this.container.find(".openApp").hide();
                    break;
                default :
                    _this.container.find(".openApp").show();
            }
        });
        //确认按钮点击
        this.container.on("click",".bottom .center .yesBtn",function () {
            var openAppDataArr = [];
            $(".openApp .line1 input").each(function (i) {
                openAppDataArr.push( $(this).attr("data-id") + "-" + $(this).get(0).checked )
            });
            var addArr = [];//新增的数组
            var diffArr = [];//移除的数组
            for( var i = 0 ; i < openAppDataArr.length ; i++ ){
                if( openAppDataArr[i] !== _this.openAppInitialData[i]){
                    if(/true/.test(openAppDataArr[i])){
                        addArr.push(openAppDataArr[i].match(/[\d]+/)[0])
                    }else{
                        diffArr.push( openAppDataArr[i].match(/[\d]+/)[0] )
                    }
                }
            }
            var postData = {};
            //模式
            postData.contract_model = _this.container.find(".signInfo .contract_model option:selected").val();
            //合同编号
            postData.contract_num_model = _this.container.find(".signInfo .contract_num").val();
            //会员ID
            postData.fid_model = _this.fid;
            //是否回款
            postData.is_pay_model = _this.container.find(".signInfo .is_pay").get(0).checked ? 1 : 0;
            //客服ID,签单人ID
            postData.contract_kefuID =  _this.container.find(".signInfo .kefuSelect option:selected").val();
            postData.salesID = _this.container.find(".signInfo .salerSelect option:selected").val();
            //协议开始时间和结束时间
            postData.protocal_start_model = _this.container.find(".signInfo .protocol_start").val();
            postData.protocal_end = _this.container.find(".signInfo .protocol_end").val();
            //协议价格
            postData.protocal_protocol_meal = _this.container.find(".signInfo .protocol_meal").val();
            //协议标准
            postData.protocol_main = _this.container.find(".signInfo .protocol_main").val();
            //平台使用费
            postData.fee_platform = _this.container.find(".feeConfig .fee_platform").val();
            //短信使用费
            postData.fee_sms = _this.container.find(".feeConfig .fee_sms").val();
            //凭证费
            postData.fee_code = _this.container.find(".feeConfig .fee_code").val();
            //提现手续费
            postData.fee_bank = _this.container.find(".feeConfig .fee_bank").val();
            //新开通模块
            postData.new_module = addArr;
            //取消模块
            postData.cancel_module = diffArr;

            $.ajax({
                url: "/r/Member_MemberConfig/setMemberConfigInfo/",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                data: postData,    //参数值
                type: "post",   //请求方式
                timeout:10000,   //设置超时 10000毫秒
                beforeSend: function() {
                    //请求前的处理

                },
                success: function(res) {
                    //请求成功时处理
                    if(res.code == 200 ){
                        PFT_GLOBAL.U.Alert("success",'<p style="width:120px;">设置成功</p>');
                        _this.Dial.close();
                    }else{
                        PFT_GLOBAL.U.Alert("fail",'<p style="width:120px;">'+res.msg+',请重试</p>');
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
                    alert("请求出错")
                }
            });
        })
    },

    /**
     * @object 弹框 Dial
     */
    Dial : new DialogSign({
        width : 700,
        height : 600,
        closeBtn : true,
        content : tpl,
        drag : true,
        speed : 100,
        onCloseAfter : function(){
        }
    }),

    /**
     * @method 获取初始信息 ，用于构建对话框内容
     * @param fid
     */
    getInitInfo : function (Data) {
        var _this = this ;
        $.ajax({
            url: "/r/Member_MemberConfig/getMemberConfigInfo/",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: { fid : Data.fid},    //参数值
            type: "post",   //请求方式
            timeout:10000,   //设置超时 10000毫秒
            beforeSend: function() {
                //请求前的处理

            },
            success: function(res) {
                //请求成功时处理
                if(res.code == 200 ){
                    _this.renderCon($.extend(true ,{} ,Data , res.data));
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
                alert("请求出错")
            }
        });

    },

    /**
     * @method 渲染结构
     */
    renderCon :  function (data) {
        var template = ParseTemplate(con_tpl);
        var html = template({data: data});
        this.container.html(html);
        //初始化开通应用初始数据
        this.openAppInitialData = [] ;
        for(var i= 0 ; i < data.module.length ; i++){
            this.openAppInitialData.push( [data.module[i]["id"]] + "-" + data.module[i]["open"] )
        }
        console.log(this.openAppInitialData);
        //合作模式
        if(data.contract_model){
            this.container.find(".signInfo .contract_model option[value = "+data.contract_model+"]").attr("selected","true");
        }
        switch (data.contract_model){
            /**
             * 1 套餐  2 票务  3 订单
             * 当合作模式为套餐时，凭证费=平台手续费=0 ，允许配置开通应用
             * 票务时，凭证费 = 0,不允许配置开通应用
             * 订单时，凭证费 = 1，不允许配置开通应用
             */
            case 1 :
                //平台使用费
                this.container.find(".feeConfig .fee_platform").val(0);
                //凭证费
                this.container.find(".feeConfig .fee_code").val(0);
                this.container.find(".openApp").show();
                break;
            case 2 :
                //凭证费
                this.container.find(".feeConfig .fee_code").val(0);
                this.container.find(".openApp").hide();
                break;
            case 3 :
                //凭证费
                this.container.find(".feeConfig .fee_code").val(1);
                this.container.find(".openApp").hide();
                break;
        }
        //客服和签单人
        this.container.find(".signInfo .salerSelect option[value = "+data.salesID+"]").attr("selected","true");
        this.container.find(".signInfo .kefuSelect option[value = "+data.kefuID+"]").attr("selected","true");
        //是否回款
        // if(data.is_pay == 1){
        //     this.container.find(".signInfo .is_pay").attr("checked","true");
        // }

        //协议日期
        // if(data.protocol_start != '0000-00-00'){
        //     this.container.find(".signInfo .protocol_start").val(data.protocol_start);
        // }
        // if(data.protocol_end != '0000-00-00'){
        //     this.container.find(".signInfo .protocol_end").val(data.protocol_end);
        // }
        // //合同编号
        // this.container.find(".signInfo .contract_num").val(data.contract_num);
        // //协议标准
        // this.container.find(".signInfo .protocol_main").val(data.protocol_main);
        // //协议价格
        // this.container.find(".signInfo .protocol_meal").val(data.protocol_meal);
        

        //初始化费用配置
        // this.container.find(".feeConfig .fee_platform").val(data.fee_platform);
        // this.container.find(".feeConfig .fee_sms").val(data.fee_sms);
        // this.container.find(".feeConfig .fee_code").val(data.fee_code);
        // this.container.find(".feeConfig .fee_bank").val(data.fee_bank)

        //初始化开通应用

    },

    /**
     * 初始的开通应用的数据
     */
    openAppInitialData : []
};

$.subscribe("signingStaffClick",function () {
    var Data = arguments[1];
    SigningStaff.init(Data)
});

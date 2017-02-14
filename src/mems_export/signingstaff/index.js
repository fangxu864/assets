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
        //弹框的container
        this.container = $(_this.Dial.container).find(".gSimpleDialog-content");
        _this.getInitInfo(Data);
        _this.open();
        this.bind()

    } ,

    bind : function () {
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
     * @method 打开弹框
     */
    open : function () {
        this.Dial.open();
    },

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
        //初始化签约信息
        //合作模式
        if(data.contract_model){
            this.container.find(".contract_model option[value = "+data.contract_model+"]").attr("selected","true");
        }
        //是否回款
        if(data.is_pay == 1){
            

        }
        //客服和签单人
        this.container.find(".salerSelect option[value = "+data.salesID+"]").attr("selected","true");
        this.container.find(".kefuSelect option[value = "+data.kefuID+"]").attr("selected","true");
        //协议日期
        if(data.protocol_start != '0000-00-00'){
            this.container.find(".signInfo .protocol_start").val(data.protocol_start);
        }
        if(data.protocol_end != '0000-00-00'){
            this.container.find(".signInfo .protocol_end").val(data.protocol_end);
        }
        //合同编号
        this.container.find(".signInfo .contract_num").val(data.contract_num);
        //协议标准
        this.container.find(".signInfo .protocol_main").val(data.protocol_main);
        //协议价格
        this.container.find(".signInfo .protocol_meal").val(data.protocol_meal);
        

        //初始化费用配置
        this.container.find(".feeConfig .fee_platform").val(data.fee_platform);
        this.container.find(".feeConfig .fee_sms").val(data.fee_sms);
        this.container.find(".feeConfig .fee_code").val(data.fee_code);
        this.container.find(".feeConfig .fee_bank").val(data.fee_bank)
    }
};

$.subscribe("signingStaffClick",function () {
    var Data = arguments[1];
    console.log(SigningStaff.Dial);
    SigningStaff.init(Data)
});

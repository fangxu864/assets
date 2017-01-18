/**
 * Created by Administrator on 2016/10/28.
 */

/**
 * 当到正式使用期后，将‘过渡期’那一行代码删除，使用‘过渡期’上一行的代码即可
 */


//引入modules
var LoopTip=require("./loopTip");
var Dialog=require("./dialog/dialog.js");

var ParseTemplate=require("COMMON/js/util.parseTemplate.js");
//引入tpl
var loopTip_tpl=require("./loopTip/loopTip.xtpl");

var HeaderWarning={
    /**
     * @method 初始化
     * @returns {boolean}
     */
    init:function () {
        var _this=this;

        /**
         * 弹框出现的必须条件
         * 员工账号没弹框
         * @type {boolean}
         */
        var isDialog = this.judge_of_dtype == "6" ? false : true;

        
        /**
         * 走马灯的判断
         */
        if( /0|\-1/.test(_this.judge_of_overTime) || /201|202|203|204|205|206|207/.test(_this.judge_of_account_balance) ){
            //如果账户临近过期或已过期
            if( /0|\-1/.test(_this.judge_of_overTime) ){
                //平台续费html
                var xufei_tpl=ParseTemplate(loopTip_tpl)({data:{"hrefTpl":'<a href="/new/renewwarning.html">续费</a>'}});
                _this.loopTip(xufei_tpl , "0")
            }
            //如果账户余额接近不足
            else if(/201|202|203|204|205|206|207/.test(_this.judge_of_account_balance)){
                //平台充值的html
                var charge_tpl=ParseTemplate(loopTip_tpl)({data:{"hrefTpl":'<a href="/recharge.html">充值</a>'}});
                _this.loopTip(charge_tpl , _this.judge_of_account_balance)
            }
        }

        
        /**
         * 弹框提示的判断
         */
        if( /0|-1/.test(_this.judge_of_overTime) || /201|202|203|204|205|206|207/.test(_this.judge_of_account_balance) ){
            if(isDialog){
                //账户临近过期设置cookie,一天只提醒一次
                if(this.judge_of_overTime == "0"){
                    var isDialog_cookie = _this.getCookie("isDialog_of_judge_of_overTime");
                    if(isDialog_cookie == "false") return false;
                    _this.setCookie("isDialog_of_judge_of_overTime",false,1000*60*60*12);
                    _this.dialog = new Dialog;
                    _this.dialog.open();
                    _this.dialog.show_dialog_con(_this.dialogCon[_this.judge_of_overTime]);
                }
                //账户已过期，弹框不能关闭 ,并且排除充值页面
                else if(this.judge_of_overTime == "-1" && !/recharge\.html$/.test(location.href)){
                    _this.dialog = new Dialog;
                    _this.dialog.open();
                    _this.dialog.show_dialog_con(_this.dialogCon[_this.judge_of_overTime]);
                }
                //如果账户余额接近不足
                if(/201|202|203|204|205|206|207/.test(_this.judge_of_account_balance)){
                    //弹框每天只提醒一次，使用cookie控制
                    var isDialog_cookie_ac = _this.getCookie("isDialog_of_judge_account_balance");
                    if(isDialog_cookie_ac == "false") return false;
                    _this.setCookie("isDialog_of_judge_account_balance",false,1000*60*60*12);
                    _this.dialog2 = new Dialog;
                    _this.dialog2.open();
                    _this.dialog2.show_dialog_con(_this.dialogCon[_this.judge_of_account_balance]);
                }
            }
        }
    },

    /**
     * @property判断账户是否过期
     * -1 已过期
     * 0  临近过期
     * 1  未过期
     */
    judge_of_overTime : $("#judge_of_overTime").val() ,


    /**
     * @property判断账户余额情况
     * | 207    |  int   |  欠费超过200元  过渡期可以继续使用
     * | 206    |  int   |  欠费超过200元  停止使用 只能进入充值页面|
     * | 205    |  int   |  欠费超过7天  停止使用 只能进入充值页面|
     * | 204    |  int   |  超出自定义设置时间  停止使用 只能进入充值页面|
     * | 203    |  int   |  在欠费时长内继续使用  给前端提示 可以继续使用|
     * | 202    |  int   |  今日提醒 小于0元 大于-200|
     * | 201    |  int   |  今日提醒 小于200元 大于0元|
     * | 200    |  int   |  正常情况无需任何提示|
     */
    judge_of_account_balance : $("#judge_of_account_balance").val() ,


    /**
     * @property判断用户类型
     * 6 为员工账户
     * 员工账户只有走马灯没有弹框
     */
    judge_of_dtype : $("#judge_of_dtype").val(),


    /**
     * @method 展示走马灯
     * @param whichTpl 显示账户到期的走马灯 或者显示账户余额不足的走马灯
     * @param code loopTipCon 的键值
     */
    loopTip : function (whichTpl , code) {
        var _this=this;
        if ($("#siteLocationBar .subnav").length>0){
            $("#siteLocationBar .subnav").eq(0).css("position","relative").append(whichTpl)
                .find(".loop_box").css({"top":"-13px"})
                .find(".xufei_box").css("padding-top","0px")
        }else if($("#special_w").length>0){
            $("#special_w .subnav").eq(0).css("position","relative").append(whichTpl);
        }else if($("#siteLocationBar .siteLocationBarCon").length>0){
            $("#siteLocationBar .siteLocationBarCon").eq(0).css("position","relative").append(whichTpl)
                .find(".loop_box").css({"top":"-2px"})
                .find(".xufei_box").css("padding-top","0px")
        }

        new LoopTip({
            "container" : $("#loopTip_box"),
            "content" : _this.loopTipCon[code]
        });
    },


    /**
     * @property弹框的内容
     */
    dialogCon:{
        "-1":{
            "title":"账户已到期！",
            "content":"您好，您的票付通账户已到期，系统将于2016年12月01日起对到期账户进行功能使用限制，为避免影响您的正常使用，请尽快续费或联系客服。（电话：18065144515   QQ：2853986222）",
            "isBtn_close":false ,
            "dialog_type": "xufei"
        },
        "0":{
            "title":"账户即将到期！",
            "content":"您好，您的票付通账户将于"+$("#value_of_overTime").val()+"到期，为避免影响您的正常使用，请提前续费或联系客服。（电话：18065144515）",
            "isBtn_close":true ,
            "dialog_type": "xufei"
        },
        "201": {
            "title":"账户余额提醒",
            "content":"亲爱的用户,您的票付通平台账户余额已不足200元 ,请及时充值余额, 以免影响您帐号的正常使用",
            "isBtn_close":true ,
            "dialog_type": "recharge"
        },
        "202": {
            "title":"账户余额提醒",
            "content":"亲爱的用户, 您的票付通平台账户余额已低于0元, 请于7天内及时充值余额, 否则将无法正常使用",
            "isBtn_close":true ,
            "dialog_type": "recharge"
        },
        "203": {
            "title":"账户余额提醒",
            // "content":"您好，您的账户余额已欠费，请您及时充值，以免影响使用",
            "content":"您好，票付通平台将于2017年2月17日起，将对平台账户余额低于0元的用户，进行使用限制，为保障您的正常使用，请及时对平台账户进行充值",
            "isBtn_close":true ,
            "dialog_type": "recharge"
        },
        "204": {
            "title":"账户余额提醒",
            // "content":"您好，您的账户欠费已超过最大时限，无法正常使用，请您先缴清欠费，谢谢",
            "content":"您好，票付通平台将于2017年2月17日起，将对平台账户余额低于0元的用户，进行使用限制，为保障您的正常使用，请及时对平台账户进行充值",
            // "isBtn_close": false ,
            "isBtn_close": true ,
            "dialog_type": "recharge"
        },
        "205": {
            "title":"账户余额提醒",
            // "content":"您好，您的账户欠费已超过7天，无法正常使用，请您先缴清欠费，谢谢",
            "content":"您好，票付通平台将于2017年2月17日起，将对平台账户余额低于0元的用户，进行使用限制，为保障您的正常使用，请及时对平台账户进行充值",
            // "isBtn_close": false ,
            "isBtn_close": true ,
            "dialog_type": "recharge"
        },
        "206": {
            "title":"账户余额提醒",
            // "content":"您好，您的账户欠费已超过200元达到上限，无法正常使用，请您先缴清欠费，谢谢",
            "content":"您好，票付通平台将于2017年2月17日起，将对平台账户余额低于0元的用户，进行使用限制，为保障您的正常使用，请及时对平台账户进行充值",
            // "isBtn_close": false ,
            "isBtn_close": true ,
            "dialog_type": "recharge"
        },
        "207": {
            "title":"账户余额提醒",
            "content":"您好，票付通平台将于2017年2月17日起，将对平台账户余额低于0元的用户，进行使用限制，为保障您的正常使用，请及时对平台账户进行充值",
            "isBtn_close": true ,
            "dialog_type": "recharge"
        }
    },


    /**
     * @property走马灯文字的内容
     */
    loopTipCon:{
        "0":"您好，您的票付通账户将于"+$("#value_of_overTime").val()+"到期，为避免影响您的正常使用，请提前续费或联系客服。（电话：18065144515）",
        "-1":" 您好，您的票付通账户已到期，系统将于2016年12月01日起对到期账户进行功能使用限制，为避免影响您的正常使用，请尽快续费或联系客服。（电话：18065144515   QQ：2853986222）",
        "201" : "亲爱的用户,您的票付通平台账户余额已不足200元 ,请及时充值余额, 以免影响您帐号的正常使用",
        "202" : "亲爱的用户, 您的票付通平台账户余额已低于0元, 请于7天内及时充值余额, 否则将无法正常使用",
        // "203" : "您好，您的账户余额已欠费，请您及时充值，以免影响使用",
        // "204" : "您好，您的账户欠费已超过最大时限，无法正常使用，请您先缴清欠费，谢谢",
        // "205" : "您好，您的账户欠费已超过7天，无法正常使用，请您先缴清欠费，谢谢",
        // "206" : "您好，您的账户欠费已超过200元达到上限，无法正常使用，请您先缴清欠费，谢谢",
        "203" : "您好，票付通平台将于2017年2月17日起，将对平台账户余额低于0元的用户，进行使用限制，为保障您的正常使用，请及时对平台账户进行充值",
        "204" : "您好，票付通平台将于2017年2月17日起，将对平台账户余额低于0元的用户，进行使用限制，为保障您的正常使用，请及时对平台账户进行充值",
        "205" : "您好，票付通平台将于2017年2月17日起，将对平台账户余额低于0元的用户，进行使用限制，为保障您的正常使用，请及时对平台账户进行充值",
        "206" : "您好，票付通平台将于2017年2月17日起，将对平台账户余额低于0元的用户，进行使用限制，为保障您的正常使用，请及时对平台账户进行充值",
        "207" : "您好，票付通平台将于2017年2月17日起，将对平台账户余额低于0元的用户，进行使用限制，为保障您的正常使用，请及时对平台账户进行充值"
    },


    /**
     * @method 设置cookie
     * @param name
     * @param value
     * @param time
     */
    setCookie:function (name, value, time) {
        var oDate=new Date();
        oDate.setTime(oDate.getTime()+time);
        document.cookie=name+'='+encodeURIComponent(value)+';expires='+oDate.toUTCString();
    },


    /**
     * @method 获取cookie
     * @param name
     * @returns {*}
     */
    getCookie:function (name) {
        var arr=document.cookie.split('; ');
        var i=0;
        for(i=0;i<arr.length;i++)
        {
            //arr2->['username', 'abc']
            var arr2=arr[i].split('=');

            if(arr2[0]==name)
            {
                var getC = decodeURIComponent(arr2[1]);
                return getC;
            }
        }

        return '';
    },


    /**
     * @method 清除cookie
     * @param name
     */
    removeCookie:function (name) {
        this.setCookie(name, '1', -1);
    }
};


$(function () {
    HeaderWarning.init()
});


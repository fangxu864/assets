/**
 * Created by Administrator on 2016/7/14.
 */
require("./index.scss");
var tpl = require("./index.xtpl");
// var Select = require("COMMON/modules/select");
var SelectShort=require("COMMON/modules/select_short");



Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}





var Filter = {
    container : $("#filterContainer"),
    initialize : function () {
        this.container.html(tpl);

        this.time_select_box=new SelectShort({
            id:"time_select_box",
            arr:["下单时间","使用有效期","验证时间","预计游玩","过期时间"]
        });
        this.name_select_box=new SelectShort({
            id:"name_select_box",
            arr:["订单号","取票人手机","产品名称","远程订单号","取票人姓名","优惠券名称"]
        })
        this.fs_select_box=new SelectShort({
            id:"fs_select_box",
            arr:["供应商","分销商"]
        })


        this.last_three=document.getElementById("last_three");
        this.tab_btn=document.getElementById("tab_btn");

        this.online_pay=document.getElementById("online_pay");
        this.pay_box=document.getElementsByClassName("pay_box")[0];
        this.pay_box_fold=document.getElementById("pay_box_fold");

        this.bindEvents();

        this.btimeInp=document.getElementById("btimeInp");
        this.etimeInp=document.getElementById("etimeInp");
        var time1 = new Date().Format("yyyy-MM-dd");
        this.btimeInp.value=time1+" "+"00:00:00";
        this.etimeInp.value=time1+" "+"23:59:59"
    },
    bindEvents : function () {

        var _this=this;
        this.tab_btn.onclick=function () {
            if(_this.tab_btn.className=="tab_btn tab_btn_up"){
                startMove(_this.last_three,{"height":0});
                _this.tab_btn.className="tab_btn tab_btn_down";
            }else{
                startMove(_this.last_three,{"height":105});
                _this.tab_btn.className="tab_btn tab_btn_up";
            }
        };
        this.online_pay.onclick=function () {
            _this.pay_box.style.display="block"
        }
        this.pay_box_fold.onclick=function () {
            _this.pay_box.style.display="none"
        }
        this.book_num_input=document.getElementById("book_num_input");
        this.input_clear=document.getElementById("input_clear");
        this.input_clear.onclick=function () {
            _this.book_num_input.value="";
            _this.input_clear.style.display="none"
        }
        if(document.onpropertychange)
        {
            this.book_num_input.onpropertychange =update();
        }
        else //需要用addEventListener来注册事件
        {
            this.book_num_input.addEventListener("input", update, false);
        }
        function update() {
            if( _this.book_num_input.value){
                _this.input_clear.style.display="block"
            }else{
                _this.input_clear.style.display="none"
            }
        }

        //运动框架函数
        function startMove(obj,json,fnEnd) {
            clearInterval(obj.timer);
            var cur=0;
            var speed=0;
            obj.timer=setInterval(function () {
                var allStop=true;//假设已经全到了
                for(var atr in json){
                    //赋值块
                    if(atr=="opacity"){
                        cur=parseInt(getStyle(obj,atr)*100);
                    }
                    else{
                        cur=parseInt(getStyle(obj,atr))||0;
                    }
                    speed=(json[atr]-cur)/1.5;
                    speed=speed>0?Math.ceil(speed):Math.floor(speed);
                    if(cur!=json[atr]){
                        allStop=false;
                    }
                    //运动块
                    if(atr=="opacity"){
                        obj.style[atr]=(cur+speed)/100;
                    }
                    else{
                        obj.style[atr]=cur+speed+"px";
                    }
                }
                if(allStop){
                    clearInterval(obj.timer);
                    if(fnEnd)fnEnd();
                }
            },30)
        }
        //获取当前样式
        function getStyle(obj,name) {
            if (obj.currentStyle) {
                return obj.currentStyle[name];
            }
            else {
                return getComputedStyle(obj, false)[name];
            }
        }
    }

};


module.exports = Filter;
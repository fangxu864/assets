/**
 * Created by Administrator on 2016/11/21.
 */
require("./index.scss");
//require("./jquery.validate.min.js");
var Validate = require("COMMON/js/util.validate.js");
var tpl = require("./filter_box.xtpl");


var FILTER_BOX=PFT.Util.Class({
    //放入容器
    container:"#filter_box",

//绑定事件
    EVENTS:{
         "input #dis_nickname":"search",
         "blur #dis_nickname":"check_CN_Phone",
         "click .createNew":"showHiddenPart",
         "blur #dis_name":"check_CN",
         "blur #telephone":"check_Phone",
         "blur #phone":"check_Num",
         "blur #password_confirm":"confirm_Code",
         "blur #password":"check_Code",
         "click #submit":"formSubmit"

    },

    //init()方法在实例化以后会默认执行
    init:function(){
        //加载模版
        $("#filter_box").append(tpl);

        //判断是否可以直接搜索
        $.post("../r/member_memberInfo/getAddSalerType",
            {},
            function (req){
                $("form").attr("data",req.data);
                if(req.data == 1){
                    $("#hideContainer").css({
                        "display":"none"
                    });
                }
            },"json");

        //验证格式


    },

    //事件调用方法1
    search:function(e){
        var _this=this;
        $.get("../call/jh_mem.php",
            {action:"fuzzyGetDname",dname:$("#dis_nickname").val()},
            function (req){
                var fakeReq=[{"id":"284","dname":"\u62c9\u624b\u7f51","mobile":"18789718151","passport":"200044","cname":"\u6f58\u5b5d\u73e0","com_type":"\u7535\u5546","created":0},{"id":"318","dname":"\u6765\u5f80\u5546\u65c5","mobile":"13379992424","passport":"200063","cname":"\u674e\u6653\u9633","com_type":"\u5176\u4ed6","created":0},{"id":"664","dname":"\u6ea7\u9633\u5e02\u94f6\u674f\u6811\u7968\u52a1\u4e2d\u5fc3","mobile":"15051900690","passport":"200128","cname":"\u8463\u5148\u751f","com_type":"\u5176\u4ed6","created":0},{"id":"672","dname":"\u65c5\u6e38\u4e92\u8054","mobile":"13475969093","passport":"200136","cname":"\u66f9\u5148\u751f","com_type":"\u5176\u4ed6","created":1},{"id":"680","dname":"\u4e50\u6e38\u5929\u4e0b","mobile":"15588839766","passport":"200144","cname":"\u6d4e\u5357\u4e50\u6e38\u5929\u4e0b\u4fe1\u606f\u54a8\u8be2\u6709\u9650\u516c\u53f8","com_type":"\u7535\u5546","created":0},{"id":"697","dname":"\u6d41\u6d6a\u7f51","mobile":"18950117818","passport":"200161","cname":"\u6d41\u6d6a\u7f51","com_type":"\u7535\u5546","created":0},{"id":"710","dname":"\u8fde\u660e\u4e3d","mobile":"13720735111","passport":"200174","cname":"\u8fde\u660e\u4e3d","com_type":"\u65c5\u884c\u793e","created":0},{"id":"737","dname":"\u8fbd\u5b81\u56fd\u9645\u5546\u52a1\u65c5\u884c\u793e","mobile":"18602490411","passport":"200200","cname":"\u90d1\u51ef\u6587","com_type":"\u65c5\u884c\u793e","created":0},{"id":"789","dname":"\u5415","mobile":"15005912274","passport":"200252","cname":"\u5415\u9e4f\u8f89","com_type":"\u65c5\u884c\u793e","created":0},{"id":"822","dname":"\u65c5\u6e38\u5c0f\u5e97","mobile":"15764235091","passport":"200282","cname":"\u5d14\u7389\u857e","com_type":"\u5176\u4ed6","created":0}]
                _this.trigger("showResult",fakeReq)
            },"json");
        if($("form").attr("data") == 1){
            if($("#dis_nickname").val()){
                $(".createNew").show()
            }
        }
    },

    //事件调用方法2
    showHiddenPart:function(){
        $("#hideContainer").show()
    },


    formSubmit:function(e){
        var fillPart =$("#highLevel input");
        for(var i = 0 ; i<fillPart.length ; i++){
            if(!fillPart.eq(i).val()){
                alert("必填部分不能为空");
                return false
            }
        }

        var checkPart = $("#highLevel .tip");
        for(var i = 0 ; i<checkPart.length ; i++){
            if(checkPart.eq(i).text()){
                return false
            }
        }

        $.post("../call/jh_mem.php",
            {action:"AddRelationShip",distor:$(e.target).attr("data-id"),token:$("#csrf_token").val()},
            function (req){
                if(req.status != "success"){
                    alert(req.msg)
                }else{
                    $(e.target).replaceWith($("<span>已添加|<a class='price_fix' data-id="+req.id+">价格配置</a></span>"));
                }
            },"json")
    },


    check_CN_Phone:function (e) {
        var error = "";
        if(!Validate.typeCN($(e.target).val())&&!Validate.typePhone($(e.target).val())) {
            error = "请输入电话号码或分销商名称";
        }else{
            if(!Validate.typeCN($(e.target).val())){
                $("#dis_name").val($(e.target).val())
            }
            if(!Validate.typePhone($(e.target).val())){
                $("#telephone").val($(e.target).val())
            }
        }

        if(error){
            $(e.target).next("div").find("span[id$=tip]").text(error)
        }else{
            $(e.target).next("div").find("span[id$=tip]").text("")
        }
    },
    check_CN:function (e) {
        var error = "";
        if(!Validate.typeCN($(e.target).val())) {
            error = "公司名为中文汉字";
        }
        if(error){
            $(e.target).next("span[id$=tip]").text(error)
        }else{
            $(e.target).next("span[id$=tip]").text("")
        }
    },

    check_Phone:function (e) {
        var error = "";
        if(!Validate.typePhone($(e.target).val())) {
            error = "电话格式不正确";
        }
        if(error){
            $(e.target).next("span[id$=tip]").text(error)
        }else{
            $(e.target).next("span[id$=tip]").text("")
        }
    },

    check_Num:function (e) {
        var error = "";
        if(!Validate.typeNum($(e.target).val())) {
            error = "电话格式不正确";
        }
        if(error){
            $(e.target).next("span[id$=tip]").text(error)
        }else{
            $(e.target).next("span[id$=tip]").text("")
        }
    },
    check_Code:function (e) {
        var error = ""
        if($(e.target).val().length < 6){
            error = "密码长度小于6位";
        }
        if(error){
            $(e.target).next("span[id$=tip]").text(error)
        }else{
            $(e.target).next("span[id$=tip]").text("")
        }
    },

    confirm_Code:function (e) {
        var error = ""

        if($(e.target).val().length < 6){
            error = "密码长度小于6位";
        }else{
            if($(e.target).val()!=$("#password").val()){
                error = "两次输入的密码不一致，请重新输入";
            }
        }


        if(error){
            $(e.target).next("span[id$=tip]").text(error)
        }else{
            $(e.target).next("span[id$=tip]").text("")
        }
    }


});

//模块导出
module.exports=FILTER_BOX;
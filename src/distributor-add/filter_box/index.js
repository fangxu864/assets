/**
 * Created by Administrator on 2016/11/21.
 */
require("./index.scss");
//require("./jquery.validate.min.js");
var Validate = require("COMMON/js/util.validate.js");
var tpl_high = require("./filter_box_high.xtpl");
var tpl_low = require("./filter_box_low.xtpl");


var FILTER_BOX=PFT.Util.Class({
    //放入容器
    container:"#filter_box",

//绑定事件
    EVENTS:{
         "blur .secondSearch":"secondSearch",
         "blur .secondThird":"secondThird",
         "input #dis_nickname":"search",
         //"blur #dis_nickname":"check_CN_Phone",
         "click .createNew":"showHiddenPart",
         "click .closeNew":"hideHiddenPart",
         "input #dis_name":"check_CN",
         "input #telephone":"check_Phone",
         "input #phone":"check_Num",
         "input #password_confirm":"confirm_Code",
         "input #password":"check_Code",
          "click #submit":"formSubmit"
    },

    //init()方法在实例化以后会默认执行
    init:function(){
        var _this = this;
        //判断是否可以直接搜索
        $.post("../r/Member_MemberInfo/getAddSalerType",
            {},
            function (req){
                //加载模版
                $("form").attr("data",req.data);
                if(req.data == 1){
                    $("#filter_box").append(tpl_high);
                }else {
                    $("#filter_box").append(tpl_low);
                }
            },"json");


    },

    //检索
    search:function(e){

        var _this=this;

        //验证格式
        var error = "";
        if(!Validate.typeCN($(e.target).val())&&!Validate.typePhone($(e.target).val())) {
            error = "请输入电话号码或分销商名称";
        }/*else{
            if(!Validate.typeCN($(e.target).val())){
                $("#dis_name").val($(e.target).val())
            }
            if(!Validate.typePhone($(e.target).val())){
                $("#telephone").val($(e.target).val())
            }
        }*/

        if(error){
            $(e.target).next("div").find("span[id$=tip]").text(error)
        }else{
            $(e.target).next("div").find("span[id$=tip]").text("")
        }

        //弹出创建
        var content = $("#dis_nickname").val();
        if(Validate.typeCN(content)){
            $(".createNew").show();
        }else if (Validate.typePhone(content)){
            $(".createNew").show();
        }

        //检索
        $.get("../call/jh_mem.php",
            {action:"fuzzyGetDname",dname:$("#dis_nickname").val()},
            function (req){
                //var fakeReq=[{"id":"284","dname":"\u62c9\u624b\u7f51","mobile":"18789718151","passport":"200044","cname":"\u6f58\u5b5d\u73e0","com_type":"\u7535\u5546","created":0},{"id":"318","dname":"\u6765\u5f80\u5546\u65c5","mobile":"13379992424","passport":"200063","cname":"\u674e\u6653\u9633","com_type":"\u5176\u4ed6","created":0},{"id":"664","dname":"\u6ea7\u9633\u5e02\u94f6\u674f\u6811\u7968\u52a1\u4e2d\u5fc3","mobile":"15051900690","passport":"200128","cname":"\u8463\u5148\u751f","com_type":"\u5176\u4ed6","created":0},{"id":"672","dname":"\u65c5\u6e38\u4e92\u8054","mobile":"13475969093","passport":"200136","cname":"\u66f9\u5148\u751f","com_type":"\u5176\u4ed6","created":1},{"id":"680","dname":"\u4e50\u6e38\u5929\u4e0b","mobile":"15588839766","passport":"200144","cname":"\u6d4e\u5357\u4e50\u6e38\u5929\u4e0b\u4fe1\u606f\u54a8\u8be2\u6709\u9650\u516c\u53f8","com_type":"\u7535\u5546","created":0},{"id":"697","dname":"\u6d41\u6d6a\u7f51","mobile":"18950117818","passport":"200161","cname":"\u6d41\u6d6a\u7f51","com_type":"\u7535\u5546","created":0},{"id":"710","dname":"\u8fde\u660e\u4e3d","mobile":"13720735111","passport":"200174","cname":"\u8fde\u660e\u4e3d","com_type":"\u65c5\u884c\u793e","created":0},{"id":"737","dname":"\u8fbd\u5b81\u56fd\u9645\u5546\u52a1\u65c5\u884c\u793e","mobile":"18602490411","passport":"200200","cname":"\u90d1\u51ef\u6587","com_type":"\u65c5\u884c\u793e","created":0},{"id":"789","dname":"\u5415","mobile":"15005912274","passport":"200252","cname":"\u5415\u9e4f\u8f89","com_type":"\u65c5\u884c\u793e","created":0},{"id":"822","dname":"\u65c5\u6e38\u5c0f\u5e97","mobile":"15764235091","passport":"200282","cname":"\u5d14\u7389\u857e","com_type":"\u5176\u4ed6","created":0}]
                _this.trigger("showResult",req)
            },"json");
        if($("form").attr("data") == 1){
            if($("#dis_nickname").val()){
                $(".createNew").show()
            }
        }
    },

    //第二搜索项 分销商名称
    secondSearch:function (e) {
        var error = "";
        //检测中文
        if(!Validate.typeCN($(e.target).val())) {
            error = "公司名为中文汉字";
        }
        if(error){
            $(e.target).next("span[id$=tip]").text(error);
            return false
        }else{
            $(e.target).next("span[id$=tip]").text("")
        }
        var _this = this;

        //检索
        $.get("../call/jh_mem.php",
            {action:"chkAndGetDname_a",dname:$("#dis_name").val(),com_type:"all"},
            function (req){
                //var fakeReq=[{"id":"284","dname":"\u62c9\u624b\u7f51","mobile":"18789718151","passport":"200044","cname":"\u6f58\u5b5d\u73e0","com_type":"\u7535\u5546","created":0},{"id":"318","dname":"\u6765\u5f80\u5546\u65c5","mobile":"13379992424","passport":"200063","cname":"\u674e\u6653\u9633","com_type":"\u5176\u4ed6","created":0},{"id":"664","dname":"\u6ea7\u9633\u5e02\u94f6\u674f\u6811\u7968\u52a1\u4e2d\u5fc3","mobile":"15051900690","passport":"200128","cname":"\u8463\u5148\u751f","com_type":"\u5176\u4ed6","created":0},{"id":"672","dname":"\u65c5\u6e38\u4e92\u8054","mobile":"13475969093","passport":"200136","cname":"\u66f9\u5148\u751f","com_type":"\u5176\u4ed6","created":1},{"id":"680","dname":"\u4e50\u6e38\u5929\u4e0b","mobile":"15588839766","passport":"200144","cname":"\u6d4e\u5357\u4e50\u6e38\u5929\u4e0b\u4fe1\u606f\u54a8\u8be2\u6709\u9650\u516c\u53f8","com_type":"\u7535\u5546","created":0},{"id":"697","dname":"\u6d41\u6d6a\u7f51","mobile":"18950117818","passport":"200161","cname":"\u6d41\u6d6a\u7f51","com_type":"\u7535\u5546","created":0},{"id":"710","dname":"\u8fde\u660e\u4e3d","mobile":"13720735111","passport":"200174","cname":"\u8fde\u660e\u4e3d","com_type":"\u65c5\u884c\u793e","created":0},{"id":"737","dname":"\u8fbd\u5b81\u56fd\u9645\u5546\u52a1\u65c5\u884c\u793e","mobile":"18602490411","passport":"200200","cname":"\u90d1\u51ef\u6587","com_type":"\u65c5\u884c\u793e","created":0},{"id":"789","dname":"\u5415","mobile":"15005912274","passport":"200252","cname":"\u5415\u9e4f\u8f89","com_type":"\u65c5\u884c\u793e","created":0},{"id":"822","dname":"\u65c5\u6e38\u5c0f\u5e97","mobile":"15764235091","passport":"200282","cname":"\u5d14\u7389\u857e","com_type":"\u5176\u4ed6","created":0}]
                //如果搜索的已经存在
                if(req.code!=100){
                    $(e.target).next("span[id$=tip]").text("公司名已存在");
                }else{
                    $(e.target).next("span[id$=tip]").text("")
                }
                _this.trigger("showResult",req)
            },"json");
    },

    //第三搜索项 手机号
    secondThird:function (e) {
        var _this = this;
        //检测手机
        var error = "";
        if(!Validate.typePhone($(e.target).val())) {
            error = "手机格式不正确";
        }
        if($(e.target).val() === ""){
            error = ""
        }
        if(error){
            $(e.target).next("span[id$=tip]").text(error)
            return false
        }else{
            $(e.target).next("span[id$=tip]").text("")
        }

        //检索
        $.get("../call/jh_mem.php",
            {action:"chkAndGet2",mobile:$("#telephone").val(),type:"no_member"},
            function (req){
                //var fakeReq=[{"id":"284","dname":"\u62c9\u624b\u7f51","mobile":"18789718151","passport":"200044","cname":"\u6f58\u5b5d\u73e0","com_type":"\u7535\u5546","created":0},{"id":"318","dname":"\u6765\u5f80\u5546\u65c5","mobile":"13379992424","passport":"200063","cname":"\u674e\u6653\u9633","com_type":"\u5176\u4ed6","created":0},{"id":"664","dname":"\u6ea7\u9633\u5e02\u94f6\u674f\u6811\u7968\u52a1\u4e2d\u5fc3","mobile":"15051900690","passport":"200128","cname":"\u8463\u5148\u751f","com_type":"\u5176\u4ed6","created":0},{"id":"672","dname":"\u65c5\u6e38\u4e92\u8054","mobile":"13475969093","passport":"200136","cname":"\u66f9\u5148\u751f","com_type":"\u5176\u4ed6","created":1},{"id":"680","dname":"\u4e50\u6e38\u5929\u4e0b","mobile":"15588839766","passport":"200144","cname":"\u6d4e\u5357\u4e50\u6e38\u5929\u4e0b\u4fe1\u606f\u54a8\u8be2\u6709\u9650\u516c\u53f8","com_type":"\u7535\u5546","created":0},{"id":"697","dname":"\u6d41\u6d6a\u7f51","mobile":"18950117818","passport":"200161","cname":"\u6d41\u6d6a\u7f51","com_type":"\u7535\u5546","created":0},{"id":"710","dname":"\u8fde\u660e\u4e3d","mobile":"13720735111","passport":"200174","cname":"\u8fde\u660e\u4e3d","com_type":"\u65c5\u884c\u793e","created":0},{"id":"737","dname":"\u8fbd\u5b81\u56fd\u9645\u5546\u52a1\u65c5\u884c\u793e","mobile":"18602490411","passport":"200200","cname":"\u90d1\u51ef\u6587","com_type":"\u65c5\u884c\u793e","created":0},{"id":"789","dname":"\u5415","mobile":"15005912274","passport":"200252","cname":"\u5415\u9e4f\u8f89","com_type":"\u65c5\u884c\u793e","created":0},{"id":"822","dname":"\u65c5\u6e38\u5c0f\u5e97","mobile":"15764235091","passport":"200282","cname":"\u5d14\u7389\u857e","com_type":"\u5176\u4ed6","created":0}]
                //如果搜索的已经存在
                if(req.code!=101){
                    $(e.target).next("span[id$=tip]").text("手机号已存在");
                }else{
                    $(e.target).next("span[id$=tip]").text("")
                }
                _this.trigger("showResultObj",req);
            },"json");
    },

    //显示隐藏部分
    showHiddenPart:function(e){
        $("#hideContainer").show();
        $(e.target).text("选择已有分销商").addClass("closeNew").removeClass("createNew");

        var content = $("#dis_nickname").val();
        if(Validate.typeCN(content)){
            $("#dis_name").val(content);
        }else if (Validate.typePhone(content)){
            $("#telephone").val(content);
        }
    },

    //隐藏隐藏部分
    hideHiddenPart:function(e){
        $("#hideContainer").hide();
        $(e.target).text("创建新分销商").addClass("createNew").removeClass("closeNew");
        var content = $("#dis_nickname").val();
        if(Validate.typeCN(content)){
            $("#dis_name").val(content);
        }else if (Validate.typePhone(content)){
            $("#telephone").val(content);
        }
    },

    //点击提交
    formSubmit:function(e){
        var fillPart =$("form input[required]");
        for(var i = 0 ; i<fillPart.length ; i++){
            if(!fillPart.eq(i).val()){
                alert("必填部分不能为空");
                return false
            }
        }

        var checkPart = $("form .tip");
        for(var i = 0 ; i<checkPart.length ; i++){
            if(checkPart.eq(i).text()){
                alert("请检查您的输入是否有错误");
                return false
            }
        }

        $.post("../call/jh_mem.php",
            {
                action:"RelationshipCreate",
                distor:$(e.target).attr("data-id"),
                csrf_token:$("#csrf_token").val(),
                actionType:"CreateDistor",
                dtype:1,
                company:$("#dis_name").val(),
                username:$("#name").val(),
                confirmPwd:$("#password_confirm").val(),
                password:$("#password").val(),
                mobile:$("#telephone").val(),
                com_type:$("select option:checked").val(),
                s_val:$("#dis_nickname").val(),
                g_tel:$("#phone").val()

            },
            function (req){
                alert(req.msg);
                if(req.status == "ok"){
                    window.location.reload();
                }
                // $(e.target).replaceWith($("<span>已添加|<a class='price_fix' data-id="+req.id+">价格配置</a></span>"));

            },"json")
    },


    //检查中文或者手机
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

    //检查中文
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


    //检查手机
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

    //检查数字
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

    //检查密码长度
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

    //检查密码长度以及验证重复输入
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
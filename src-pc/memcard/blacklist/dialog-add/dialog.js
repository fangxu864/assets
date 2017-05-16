/**
 * Created by Administrator on 2017/3/1.
 */
//-------------css--------------
require("./dialog.scss");

//-------------tpl--------------
var addTpl = require("./add.xtpl");

//-----------modules------------
var Message = require("pft-ui-component/Message");
window.Mess = Message;
var Dialog=require("COMMON/modules/dialog-simple");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
var Select = require("COMMON/modules/select");
var tips = require("COMMON/modules/tips/index.js");
var Tips = new tips ();
//公共资源common resource
var CR = require("../CR.js");


var DialogModule = PFT.Util.Class({
    container: $("<div class='blackListDialogCon-add'></div>"),
    init: function (opt) {
        var _this = this;
        this.dial = new Dialog({
            width : 500,
            offsetY : -80,
            closeBtn : true,
            content : "",
            drag : true,
            speed : 100,
            onCloseAfter : function(){
                Tips.closeAllTips();
            }
        });
        this.landListData = opt.landListData;
        this.dial.container.find(".gSimpleDialog-content").append(_this.container);
        this.container.html(addTpl);
        this.bind();
        
    },

    show: function () {
        var _this = this;
        this.dial.open();
        //清空input
        this.container.find(".line1 .landInp").removeAttr("data-id");
        this.container.find(".line1 .landInp").val('');
        this.container.find(".line2 .userName").val('');
        this.container.find(".line3 .idNum").val('');
    },
    
    bind: function () {
        var _this = this;
        this.container.on("click" ,"#landInpAdd" ,function (e) {
            var curInp = $(this);
            //点击时才初始化产品选择框
            if( !_this.landSelect ){
                _this.landSelect = new Select({
                    height:300,
                    top:0,
                    field : {
                        id : "id",
                        name : "title",
                        keyword : "title"
                    },
                    trigger : $("#landInpAdd"),
                    data: _this.landListData
                });
                curInp.click();
            }
        });

        //取消
        this.container.on("click" ,".cancel-btn" ,function () {
            _this.dial.close();
        });

        //确认
        this.container.on("click", ".save-btn" ,function () {
            _this.addBlacklistRequest();
        })
    },

    /**
     * @method 增加黑名单
     */
    addBlacklistRequest: function () {
        var _this = this;
        var params = {};
        var landInp = this.container.find(".line1 .landInp");
        var userNameInp = this.container.find(".line2 .userName");
        var idNumInp = this.container.find(".line3 .idNum");
        params["lid"] = landInp.attr("data-id");
        if(!CR.judgeTrue(params["lid"])){
            Tips.closeAllTips();
            Tips.show({
                lifetime : 1500 ,
                direction:'right',
                hostObj : landInp ,
                content : "请选择产品",
                bgcolor : "#f0c245"
            });
            return false;
        }
        params["name"] = userNameInp.val().trim();
        if(params["name"] == ""){
            Tips.closeAllTips();
            Tips.show({
                lifetime : 1500 ,
                direction:'right',
                hostObj : userNameInp ,
                content : "请填写姓名",
                bgcolor : "#f0c245"
            });
            return false;
        }
        params["id_card"] = idNumInp.val().trim();
        if(!PFT.Util.Validate.idcard(params["id_card"])){
            Tips.closeAllTips();
            Tips.show({
                lifetime : 1500 ,
                direction:'right',
                hostObj : idNumInp ,
                content : "请填写正确的身份证号",
                bgcolor : "#f0c245"
            });
            return false;
        }

        $.ajax({
            url: CR.url.addBlackList,    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: params,    //参数值
            type: "POST",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                // 请求成功时处理
                //缓存数据
               if(CR.judgeTrue(res)){
                   if(res.code == 200 ){
                       Message.success("添加成功")
                   }else{
                       Message.error(res.msg)
                   }
               }
            },
            complete: function(res,status) {
                //请求完成的处理
                // _this.hideLoading();
                if(status=="timeout"){
                    Message.alert("请求超时")
                }
            },
            error: function() {
                //请求出错处理
                // _this.hideLoading();
            }
        });
    }

});

module.exports = DialogModule;

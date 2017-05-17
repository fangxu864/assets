/**
 * Created by Administrator on 2017/3/1.
 */
//-------------css--------------
require("./dialog.scss");

//-------------tpl--------------
var leadingInTpl = require("./leading-in.xtpl");


//-----------modules------------
var Dialog=require("COMMON/modules/dialog-simple");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
var Select = require("COMMON/modules/select");
var Message = require("pft-ui-component/Message");
var tips = require("COMMON/modules/tips/index.js");
var Tips = new tips ();


var DialogModule = PFT.Util.Class({
    container: $("<div class='blackListDialogCon-excel'></div>"),
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
            }
        });
        this.landListData = opt.landListData;
        this.dial.container.find(".gSimpleDialog-content").append(_this.container);
        this.container.html(leadingInTpl);
        this.bind();
    },

    show:function () {
        this.dial.open()
    },

    bind: function () {
        var _this = this;
        _this.landSelectadd = new Select({
            height:300,
            top:0,
            field : {
                id : "id",
                name : "title",
                keyword : "title"
            },
            trigger : $("#landExcel"),
            data: _this.landListData
        });
        //取消
        this.container.on("click" ,".cancel-btn" ,function () {
            _this.dial.close();
        });

        this.container.on("click" ,"#landExcel" ,function (e) {
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
                    trigger : $("#landExcel"),
                    data: _this.landListData
                });
                curInp.click();
            }
        });

        //导入
        this.container.on("click" ,".save-btn" ,function (e) {
            if($(this).hasClass("disable")) return false;
            var landInp = $("#landExcel");
            var fileInp = _this.container.find(".file-name-inp");
            if(landInp.val() == ""){
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
            if(fileInp.val() == ""){
                Tips.closeAllTips();
                Tips.show({
                    lifetime : 1500 ,
                    direction:'right',
                    hostObj : fileInp ,
                    content : "请选择文件",
                    bgcolor : "#f0c245"
                });
                return false;
            }
            var lid =  _this.container.find("#landExcel").attr("data-id");
            _this.container.find(".line1 .lid-hide-inp").val(lid);
            _this.container.find(".excel-form").submit();
            var loadingStr = PFT.Util.LoadingPc("上传中...",{
                tag : "span",
                height:14
            });
            $(this).addClass("disable").html(loadingStr)
        });

        this.container.on("change" ,".line2 .file-inp" ,function (e) {
            var name = e.target.files[0].name;
            _this.container.find(".line2 .file-name-inp").val(name);
        });

        window.excelFileUpLoaded = function (data) {
            var saveBtn =  _this.container.find(".save-btn");
            if(data[0] == 200){
                saveBtn.removeClass("disable").html("导入");
                _this.container.find("#landExcel").val("");
                _this.container.find(".file-name-inp").val("");
                _this.container.find(".lid-hide-inp").val("");
                _this.container.find(".file-inp").val("");
                _this.dial.close();
                Message.success(data[2])
            }else{
                saveBtn.removeClass("disable").html("导入");
                Message.error(data[2])
            }
        }
    }
});

module.exports = DialogModule;

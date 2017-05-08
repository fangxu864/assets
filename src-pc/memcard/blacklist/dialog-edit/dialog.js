/**
 * Created by Administrator on 2017/3/1.
 */
//-------------css--------------
require("./dialog.scss");

//-------------tpl--------------
var editTpl = require("./edit.xtpl");

//-----------modules------------
var Dialog=require("COMMON/modules/dialog-simple");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
var Select = require("COMMON/modules/select");


var DialogModule = PFT.Util.Class({
    container: $("<div class='blackListDialogCon-edit'></div>"),
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
        this.container.html(editTpl);
        this.bind();
        
    },

    show:function () {
        this.dial.open()
    },

    bind: function () {
        var _this = this;
        this.container.on("click" ,"#landInpEdit" ,function (e) {
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
                    trigger : $("#landInpEdit"),
                    data: _this.landListData
                });
                curInp.click();
            }
        });
    }

});

module.exports =  DialogModule;

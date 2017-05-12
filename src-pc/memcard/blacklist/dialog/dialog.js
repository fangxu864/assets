/**
 * Created by Administrator on 2017/3/1.
 */
//-------------css--------------
require("./dialog.scss");

//-------------tpl--------------
var editTpl = require("./edit.xtpl");
var leadingInTpl = require("./leading-in.xtpl");
var addTpl = require("./add.xtpl");

//-----------modules------------
var Dialog=require("COMMON/modules/dialog-simple");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");


var DialogModule = PFT.Util.Class({
    container: $("<div class='blackListDialogCon'></div>"),
    init: function () {
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
        this.dial.container.find(".gSimpleDialog-content").append(_this.container);
        this.bind();
        
    },

    editShow:function () {
        this.container.html(editTpl);
        this.dial.open()
    },

    leadingInShow: function () {
        this.container.html(leadingInTpl);
        this.dial.open()
    },

    addShow: function () {
        this.container.html(addTpl);
        this.dial.open()
    },
    
    bind: function () {
        var _this = this;

    },

    /**
     * @method 解析模板
     */
    editTemplate: ParseTemplate(editTpl),
    leadingInTemplate: ParseTemplate(leadingInTpl)
});

module.exports = new DialogModule();

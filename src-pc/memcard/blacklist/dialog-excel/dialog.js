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


var DialogModule = PFT.Util.Class({
    container: $("<div class='blackListDialogCon-excel'></div>"),
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
        this.container.html(leadingInTpl);
        this.bind();
        
    },

    show:function () {
        this.dial.open()
    },

    bind: function () {
        var _this = this;

    }
});

module.exports = DialogModule;
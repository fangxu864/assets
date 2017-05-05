/**
 * Created by Administrator on 2017/3/1.
 */


//---------css--------
require("./index.scss");

//---------tpl--------

//--------modules-----
var Dialog = require("COMMON/modules/dialog-simple");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");

var detail = PFT.Util.Class({

    init: function () {
        this.dial = new Dialog({
            width : 600,
            height: 200,
            offsetY : -80,
            closeBtn : true,
            content : "",
            drag : true,
            speed : 100,
            onCloseAfter : function(){
            }
        });
        this.container = this.dial.container.find(".gSimpleDialog-content");
        this.dial.open();
    },

    bind: function () {
        var _this = this;

    }
});



module.exports = detail;

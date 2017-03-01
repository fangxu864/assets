/**
 * Created by Administrator on 2017/3/1.
 */

require("./dialog.scss");
var Dialog=require("COMMON/modules/dialog-simple");
var dialogTpl = require("./dialog.xtpl");

var DialogModule = {
    container: $("<div class='adminRefundDialogCon'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.dial = new Dialog({
            width : 600,
            offsetY : -80,
            closeBtn : true,
            content : "",
            drag : true,
            speed : 100,
            onCloseAfter : function(){
            }
        });
        this.dial.container.find(".gSimpleDialog-content").append(_this.container);
        this.container.html(dialogTpl);
        // this.dial.open();
    }
};

module.exports = DialogModule;

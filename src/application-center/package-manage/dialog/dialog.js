/**
 * Created by Administrator on 2017/3/1.
 */

require("./dialog.scss");
var Dialog=require("COMMON/modules/dialog-simple");
var detailTpl = require("./detail.xtpl");
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
    },

    render:function (data) {
        var html = this.detailTemplate({data : data});
        this.container.html(html);
        this.dial.open()
    },


    /**
     * @method 解析模板
     */
    detailTemplate: ParseTemplate(detailTpl)
});

module.exports = DialogModule;

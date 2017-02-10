/**
 * Created by Administrator on 2017/2/9.
 */
require("./index.scss");
var ParseTemplate = require("COMMON/js/util.parseTemplate");
var Dialog=require("COMMON/modules/dialog-simple");
var tpl = require("./index.xtpl");

var Dial=new Dialog({
    width : 700,
    height : 600,
    closeBtn : true,
    content : tpl,
    drag : true,
    speed : 100,
    onCloseAfter : function(){
    }
});

var SigningStaff = {
    open : function () {
        Dial.open();
    }
}

$.subscribe("signingStaffClick",function () {
    SigningStaff.open()
});

/**
 * Created by Administrator on 2017/2/9.
 */

var ParseTemplate = require("COMMON/js/util.parseTemplate");
var Dialog=require("COMMON/modules/dialog-simple");

var Dial=new Dialog({
    width : 700,
    height : 600,
    closeBtn : true,
    content : "123456",
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

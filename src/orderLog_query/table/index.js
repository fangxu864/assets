/**
 * Created by Administrator on 2016/11/14.
 */

// //引入css
// require("./index.scss");
// //引入tpl
// var table_tpl=require("./index.xtpl");

var Table=PFT.Util.Class({
    container:"#table_box",
    EVENTS:{

    },
    say_hi:function (data) {
        alert(data)
    },
    say_hello:function (data) {
        alert(data)
    }
});

module.exports=Table;

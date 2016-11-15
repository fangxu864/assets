/**
 * Created by Administrator on 2016/11/14.
 */

// //引入css
// require("./index.scss");
// //引入tpl
// var filer_tpl=require("./index.xtpl");

var Filter=PFT.Util.Class({
    container:"#filter_box",
    EVENTS:{
        "click button":"dealData"
    },
    init:function () {

    },
    onQuery:function () {

    },
    dealData:function () {
        console.log("fsdf");
        this.trigger("say_hi","hi");
        this.trigger("say_hello","hello")
    }

});

module.exports=Filter;
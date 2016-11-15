/**
 * Created by Administrator on 2016/11/14.
 */

//引入modules
var Filter=require("./filter");
var Table=require("./table");
var Pagination=require("./filter");


var Main={
    //初始化
    init:function () {
        var _this=this;
        this.filer=new Filter;
        this.table=new Table;
      
        this.filer.on("say_hi",function (data) {
            _this.table.say_hi(data);
        });
        this.filer.on("say_hello",function (data) {
            _this.table.say_hello(data);
        })

    },
    //模块交流区
    talkArea:function () {
        var _this=this;

    }

};

$(function () {
    Main.init()
});
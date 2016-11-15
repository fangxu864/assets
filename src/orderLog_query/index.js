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
        this.filter=new Filter;
        this.table=new Table;
      
        this.filter.on("say_hi",function (data) {
            _this.table.say_hi(data);
        });
        this.filter.on("say_hello",function (data) {
            _this.table.say_hello(data);
        });
        this.filter.trigger("say_hi","hi");

    },
    //模块交流区
    talkArea:function () {
        var _this=this;

    }

};

$(function () {
    Main.init()
});
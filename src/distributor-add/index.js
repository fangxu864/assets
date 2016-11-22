/**
 * Created by Administrator on 2016/11/21.
 */

var FILTER_BOX=require("./filter_box");
var RESULT_BOX=require("./result_box");
var QUICK_BOX=require("./quick_box");


var Main={
    //初始化
    init:function () {

//将块级元素实例化成一个内部的对象
        this.filter_box=new FILTER_BOX;
        this.result_box=new RESULT_BOX;
        this.quick_box=new QUICK_BOX;

//存放一些全局变量
        this.publicParams = {
            a : "" ,
            b : [] ,
            c :  {}
        };

//运行模块交流部分
        this.CommunicateArea();

    },

//所有模块的交流区域
    CommunicateArea:function(){
        var _this = this;
        this.filter_box.on("showResult",function(req){
//当监听到发布的事件时，可以调用其他模块的部分
            _this.result_box.showResult(req)
        })
        this.quick_box.on("quickShow",function (req) {
            //console.log(req)
            _this.result_box.quickAdd(req)
        })
    },

    PublicFuction:{
        Function1:function(){},
},


};




$(function () {
    Main.init()
});



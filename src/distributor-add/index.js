/**
 * Created by Administrator on 2016/11/21.
 */

var newPart1=require("./filter_box");


var Main={
    //初始化
    init:function () {

//将块级元素实例化成一个内部的对象
        this.part=new newPart1;

//存放一些全局变量
        this.publicParams = {
            a : "" ,
            b : [] ,
            c :  {}
        };

//运行模块交流部分
        this.CommunicateArea()
    },

//所有模块的交流区域
    CommunicateArea:function(){
        var _this = this;
        this.newPart1.on("customizedEvent1",function(data){
//当监听到发布的事件时，可以调用其他模块的部分
            _this.newPart2.someFuction()
        })
    },

    PublicFuction:{
        Function1:function(){},
}

}


$(function () {
    Main.init()
});
/**
 * Created by Administrator on 2016/7/21.
 */
require("./index.scss");
var tpl = require("./index.xtpl");



var conContainer={
    init:function () {
        this.container=document.getElementById("con_container");
        this.container.innerHTML=tpl;

        this.bindEvent();
    },
    bindEvent:function () {
        var _this=this;
        this.table=document.getElementById("orderTable");
        this.thead=document.getElementById("thead");
        addEvent(window,"scroll",function () {
            var top = document.documentElement.scrollTop || document.body.scrollTop;
            if(_this.table.offsetTop+200<top){
                _this.thead.className="thead_fixed";
            }else{
                _this.thead.className="";
            }
        });
        function addEvent(obj,event,fn){
            if(obj.attachEvent){
                obj.attachEvent("on"+event,fn)
            }else {
                obj.addEventListener(event,fn,false)
            }
        }

    }

}

module.exports=conContainer;




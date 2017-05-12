/**
 * 
 * @author : huangzhiyang166
 * @emial : 348845730@qq.com
 * 
 * 判断鼠标点击是否在某个元素外，这个方法经常适用于如下情况：
 * 页面上一个模态弹窗，当用户点击弹窗以外的任意元素时关闭弹窗
 * 以前常用的做法是，每个弹层下面动态生成一个透明遮罩层div，覆盖整个可视浏览器窗口，
 * 当用户点击模态弹窗以外的区域时，实际是点击了下面的透明遮罩层div
 * 
 * 这种方法可行，但这样就出现多余的遮罩层div，总觉得不太优雅，所以写了以下ClickOutSideElem对象来专门处理这种情况
 * 
 * 如何使用：
 * 
 * ClickOutSideElem(elem,fn);
 * @elem   要监听的elem元素，一般是弹窗pop的最外层container
 * @fn     当用户点击在elem元素以外的元素时触发回调 
 * 
 * 
 * var ClickOutSideElem = require("ClickOutSideElem.js");
 * var tarContainer = document.getElementById("modelPopContainer");
 * ClickOutSideElem(tarContainer,function(e){
 *      tarContainer.hide();
 * })
 * 
 * 
 */
var ClickOutSideElem = {
    init : function(){
        var that = this;
        if(document.addEventListener){
            document.addEventListener("click",function(e){
                that.clickHandler(e);
            },false)
        }else{
            document.attachEvent("onclick",function(){
                that.clickHandler(window.event);
            })
        }
    },
    clickHandler : function(e){
        var __cache = this.__cache;
        var target = e.target || e.srcElement;
        for(var i=0,len=__cache.length; i<len; i++){
            var item = __cache[i];
            var elem = item.elem;
            var handler = item.handler;
            if(target!==elem && !elem.contains(target)){
                handler(e);
            }
        }
    },
    addCache : function(elem,handler){
        if(!this.__cache || this.__cache.length==0){
            this.__cache = [];
            this.init();
        }
        this.__cache.push({
            elem : elem,
            handler : handler
        })
    }
}

module.exports = function(elem,handler){
    if(!elem) return false;
    handler = handler || function(){};
    ClickOutSideElem.addCache(elem,handler);
}


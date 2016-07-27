// 插件使用说明：
//必须参数为容器的ID，和选项卡的参数数组。
// var a=new SelectShort({
//     id:"div1",
//     arr:["星期一","星期二","星期三","星期四","星期五","星期六","星期日"]
// })
//当前选择内容可由对象的cur_opt属性获取。例如：a.cur_opt  (每次选择都会更新此属性)
// 容器ID的样式设置例子如下：
// #div1{
//     height: 60px;*必须*
//     width: 500px;*必须*
//     line-height: 60px;*必须*
//     border:1px solid #CCCCCC;*必须*
//     position: relative;*必须*
// }

require("./index.scss");
// var Defaults = {
//     arr : "",
//     key1 : "val1",
//     key2 : "val2"
// };
//默认参数很重要
function SelectShort(opt){
    // var opt = opt || {};
    // for(var i in Defaults){
    //     if(typeof opt[i]=="undefined"){
    //         opt[i] = Defaults[i];
    //     }
    // }
    this.arr=opt.arr;
    this.id=opt.id;
    this.isFold=1;
    this.cur_opt="";
    this.init();
}
SelectShort.prototype={
    init : function () {
        var html='<div class="select_short"> <span class="cur_con fold">下单时间</span><ul class="opt" style="display: block;height: 0px;overflow: hidden;"> </ul></div>';
        //找到所需要的容器
        var _this=document.getElementById(this.id);
        _this.innerHTML=html;
        _this.style.position="relative";
        //给第一层div select_short赋值宽度
        this.select_short=_this.getElementsByClassName("select_short")[0];
        this.select_short.style.width=(parseInt(this.getStyle(_this,"width"))+2)+"px";
        //获取_this的高度
        this._this_h=parseInt(this.getStyle(_this,"height"))+1;

        this.cur_con=_this.getElementsByClassName("cur_con")[0];
        this.opt=_this.getElementsByClassName("opt")[0];
        //往容器里加东西
        this.cur_con.innerHTML=this.arr[0];
        this.cur_opt=this.arr[0];
        for(var i=0;i<this.arr.length;i++){
            this.opt.innerHTML+="<li>"+this.arr[i]+"</li>";
        }
        this.bindEvents();
    },
    bindEvents : function () {
        var _this=this;
        //为每个选项添加点击事件
        function everyLi(){
            _this.options=_this.opt.getElementsByTagName("li");
            for(var j=0;j<_this.options.length;j++){
                _this.options[j].onclick=function () {
                    _this.cur_con.innerHTML=this.innerHTML;
                    _this.cur_opt=this.innerHTML;
                    fold();
                }
            }
        }
        everyLi();
        //展开菜单代码块
        function unFold(){
//        _this.opt.style.display="block";
            startMove(_this.opt,{"height":_this._this_h*_this.arr.length});
            _this.cur_con.className="cur_con unfold";
            _this.isFold=0;
        }
        //折叠菜单代码块
        function fold() {
//          _this.opt.style.display="none";
            startMove(_this.opt,{"height":0})
            _this.cur_con.className="cur_con fold";
            _this.isFold=1;
            document.removeEventListener("click",fold)
        }
        //为当前选项添加点击事件
        this.cur_con.onclick=function (ev) {
            if(_this.isFold){
                //阻止冒泡
                var oEvent=ev||event;
                if(oEvent.stopPropagation){
                    oEvent.stopPropagation();
                }else{
                    window.event.cancelBubble = true;
                }
                //展开select
                unFold();
                document.addEventListener("click",fold)
//          document.onclick=function () {
//            fold();
//            document.onclick=null;
//          }
            }else {
                fold();
            }
        }
        //运动框架函数
        function startMove(obj,json,fnEnd) {
            clearInterval(obj.timer);
            var cur=0;
            var speed=0;
            obj.timer=setInterval(function () {
                var allStop=true;//假设已经全到了
                for(var atr in json){
                    //赋值块
                    if(atr=="opacity"){
                        cur=parseInt(getStyle(obj,atr)*100);
                    }
                    else{
                        cur=parseInt(getStyle(obj,atr))||0;
                    }
                    speed=(json[atr]-cur)/1.5;
                    speed=speed>0?Math.ceil(speed):Math.floor(speed);
                    if(cur!=json[atr]){
                        allStop=false;
                }
                    //运动块
                    if(atr=="opacity"){
                        obj.style[atr]=(cur+speed)/100;
                    }
                    else{
                        obj.style[atr]=cur+speed+"px";
                    }
                }
                if(allStop){
                    clearInterval(obj.timer);
                    if(fnEnd)fnEnd();
                }
            },30)
        }
        //获取当前样式
        function getStyle(obj,name) {
            if (obj.currentStyle) {
                return obj.currentStyle[name];
            }
            else {
                return getComputedStyle(obj, false)[name];
            }
        }
    },
    getStyle:function (obj,name) {
        if (obj.currentStyle) {
            return obj.currentStyle[name];
        }
        else {
            return getComputedStyle(obj, false)[name];
        }
    }
}


module.exports=SelectShort;
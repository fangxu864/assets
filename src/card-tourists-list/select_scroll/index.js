/**
 * Created by Administrator on 2016/7/28.
 */
// 插件使用说明：
//必须参数为容器的ID，和选项卡的参数数组。
// var a=new SelectShort({
//     id:"div1",
//     arr:["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],
//     callback:function(){}
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
require("./index.scss")
function SelectScroll(opt){
    this.arr=opt.arr;
    this.id=opt.id;
    this.isFold=1;
    this.cur_opt="";
    this.callback=opt.callback||function () {};
    this.init();

}
SelectScroll.prototype={
    init : function () {
        
        var html='<div class="select_scroll"> <span class="cur_con fold"></span><ul class="opt" </ul></div>';
        //找到所需要的容器
        var _this=document.getElementById(this.id);
        _this.innerHTML=html;
        _this.style.position="relative";
        //给第一层div select_scroll赋值宽度
        this.select_scroll=getByClass(_this,"select_scroll")[0];
        this.select_scroll.style.width=(parseInt(this.getStyle(_this,"width"))+2)+"px";
        //获取_this的高度
        this._this_h=parseInt(this.getStyle(_this,"height"))+1;

        this.cur_con=getByClass(_this,"cur_con")[0];
        this.opt=getByClass(_this,"opt")[0];
        function getByClass(obj,className) {
            var arr=[];
            if(obj.getElementsByClassName){
                return obj.getElementsByClassName(className);
            }else{
                var allEle=obj.getElementsByTagName("*");
                for(var i=0;i<allEle.length;i++){
                    var cls = allEle[i].getAttribute("class");

                    if(cls.search(className)>-1){
                        arr.push(allEle[i]);
                    }
                }
            }
            return arr;
        }
        //往容器里加东西
        this.cur_con.innerHTML=this.arr[0];
        this.cur_opt=this.arr[0];
        this.callback(this.cur_opt);
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
                    _this.callback(_this.cur_opt);
                    fold();
                }
            }
        }
        everyLi();
        //展开菜单代码块
        function unFold(){
            _this.opt.style.display="block"
//                startMove(_this.opt,{"height":_this._this_h*_this.arr.length});
            _this.cur_con.className="cur_con unfold";
            _this.isFold=0;
        }
        //折叠菜单代码块
        function fold() {
            _this.opt.style.display="none";
//                startMove(_this.opt,{"height":0})
            _this.cur_con.className="cur_con fold";
            _this.isFold=1;
            // document.removeEventListener("click",fold)
            $(document).off("click.select")
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
                // document.addEventListener("click",fold)
                $(document).on("click.select",fold)

            }else {
                fold();
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


module.exports=SelectScroll;
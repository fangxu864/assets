/**
 * Created by Administrator on 2016/7/14.
 */
/**
 var p=new Pagination({
 "id":"pagination_box",//分页器盒子的容器
 "data_total_num":10000,//数据总数量
 "per_page_num":8,//每页显示的数据条数
 "present_page":200,//当前页数
 "callBack":function (present_page) {
 alert(present_page);
 }
 })
 */
var tpl = require("./index.xtpl");
require("./index.scss");
function Pagination(opt){
    this.data_total_num=opt.data_total_num;//数据总条数
    this.present_page=opt.present_page;//当前页数
    this.per_page_num=opt.per_page_num||8;//每页数据条数
    this.a=parseInt(this.data_total_num/this.per_page_num);//计算用的中间变量
    this.total_page_num=this.data_total_num%this.per_page_num>0?this.a+1:this.a;//计算出的 数据总页数
    this.id=opt.id;//ID
    this.callBack=opt.callBack;//回调函数
    //new的时候所执行的初始化方法
    this.init_content();
    this.bindEvent();
    this.updateYema(this.present_page);
        
}
Pagination.prototype={
    //初始化容器
    init_content:function () {
        //分页器盒子
        this.pag_box=document.getElementById(this.id);
        //初始化盒子内容
        this.pag_box.innerHTML=tpl;
        //分页器
        this.pag=this.pag_box.getElementsByClassName("pagination")[0];
        //显示总页数的span
        this.span_total_num=this.pag.getElementsByClassName("total")[0].getElementsByTagName("span")[0];
        this.span_total_num.innerHTML=this.total_page_num;
        //装页码yema的盒子
        this.yema_box=this.pag.getElementsByClassName("yema")[0].getElementsByTagName("ul")[0];
        //上一页按钮
        this.prev=this.pag.getElementsByClassName("prev")[0];
        //下一页按钮
        this.next=this.pag.getElementsByClassName("next")[0];
        //首页按钮
        this.first=this.pag.getElementsByClassName("first")[0];
        //末页按钮
        this.last=this.pag.getElementsByClassName("last")[0];
        //GO按钮
        this.go_btn=this.pag.getElementsByClassName("go_btn")[0];
        //输入框中go_num
        this.go_num=this.pag.getElementsByClassName("go_num")[0];


    },
    //为各个按钮绑定事件
    bindEvent:function () {
        var _this=this;
        this.prev.onclick=function () {
            if(_this.present_page>=2){
                _this.present_page--;
                _this.updateYema(_this.present_page)
            }
        }
        this.next.onclick=function () {
            if(_this.present_page<_this.total_page_num){
                _this.present_page++;
                _this.updateYema(_this.present_page)
            }
        }
        this.first.onclick=function () {
            if(_this.present_page!=1){
                _this.present_page=1;
                _this.updateYema(_this.present_page);
            }
        }
        this.last.onclick=function () {
            if(_this.present_page!=_this.total_page_num){
                _this.present_page=_this.total_page_num;
                _this.updateYema(_this.present_page);
            }
        }
        this.go_btn.onclick=function () {
            var num=parseInt(_this.go_num.value);
            if(num!=_this.present_page){
                if(num>=1&&num<=_this.total_page_num){
                    _this.present_page=num
                    _this.updateYema(_this.present_page)
                }
            }
        }
        this.go_num.onfocus=function () {
            document.onkeydown=function (ev) {
                var oEvent=ev||event;
                if(oEvent.keyCode==13){
                    var num=parseInt(_this.go_num.value);
                    if(num!=_this.present_page){
                        if(num>=1&&num<=_this.total_page_num){
                            _this.present_page=num
                            _this.updateYema(_this.present_page)
                        }
                    }
                }
            }
            _this.go_num.onblur=function () {
                document.onkeydown=null;
            }
        }

    },
    //更新页码容器
    updateYema:function(_present_page){
        var content="";
        //当最后一页时；
        if(this.present_page==this.total_page_num){
            this.last.style.color="#b1b1b1"
            this.next.style.color="#b1b1b1"
        }else{
            this.last.style.color="#666666"
            this.next.style.color="#666666"
        }
        if(this.present_page==1){
            this.first.style.color="#b1b1b1"
            this.prev.style.color="#b1b1b1"
        }else{
            this.first.style.color="#666666"
            this.prev.style.color="#666666"
        }
        if(this.total_page_num<=5){
            for(var i=0;i<this.total_page_num;i++){
                if(i+1==_present_page){
                    content+="<li class='current'>"+(i+1)+"</li>"
                }else{
                    content+="<li>"+(i+1)+"</li>"
                }
            }
        }
        else if(this.total_page_num>5){
            if(_present_page<3){
                for(var i=0;i<5;i++){
                    if(i+1==_present_page){
                        content+="<li class='current'>"+(i+1)+"</li>"
                    }else{
                        content+="<li>"+(i+1)+"</li>"
                    }
                }
            }else{

                if(this.total_page_num-_present_page>=2){
                    content='<li>'+(this.present_page-2)+'</li>'+
                        '<li>'+(this.present_page-1)+'</li>'+
                        '<li class="current">'+this.present_page+'</li>'+
                        '<li>'+(this.present_page+1)+'</li>'+
                        '<li>'+(this.present_page+2)+'</li>'
                }
                else if(this.total_page_num-_present_page==1){
                    content='<li>'+(this.present_page-3)+'</li>'+
                        '<li>'+(this.present_page-2)+'</li>'+
                        '<li>'+(this.present_page-1)+'</li>'+
                        '<li class="current">'+(this.present_page)+'</li>'+

                        '<li>'+(this.present_page+1)+'</li>'
                }
                else if(this.total_page_num-_present_page==0){
                    content='<li>'+(this.present_page-4)+'</li>'+
                        '<li>'+(this.present_page-3)+'</li>'+
                        '<li>'+(this.present_page-2)+'</li>'+
                        '<li>'+(this.present_page-1)+'</li>'+
                        '<li class="current">'+(this.present_page)+'</li>'
                }
            }
        }

        var _this=this;
        _this.go_num.value=null;
        this.yema_box.innerHTML=content;
        var arr_li=this.yema_box.getElementsByTagName("li");
        for(var j=0;j<arr_li.length;j++){
            arr_li[j].onclick=function () {
                _this.present_page=parseInt(this.innerHTML);
                _this.updateYema(_this.present_page)
            }
        }
        this.callBack(_this.present_page)

    },
}

module.exports=Pagination;
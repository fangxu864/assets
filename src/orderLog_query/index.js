/**
 * Created by Administrator on 2016/11/14.
 */

//引入modules
var Filter=require("./filter");
var Table=require("./table");
var changePage = require("./pagination");






var Main={
    //初始化
    init:function () {
        var _this=this;
        _this.filter=new Filter;
                //1.点击搜索，获得ajax数据，发布label的数据填充事件
                //2.点击导出，访问ajax，返回XLS
        _this.table=new Table;
        _this.pagination = new changePage;
        //console.log(_this.pagination)


        //判断时候admin
        _this.cookieDate=[];
        _this.paramBox={};
        _this.talkArea();

        _this.allPage = 0

    },
    
    //参数扩展
    extendParams:function(paramBox,paramNew){
        paramBox = $.extend(paramBox,paramNew);
        return paramBox
    },
    
    //获取ajaxData，获取成功后自动处理表格
    getAjaxData_dealTable:function (Params,toPage) {
        if(!toPage){
             toPage = 1 ;
        };
        var _this = this;
         $.ajax({
         url: "/r/Order_OrderQuery/getOrderRecord",
         dataType: "json",
         async: true,
         data: Params,
         type: "POST",

         beforeSend:function () {
             //console.log(this.url);
             //加载中提示
            $("#table_box tbody ").remove();
            $("#table_box table ").append("<tr class='loading'><td></td><td></td><td></td><td></td><td>加载中，请稍后....</td><td></td><td></td><td></td></tr>");
         },
         success: function(ajaxData) {
             if(ajaxData.code !== 200){
                 if(ajaxData.code == 204){
                     $("#table_box tbody ").remove();
                     $("#table_box table ").append("<tr class='loading'><td></td><td></td><td></td><td></td><td>未能找到相关数据</td><td></td><td></td><td></td></tr>");
                     _this.pagination.render(0,0);
                     return false
                 }
                 alert(ajaxData.msg);
                 $("#table_box tbody ").remove();
                 $("#table_box table ").append("<tr class='loading'><td></td><td></td><td></td><td></td><td>加载失败</td><td></td><td></td><td></td></tr>");
                 _this.pagination.render(0,0);
                 return false
             }

             console.log(ajaxData);   

             _this.table.dealData(ajaxData);
             //console.log(ajaxData.msg);
             _this.pagination.render(toPage,ajaxData.data.total);
            //  _this.allPage = ajaxData.data[0].total;
           /* var cookie = {page:page,data:ajaxData};
            _this.cookieDate.push(cookie)*/
         }
         });
    },
    
   /* //判断cookie或者ajax
    getFromCookie_or_getFromAjax:function (page,Params) {
        var _this = this;
        var cookieData = _this.cookieDate;
        len = cookieData.length;

        //如果cookie中有调用cookie中的data
        for(var i = 0;i<len;i++){
            if(cookieData[i].page == page){
                alert("有");
                _this.table.dealData(cookieData[i].data);
                return false
            }
        };

        //如果cookie中没有调用ajax
        alert("无");
        _this.getAjaxData_dealTable(Params,page);

    },*/

    //模块交流区
    talkArea:function () {
        var _this=this;
        
        //接收filter发布的参数并通知table处理表格
        _this.filter.on("refreshParams",function(Params){
            _this.paramBox = Params;
            _this.getAjaxData_dealTable(_this.paramBox); //处理表格部分包在了getAjaxData中
        });
        
        
        //接收分页器被点击时发布的更改页数的事件
        _this.pagination.on("pageChange",function(toPage){
            var paramBox = _this.extendParams(_this.paramBox,{page:toPage});
            _this.getAjaxData_dealTable(paramBox,toPage)
        })
        
        
    }

};


$(function () {
    Main.init()
});
/**
 * Created by Administrator on 2016/7/27.
 */
require("./index.scss")
var tpl=require("./index.xtpl");



var Calendar=require("COMMON/modules/calendar_xu");
//切换菜单
var no_use_btn=document.getElementById("no_use_btn");
var searchWrap=document.getElementById("searchWrap");
var stateLi=document.getElementsByClassName("stateLi");
for(var i=0;i<stateLi.length;i++){
    stateLi[i].onclick=function(){
        no_use_btn.className="";
        searchWrap.innerHTML='<input type="text" class="formInp" name="" id="searchInp"/><a id="searchBtn" class="searchBtn" href="javascript:void(0)">搜 索</a><a id="daoBtn" style="background:#2A98DA" class="searchBtn" target="_blank" href="http://www.12301.cc/mcard_list.html?act=loadExcel">导 出</a>'+
            '<i id="searchDeleteBtn" class="iconfont delete">&#xe674;</i>'
    }
}
no_use_btn.onclick=function () {
    for(var i=0;i<stateLi.length;i++){
        stateLi[i].className="stateLi";
    }
    this.className="no_use_btn_active"
    searchWrap.innerHTML=tpl;

    //日期表单
    var oToday = new Date();
    //弹出式日历
    var oCal_6 = new Calendar({
        id: "#start_time",
        isPopup: !0,
        isPrevBtn: !0,
        isNextBtn: !0,
        isCloseBtn: !0,
        count: 1,
        monthStep: 1,
        isHoliday: 0,
        isHolidayTips: !0,
        isReadonly: !0,
        isDateInfo: !0,
        range: {mindate: oToday, maxdate: "2020-12-31"}
    });
    oCal_6.revise = {top:-1, left:0};
    oCal_6.on("dateClick", function(obj) {
        this.selectDate = obj["data-date"];
    });

    var oCal_7 = new Calendar({
        id: "#end_time",
        isPopup: !0,
        isPrevBtn: !0,
        isNextBtn: !0,
        isCloseBtn: !0,
        count: 1,
        monthStep: 1,
        isHoliday: 0,
        isHolidayTips: !0,
        isReadonly: !0,
        isDateInfo: !0,
        range: {mindate: oToday, maxdate: "2020-12-31"}
    });
    oCal_7.revise = {top:-1, left:0};
    oCal_7.on("dateClick", function(obj) {
        this.selectDate = obj["data-date"];
    });



   //找到查询按钮，监听事件
    var search=document.getElementById("no_use_search");

    search.onclick=function () {
        var start_time=document.getElementById("start_time").value
        var end_time=document.getElementById("end_time").value
        // alert(start_time+"-"+end_time)


        $.ajax({
            url: "call/jh_card.php",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "status": 4,
                "begin":start_time,
                "end":end_time
            },  //参数值
            type: "GET",   //请求方式
            beforeSend: function() {
                //请求前的处理
            },
            success: function(req) {
               
            },
            complete: function() {
                //请求完成的处理
            },
            error: function() {
                //请求出错处理
            }
        });


        // ajax("./ceshi.php"+"?"+"start_time="+start_time+"&"+"end_time="+end_time,function (data) {
        //     var json=JSON.parse(data);
        //     alert(json["a"])
        //     alert(data);
        // })
        //
        // function ajax(url,fnsucc,fnfail) {
        //     var ajax=new XMLHttpRequest();
        //     ajax.open("get",url,true);
        //     ajax.send();
        //     ajax.onreadystatechange=function () {
        //         if(ajax.readyState==4){
        //             if(ajax.status==200){
        //                 fnsucc(ajax.responseText);
        //             }
        //             else{
        //                 if(fnfail){
        //                     fnfail();
        //                 }
        //             }
        //         }
        //     }
        // }

    }


}
    
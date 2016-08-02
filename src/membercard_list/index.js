/**
 * Created by Administrator on 2016/7/27.
 */
require("./index.scss")

var Calendar=require("COMMON/modules/calendar");
// var Pagination=require("COMMON/modules/pagination")
//切换菜单
var no_use_btn=document.getElementById("no_use_btn");//取“未使用”按钮
var searchWrap=document.getElementById("searchWrap");
var stateLi=document.getElementsByClassName("stateLi");
var table_four=document.getElementById("table_four");
var no_use_table=document.getElementById("no_use_table");
var nouse_tbody=no_use_table.getElementsByTagName("tbody")[0]
var search_keyword_box=document.getElementById("search_keyword_box");
var search_time_box=document.getElementById("search_time_box");


/*日历部分*/
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    //RegExp.$1第一个 以括号为标志 的 子匹配字符串；
    if (/(y+)/i.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o){
        if (new RegExp("(" + k + ")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
var today=new Date().Format("yyyy-MM-dd")

var calendar = new Calendar();
$("#start_time").on("click",function(e){
    calendar.show(today,{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
        picker : $("#start_time"),              //页面上点击某个picker弹出日历(请使用input[type=text])
        top : 0,                       //日历box偏移量
        left : 0,                     //日历box偏移量
        // min : "2016-05-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
        // max : "2016-07-10",          //2016-07-10往后的日期都不可选 会自动挂上disable类名
        onBefore : function(){},     //弹出日历前callback
        onAfter : function(){}       //弹出日历后callback
    })
})
$("#end_time").on("click",function(e){
    calendar.show(today,{     //这里的第一个参数为弹出日历后，日历默认选中的日期，可传空string,此时日历会显示当前月份的日期
        picker : $("#end_time"),              //页面上点击某个picker弹出日历(请使用input[type=text])
        top : 0,                       //日历box偏移量
        left : 0,                     //日历box偏移量
        // min : "2016-05-20",          //2016-06-20往前的日期都不可选 会自动挂上disable类名
        // max : "2016-07-10",          //2016-07-10往后的日期都不可选 会自动挂上disable类名
        onBefore : function(){},     //弹出日历前callback
        onAfter : function(){}       //弹出日历后callback
    })
})


//给前四个按钮添加点击事件，1.切换搜索框内容 2.改变table_four和no_use_table的display

for(var i=0;i<stateLi.length;i++){
    stateLi[i].onclick=function(){
        no_use_btn.className="";
        search_keyword_box.style.display="block";
        search_time_box.style.display="none";
        table_four.style.display="table";
        no_use_table.style.display="none";
        /*改变导出按钮的href*/
        var data_state=this.getAttribute("data-state");
        var href="http://www.12301.cc/mcard_list.html?act=loadExcel&status="+data_state;

        $("#daoBtn").attr("href",href);

        // console.log( $("#daoBtn").attr("href"));


    }
}
no_use_btn.onclick=function () {



    table_four.style.display="none";
    no_use_table.style.display="table";
    search_keyword_box.style.display="none";
    search_time_box.style.display="block";

    for(var i=0;i<stateLi.length;i++){
        stateLi[i].className="stateLi";
    }
    this.className="no_use_btn_active"
    // searchWrap.innerHTML=tpl;






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
                "end":end_time,
                "pageSize":10,
                "currentPage":1,
                "action":"list"
            },  //参数值
            type: "GET",   //请求方式
            beforeSend: function() {
                //请求前的处理
            },
            success: function(req) {
                dealData(req);

            },
            complete: function() {
                //请求完成的处理
            },
            error: function() {
                //请求出错处理
            }
        });

        /*改变导出按钮的href*/

        var href="http://www.12301.cc/mcard_list.html?act=loadExcel&status=4&begin="+start_time+"&end="+end_time;

        $("#daoBtn1").attr("href",href);

        // console.log( $("#daoBtn1").attr("href"));


    }
    search.onclick();


}

//ajax数据处理函数
function dealData(req){
    // var totalpage=req.totalpage;
    // var page=req.page;
    // var pageSize=req.pageSize;
    // if(totalpage>1){
    //     var p=new Pagination({
    //         "id":"pagination_container",//分页器盒子的容器
    //         "data_total_num":pageSize*totalpage,//数据总数量
    //         "per_page_num":pageSize,//每页显示的数据条数
    //         "present_page":page,//当前页数
    //         "callBack":function (present_page) {
    //             alert(present_page);
    //         }
    //     })
    // }


    var con='';//定义存储内容的变量
    var arrSet=req.list;//定义返回的数组集；

    var state = {
        "0" : "正常",
        "1" : "挂失",
        "2" : "禁用",
        "3" : "冻结",
        "4" : "废弃"
    };

    
    for(var i=0;i<arrSet.length;i++){
        if(arrSet[i].status=="0"){
            con+='<tr'+' data_did="'+arrSet[i].did+'" '+' data_cid="'+arrSet[i].cid+'"'+'><td class="card_num"><a href="register_card.html?did='+arrSet[i].did+'" class="no_use_tb_tr_fir_td_a" data_name="'+arrSet[i].dname+'" data_mobile="'+arrSet[i].mobile+'">'+arrSet[i].dname+'('+arrSet[i].card_no+')</a>'+
                '</td><td>'+arrSet[i].ordertime+'</td><td class="">正常</td><td class="">'+
                '<a href="repayment.html?did='+arrSet[i].did+'">授信/预存</a>'+
                '<a style="margin:0 8px" class="" data_tostate="1" href="javascript:void(0)" onclick="dealGuaShi(this)">挂失</a>'+
                '<a class="no_use_jinyong" data_tostate="2" href="javascript:;" onclick="dealJinYong(this)">禁用</a></td></tr>'
        }
        else if(arrSet[i].status=="1"){
            con+='<tr'+' data_did="'+arrSet[i].did+'" '+' data_cid="'+arrSet[i].cid+'"'+'><td class="card_num"><a href="register_card.html?did='+arrSet[i].did+'" class="no_use_tb_tr_fir_td_a" data_name="'+arrSet[i].dname+'" data_mobile="'+arrSet[i].mobile+'">'+arrSet[i].dname+'('+arrSet[i].card_no+')</a>'+
                '</td><td>'+arrSet[i].ordertime+'</td><td class="">挂失</td><td class="">'+
                '<a href="repayment.html?did='+arrSet[i].did+'">授信/预存</a>'+
                '<a style="margin:0 8px" class="" href="register_card.html?did='+arrSet[i].did+'">补卡</a>'+
                '<a class="" data_tostate="0" href="javascript:void(0)" onclick="dealHuiFu(this)">恢复</a></td></tr>'
        }
        else if(arrSet[i].status=="2"){
            con+='<tr'+' data_did="'+arrSet[i].did+'" '+' data_cid="'+arrSet[i].cid+'"'+'><td class="card_num"><a href="register_card.html?did='+arrSet[i].did+'" class="no_use_tb_tr_fir_td_a" data_name="'+arrSet[i].dname+'" data_mobile="'+arrSet[i].mobile+'">'+arrSet[i].dname+'('+arrSet[i].card_no+')</a>'+
                '</td><td>'+arrSet[i].ordertime+'</td><td class="">禁用</td><td class="">'+
                '<a href="repayment.html?did='+arrSet[i].did+'">授信/预存</a>'+
                '<a class="no_use_qiyong" style="margin-left: 8px;" data_tostate="0" href="javascript:void(0)" onclick="dealQiYong(this)">启用</a></td></tr>'
        }else{
            con+=""
        }
    }

    nouse_tbody.innerHTML=con;

    //禁用操作
    // var aJinYong=$(".no_use_jinyong");
    // for(var i=0;i<aJinYong.length;i++){
    //     aJinYong[i].onclick=function () {
    //         var that=this;
    //
    //         var data_did=this.parentNode.parentNode.getAttribute("data_did")
    //         var data_cid=this.parentNode.parentNode.getAttribute("data_cid")
    //         var data_status=this.getAttribute("data_tostate");
    //
    //
    //         var isjinyong=confirm("确定要禁用此会员吗？")
    //         if(isjinyong){
    //             $.ajax({
    //                 url: "call/jh_card.php",    //请求的url地址
    //                 dataType: "json",   //返回格式为json
    //                 async: true, //请求是否异步，默认为异步，这也是ajax重要特性
    //                 data: {
    //                     action:"chstatus",
    //                     cid:data_cid,
    //                     did:data_did,
    //                     password:"",
    //                     status:data_status
    //                 },  //参数值
    //                 type: "post",   //请求方式
    //                 success: function(req) {
    //                     if(req.status=="success"){
    //                         PFT_GLOBAL.U.Alert("success",'<p style="width:150px">修改成功</p>');
    //                         that.parentNode.innerHTML='<a href="repayment.html?did='+data_did+'">授信/预存</a>'+
    //                             '<a class="no_use_qiyong" style="margin-left: 8px;" data_tostate="0" href="javascript:void(0)">启用</a></td></tr>'
    //                     }else{
    //                         var msg = req.msg || "修改失败，请稍后重试";
    //                         PFT_GLOBAL.U.Alert("fail",'<p style="width:150px">'+msg+'</p>');
    //                     }
    //                 }
    //             });
    //
    //         }
    //     }
    // }

}

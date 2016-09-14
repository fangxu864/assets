/**
 * Created by Administrator on 2016/8/26.
 */
require("./index.scss");
var tpl=require("./index.tpl");
var Calendar = require("COMMON/modules/calendar");
var Select = require("COMMON/modules/select");

var report ={
    init : function () {


        var that=this;
        that.Calendar = new Calendar();
        that.Calendar.on("selcet",function(data){});
        that.calendarShow("#calendarInputOne");
        that.calendarShow("#calendarInputtwo");
        $("#reportSearchBtn").on("click",function(){
            // $("#reportSearchBtnA").addClass("disable");
            that.featchData("1");
        });
        $('#calendarInputtwo').bind('input propertychange', function() {
            var password = $("#calendarInputtwo").val();
            alert(password)
            if(!passwordFilter(password)){
                return false;

            }

        });





    },
    calendarShow:function(id){
        var that =this;
        var getdate= new Date();
        var years =getdate.getFullYear();
        var months = getdate.getMonth()+1;
        var days = getdate.getDate()+1;
        var max =years+"-"+that.setdataType(months)+"-"+that.setdataType(days);
        var that = this;
        $(id).on("focus",function (e) {
            var picker = $(e.target);
            var date = picker.val();
            that.Calendar.show(date,{
                picker:$(e.target),
                top:0,
                left:0,
                min:"2016-06-20",
                max:max,
                onBefore:function(){

                },
                onAfter:function(){

                }
            });
        })
    },



    //下拉列表的功能实现
    selectContain:function(a,b){
        $(a).click(function(e){
            $(b).toggle();
        })

    },
    //
    proCommodity:function(){
        var that=this;
        that.selectContain("#produceIterm","#produceAll");
        that.selectContain("#proCommodity","#proCommodityItem");
        that.selectContain("#contianDistributorF","#containDistributorS");
        that.selectContain("#SearchMerchant","#MerchantContain")
        $("#containDistributorSelctF").on("click","li",function () {
            $("#contianDistributorF").attr("reseller_id",$(this).attr("reseller_id"));
            $("#contianDistributorF").html($(this).html());
        })


    },
    selectChange:function(target,contain){
        var target=target;

        $(".Commercial").click(function(){
            var choose=$(this).html();
            $("#produceIterm").html(choose);
            var count_way =$(this).attr("count_way");
            $("#produceIterm").attr("count_way",count_way);
            $("#produceAll").css("display","none")
        })
        //按票汇总，产品后增加票字段
        $(target).click(function(){
            if($(".addTicktItem").length<=0){
                if(target=="#produceAllTicket"){
                    $(".reportTable .tL").after($e);
                }

            }
            else{
                $(".addTicktItem").remove();
            }
            $("#produceTl").html(contain)

        })





    },
    seearchFunction:function(){
        var that=this;
        var input=$("#searchInput");
        var that= this;
        var key = "";

        $("#searchInput").keyup(function(event){
            var suggestKey = $("#suggestKey");
            var  current = suggestKey.find("li.hover1");
            //搜索框上下浏览选内容
            if(event.keyCode==38){
                if(current.length>0){
                    var prevLi = current.removeClass('hover1').prev();
                    if(prevLi.length>0)
                    {
                        prevLi.addClass('hover1');
                        input.val(prevLi.html());
                        $("#proCommodity").html("产品名称："+input.val());

                    }
                }
                else
                {
                    var last = suggestKey.find('li:last');
                    last.addClass('hover1');
                    input.val(last.html());
                    $("#proCommodity").html("产品名称："+input.val());

                }
            }
            else if(event.keyCode == 40){
                if(current.length>0){
                    var nextLi = current.removeClass('hover1').next();
                    if(nextLi.length>0)
                    {
                        nextLi.addClass('hover1');
                        input.val(nextLi.html());
                        $("#proCommodity").html("产品名称："+input.val());

                    }
                }
                else{
                    var first = suggestKey.find('li:first');
                    first.addClass('hover1');
                    input.val(first.html());
                    $("#proCommodity").html("产品名称："+input.val());

                }
            }
            else if (event.keyCode==13){
                $("#proCommodityItem").css("display","none")
            }
            //搜索框输入文字进行搜索
            else{
                var valText = $.trim(input.val());
                if(valText==""||valText==key){
                    return false;
                }
                else{

                }
            }


        })
        $("li").hover(function(){
            if($("li").hasClass("hover1")){
                $("li").removeClass("hover1");
            }

        })
        $("#suggestKey li").click(function(){

            $("#proCommodity").html("产品名称："+$(this).html());
            $("#proCommodity").attr("land_id",$(this).attr("land_id"))

            $("#proCommodityItem").css("display","none");


        })

    },
    seearchFunctionTwo:function(){
        var input=$("#searchInputSecondL");
        var key = "";

        $("#searchInputSecondL").keyup(function(event){
            var suggestKey = $("#ComsuggestKey");
            var  current = suggestKey.find("li.hover1");
            //搜索框上下浏览选内容
            if(event.keyCode==38){
                if(current.length>0){
                    var prevLi = current.removeClass('hover1').prev();
                    if(prevLi.length>0)
                    {
                        prevLi.addClass('hover1');
                        input.val(prevLi.html());
                        $("#SearchMerchant").html("商户："+input.val());

                    }
                }
                else
                {
                    var last = suggestKey.find('li:last');
                    last.addClass('hover1');
                    input.val(last.html());
                    $("#SearchMerchant").html("商户："+input.val());

                }
            }
            else if(event.keyCode == 40){
                if(current.length>0){
                    var nextLi = current.removeClass('hover1').next();
                    if(nextLi.length>0)
                    {
                        nextLi.addClass('hover1');
                        input.val(nextLi.html());
                        $("#SearchMerchant").html("商户："+input.val());

                    }
                }
                else{
                    var first = suggestKey.find('li:first');
                    first.addClass('hover1');
                    input.val(first.html());
                    $("#SearchMerchant").html("商户："+input.val());

                }
            }
            else if (event.keyCode==13){
                $("#MerchantContain").css("display","none")
            }
            //搜索框输入文字进行搜索
            else{
                var valText = $.trim(input.val());
                if(valText==""||valText==key){
                    return false;
                }
                else{

                }
            }


        })
        $("li").hover(function(){
            if($("li").hasClass("hover1")){
                $("li").removeClass("hover1");
            }

        })
        $("#ComsuggestKey li").click(function(){

            $("#SearchMerchant").html("商户："+$(this).html());
            $("#SearchMerchant").attr("merchant_id",$(this).attr("data-id"))

            $("#MerchantContain").css("display","none");


        })
        $("#searchInputSecondL").on("keyup",function(){
            var listTxt = '',li = '', bEqual=false;
            $.ajax({
                "url" : "/r/report_statistics/adminSearchMerchant/",
                "data" : {page:1, size:100, keyword:$("#searchInputSecondL").val()},
                "dataType":"json",
                "type": 'POST',
                "success":function(data){
                    // $("#suggest_ul_fid_merchant").show(0);
                    var contents="";
                    var li_id="";
                    list = data.data;

                    for(var i in list) {
                        var keywords = list[i].name;
                        var id = list[i].id;
                        contents=contents+"<li data-id='"+id+"'>"+keywords+"</li>";
                        li_id=id;
                    }
                    $("#ComsuggestKey").html(contents);
                }
            });
            $("#ComsuggestKey").on("click","li",function(e){
                var target = $(e.currentTarget);
                var merchant_id= target.attr("data-id");
                var html =target.html();
                $("#SearchMerchant").attr("merchant_id",merchant_id);
                $("#SearchMerchant").html("商户："+html);
                $("#searchInputSecondL").val(html);
                $("#MerchantContain").css("display","none");
            })
        })

    },
    //日历选项
    //针对日期格式而做的改变
    setdataType:function(date){
        if((date/10)<1){
            var $newdate=$("<div></div>");
            $newdate.html("0"+date);
            return $newdate.html();
        }
        else{
            return date;
        }
    },
    //获取时间
    getNowadate:function(){
        var that =this;
        var getdate= new Date();
        var years =getdate.getFullYear();
        var months = getdate.getMonth()+1;
        var days = getdate.getDate();
        $(document).one("ready",function(){
            var weekday=getdate.getDay();
            var Monday =days - weekday;
            var Sunday = 0;

            var LastMonths = getdate.getMonth();
            //在每个月的月初几天的情况
            if(Monday<=0){
                if(months==3||months==5||months==7||months==10||months==12){
                    var LMonday = 30+Monday;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOne").val(years+"-"+LastMonths+"-"+LMonday);
                    $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                }
                else if(months==3){
                    //判断闰年出现的情况
                    if(years/4==0||years/400==0){
                        Monday = 29+Monday;
                        var dayS=that.setdataType(days);
                        var monthS=that.setdataType(months);
                        $("#calendarInputOne").val(years+"-"+LastMonths+"-"+Monday);
                        $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                    }
                    else {
                        Monday = 28 + Monday;
                        var dayS=that.setdataType(days);
                        var monthS=that.setdataType(months);
                        $("#calendarInputOne").val(years + "-" + LastMonths + "-" + Monday);
                        $("#calendarInputtwo").val(years + "-" + monthS + "-" + dayS);
                    }


                }
                else if(months==1){
                    Monday = 31+Monday;
                    years =years-1;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOne").val(years+"-"+LastMonths+"-"+Monday);
                    $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                }
                else{
                    Monday = 31+Monday;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOne").val(years+"-"+LastMonths+"-"+Monday);
                    $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                }
            }
            else {
                Monday =days-weekday+1;
                Monday =that.setdataType(Monday);
                var dayS=that.setdataType(days);
                var monthS=that.setdataType(months);
                $("#calendarInputOne").val(years+"-"+monthS+"-"+Monday);
                $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);

            }
        })

        //三个月内按键
        $("#threeMonthCalendar").on("click",function(){


            if(months==1||months==2||months==3){
                var lastYear = years - 1;
                var Tmonths =months-3+12;
                Tmonths=that.setdataType(Tmonths);
                var dayS=that.setdataType(days);
                var monthS=that.setdataType(months);
                $("#calendarInputOne").val(lastYear+"-"+Tmonths+"-"+dayS);
                $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS)
            }
            else{
                var Tmonths =months-3;
                Tmonths=that.setdataType(Tmonths);
                var dayS=that.setdataType(days);
                var monthS=that.setdataType(months);
                $("#calendarInputOne").val(years+"-"+Tmonths+"-"+dayS);
                $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS)
            }
        });
        //当月内按键
        $("#thisMonthCalendar").on("click",function(){
            var dayS=that.setdataType(days);
            var monthS=that.setdataType(months);
            $("#calendarInputOne").val(years+"-"+monthS+"-"+"01");
            $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);

        });
        //本周内按键
        $("#thisWeekCalendar").on("click",function(){
            var weekday=getdate.getDay();
            var Monday =days - weekday;
            var Sunday = 0;

            var LastMonths = getdate.getMonth();
            //在每个月的月初几天的情况
            if(Monday<=0){
                if(months==3||months==5||months==7||months==10||months==12){
                    var LMonday = 30+Monday;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOne").val(years+"-"+LastMonths+"-"+LMonday);
                    $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                }
                else if(months==3){
                    //判断闰年出现的情况
                    if(years/4==0||years/400==0){
                        Monday = 29+Monday;
                        var dayS=that.setdataType(days);
                        var monthS=that.setdataType(months);
                        $("#calendarInputOne").val(years+"-"+LastMonths+"-"+Monday);
                        $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                    }
                    else {
                        Monday = 28 + Monday;
                        var dayS=that.setdataType(days);
                        var monthS=that.setdataType(months);
                        $("#calendarInputOne").val(years + "-" + LastMonths + "-" + Monday);
                        $("#calendarInputtwo").val(years + "-" + monthS + "-" + dayS);
                    }


                }
                else if(months==1){
                    Monday = 31+Monday;
                    years =years-1;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOne").val(years+"-"+LastMonths+"-"+Monday);
                    $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                }
                else{
                    Monday = 31+Monday;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOne").val(years+"-"+LastMonths+"-"+Monday);
                    $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                }
            }
            else {
                Monday =days-weekday+1;
                Monday =that.setdataType(Monday);
                var dayS=that.setdataType(days);
                var monthS=that.setdataType(months);
                $("#calendarInputOne").val(years+"-"+monthS+"-"+Monday);
                $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);

            }

        });
        //查询本日的按钮
        $("#todayCalendar").on("click",function(){
            var dayS=that.setdataType(days);
            var monthS=that.setdataType(months);
            $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
            $("#calendarInputOne").val(years+"-"+monthS+"-"+dayS);
        })


    },
    calendar:function() {
        var that = this;
        $(".selectDataFn").click(function () {
            $("#calendarContain").toggle();
            $(".calendarContainClass").click(function () {
                $(".selectDataFn").html($(this).html());
                $("#calendarContain").css("display", "none");
            })
        })



    },
    //在点击目标下拉框外的地方将其关闭
    closeSelector:function (ParentA,TargetA) {
        $(document).bind("click",function(e){
            if($(e.target).closest(ParentA).length==0){
                $(TargetA).css("display","none")
            }
        })


    },


    //导出数据
    educeData:function(){
        var that= this;
        $(".trecoreup").on("click",function(){
            var btime       = $("#calendarInputOne").val();
            var etime       = $("#calendarInputtwo").val();
            var count_way     = $("#produceIterm").attr("count_way");
            var land_id     = $("#proCommodity").attr("land_id");
            var reseller_id = $("#contianDistributorF").attr("reseller_id");
            var merchant_id = $("#SearchMerchant").attr("merchant_id");
            var exclude_test =$('.checkbox').attr("checked") == undefined ? 0 : 1;

            if(!btime || !etime) {
                return false;
            }

            var url  = '/r/report_statistics/adminCheckedList/';
            var data = {'begin_date' : btime, 'end_date' : etime, 'count_way':count_way, size:500, land_id : land_id, reseller_id : reseller_id, export_excel : 1};
            params = that.getQueryString(data);
            url = url + '?' + params;
            window.open(url);
            return false;
        })
    },
    getQueryString:function(arr) {
        var str = '';
        $.each(arr, function(key, val) {
            str += key + '=' + val + '&';
        });
        return str;
    },


//向后端传递请求数据
    featchData:function(page){
        var page = page;
        var btime       = $("#calendarInputOne").val();
        var etime       = $("#calendarInputtwo").val();
        var count_way     = $("#produceIterm").attr("count_way");
        var land_id     = $("#proCommodity").attr("land_id");
        var reseller_id = $("#contianDistributorF").attr("reseller_id");
        var exclude_test= $('.checkbox').attr("checked") == undefined ? 0 : 1;
        var merchant_id =$("#SearchMerchant").attr('merchant_id');
        var export_excel=0;
        if($("#calendarInputOne").val()==""){
            alert("请选择开始时间！");
            return false;
        }
        else{
            begin_date=$("#calendarInputOne").val()
        }
        if($("#calendarInputtwo").val()==""){
            alert("请选择结束时间！");
            return false;
        }
        else{
            end_date=$("#calendarInputtwo").val();
        }
        // if((merchant_id=="")||(land_id=="")||(reseller_id=="")) {
        //     alert("请确保选择必要的搜索条件！");
        //     return false;
        // }
        if($(".disable").length!=0) return false;
        $.ajax({
            dataType:"json",
            type:"post",
            data:{
                begin_date:btime,
                end_date:etime,
                count_way:count_way,
                land_id:land_id,
                reseller_id:reseller_id,
                exclude_test:exclude_test,
                page:page,
                merchant_id:merchant_id,
                export_excel:export_excel

            },
            url:"/r/report_statistics/adminCheckedList/",
            success:function(data){
                var data= data;
                //页数

                $(".queryToday_td").remove();
                var total =data.data.total;

                if(total<=20){
                    $(".buttonCation").css("display","none")
                }
                else{
                    $(".buttonCation").css("display","block")
                }
                var PageNum =Math.ceil(total/20);
                $("#PageTotal").html(PageNum);
                if(parseInt($("#PageRecent").html())>PageNum){
                    $("#PageRecent").html("1");
                }
                // $(".reportTable tr").remove();
                var list =data.data.list;
                //将获取到的后端列表数据展示出来
                var ContainHtml ='';
                $.each(list,function(key,val){
                    ContainHtml += '<tr class="tRR"><td>'+"&nbsp;"+val.title+'</td>';

                    ContainHtml += '<td >'+ val.order_num +'</td>';
                    ContainHtml += '<td>'+ val.ticket_num +'</td>';
                    ContainHtml += '<td  class="Ccolor">'+ val.sale_money +'</td>';
                    ContainHtml += '<td  class="CcolorT" onclick="loadDetail(\'' + data.detail_key + '\', '+ val.id +');">'+ val.profit_money +'</td>';


                    ContainHtml += '</tr>';
                });
                if((ContainHtml == '')&&($(".withoutData").length==0)) {
                    $(".reportTable .tRR").remove();
                    ContainHtml = '<td colspan="8" style="color:red;" class="withoutData">没有数据</td>';
                }
                else if(ContainHtml != ''){
                    $(".withoutData").remove();
                    $(".reportTable .tRR").remove();
                }
                $(".reportTable").append(ContainHtml);



            },
            error:function(msg){
                alert(msg);
            }
        })




    },
    //点击翻页键向后端请求数据
    PageJudgement:function(){
        var that =this;
        var PageRecent =parseInt($("#PageRecent").html());
        var PageTotal =parseInt($("#PageTotal").html());
        $("#pageButtonOne").on("click",function(){
            PageRecent =parseInt($("#PageRecent").html());
            PageTotal =parseInt($("#PageTotal").html());
            if((PageTotal>=2)&&(PageTotal>=PageRecent)&&(PageRecent>1)){
                PageRecent=PageRecent -1;
                $("#PageRecent").html(PageRecent);
                that.featchData(PageRecent)
            }
            else{
                return false;
            }
        })
        $("#testButton").on("click",function(){
            PageRecent =parseInt($("#PageRecent").html());
            PageTotal =parseInt($("#PageTotal").html());
            if(PageTotal>PageRecent){
                PageRecent=PageRecent+1;
                $("#PageRecent").html(PageRecent);
                that.featchData(PageRecent);
            }
            else{
                return false;
            }
        })

    },





    //请求数据部分,为动态搜索
    //
    // 搜索产品
    justForDate:function(){
        var data = data;
        var exclude_test= $('.checkbox').attr("checked") == undefined ? 0 : 1;
        $("#searchInput").on("keyup",function(){
            var listTxt = '',li = '', bEqual=false;
            $.ajax({
                "url" : "/r/report_statistics/searchLands /",
                "data" : {
                    page:1,
                    size:100,
                    keyword:$("#searchInput").val(),
                    exclude_test:exclude_test
                },
                "dataType":"json",
                "type": 'POST',
                "success":function(data){
                    // $("#suggest_ul_fid_merchant").show(0);
                    var contents="";
                    var li_id="";
                    list = data.data;

                    for(var i in list) {
                        var keywords = list[i].name;
                        var id = list[i].id;
                        contents=contents+"<li data-id='"+id+"'>"+keywords+"</li>";
                        li_id=id;
                    }
                    $("#suggestKey").html(contents);
                }
            });
            $("#suggestKey").on("click","li",function(e){
                var target = $(e.currentTarget);
                var land_id= target.attr("data-id");
                var html =target.html();
                $("#proCommodity").attr("land_id",land_id);
                $("#proCommodity").html("产品名称："+html);
                $("#searchInput").val(html);
                $("#proCommodityItem").css("display","none");
            })
        })
    },
    // 搜索分销商
    justdistributor:function(){
        var data = data;
        $("#searchInputSecond").on("keyup",function(){
            var listTxt = '',li = '', bEqual=false;
            $.ajax({
                "url" : "/r/report_statistics/getResellerList/",
                "data" : {page:1, size:100, keyword:$("#searchInputSecond").val()},
                "dataType":"json",
                "type": 'POST',
                "success":function(data){
                    // $("#suggest_ul_fid_merchant").show(0);
                    var contents="";
                    var li_id="";
                    list = data.data;

                    for(var i in list) {
                        var keywords = list[i].name;
                        var id = list[i].id;
                        contents=contents+"<li data-id='"+id+"'>"+keywords+"</li>";
                        li_id=id;
                    }
                    $("#containDistributorSelctF").html(contents);
                }
            });
            $("#containDistributorSelctF").on("click","li",function(e){
                var target = $(e.currentTarget);
                var reseller_id= target.attr("data-id");
                var html =target.html();
                $("#contianDistributorF").attr("reseller_id",reseller_id);
                $("#contianDistributorF").html(html);
                $("#searchInputSecond").val(html);
                $("#containDistributorS").css("display","none");
            })
        })
    },

    //点击产品下拉框获取产品列表（产品内容可能很多）
    getLandList:function(){
        var that= this;
        $("#proCommodity").click(function(){
            $("#proCommodity").html("");
            that.justForDate("","/r/report_statistics/adminOrderList/","#suggestKey");
        })
        //管理员搜索框查询产品


    },
    // 翻页按钮，单页没有超过15条记录不出现翻页按钮
    // PageButton:function() {
    //     var that =this;
    //     $("#reportSearchBtn").click(function () {
    //         if ($(".rankCon tr").length >= 15) {
    //             $(".buttonCation").css("display", "block");
    //         }
    //         else {
    //             $(".buttonCation").css("display", "none");
    //         }
    //     })
    // },
    beginJudge:function () {

        if($("#reportTable .tRR").length==0){
            $.ContainHtml = $("<td colspan='6' style='padding:193px 0; text-align:center; background:#fff'  class='queryToday_td'><span class='queryToday_btn_left'>请输入条件搜索 </span></td>");
            $("#reportTable").append($.ContainHtml);

        }
        else{
            $(".queryToday_td").remove();
        }

    },
    //日历的几个快捷键
    changeDate:function(type){
        var that =this;
        var getdate= new Date();
        var years =getdate.getFullYear();
        var months = getdate.getMonth()+1;
        var days = getdate.getDate();
        $("#report_thisweek").on("click",function(){
            $("#PageRecent").html("1");
            var weekday=getdate.getDay();
            var Monday =days - weekday;
            var Sunday = 0;

            var LastMonths = getdate.getMonth();
            //在每个月的月初几天的情况
            if(Monday<=0){
                if(months==3||months==5||months==7||months==10||months==12){
                    var LMonday = 30+Monday;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOne").val(years+"-"+LastMonths+"-"+LMonday);
                    $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                    that.featchData(1);
                }
                else if(months==3){
                    //判断闰年出现的情况
                    if(years/4==0||years/400==0){
                        Monday = 29+Monday;
                        var dayS=that.setdataType(days);
                        var monthS=that.setdataType(months);
                        $("#calendarInputOne").val(years+"-"+LastMonths+"-"+Monday);
                        $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                        that.featchData(1);
                    }
                    else {
                        Monday = 28 + Monday;
                        var dayS=that.setdataType(days);
                        var monthS=that.setdataType(months);
                        $("#calendarInputOne").val(years + "-" + LastMonths + "-" + Monday);
                        $("#calendarInputtwo").val(years + "-" + monthS + "-" + dayS);
                        that.featchData(1);
                    }


                }
                else if(months==1){
                    Monday = 31+Monday;
                    years =years-1;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOne").val(years+"-"+LastMonths+"-"+Monday);
                    $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                    that.featchData(1);
                }
                else{
                    Monday = 31+Monday;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOne").val(years+"-"+LastMonths+"-"+Monday);
                    $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                    that.featchData(1);
                }
            }
            else {
                Monday =days-weekday+1;
                Monday =that.setdataType(Monday);
                var dayS=that.setdataType(days);
                var monthS=that.setdataType(months);
                $("#calendarInputOne").val(years+"-"+monthS+"-"+Monday);
                $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                that.featchData(1);

            }


        })
        $("#report_lastweek").on("click",function(){
            $("#PageRecent").html("1");
            var weekday=getdate.getDay();
            var Monday =days - weekday+1-7;
            var Sunday = 0;

            var LastMonths = getdate.getMonth();
            //在每个月的月初几天的情况
            if(Monday<=0){
                if(months==3||months==5||months==7||months==10||months==12){
                    var LMonday = 30+Monday;
                    var ldays =days - weekday+1;
                    var dayS=that.setdataType(ldays);
                    var monthS=that.setdataType(months);
                    var lastMonthS =that.setdataType(LastMonths);
                    $("#calendarInputOne").val(years+"-"+lastMonthS+"-"+LMonday);
                    $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                    that.featchData(1);
                }
                else if(months==3){
                    //判断闰年出现的情况
                    if(years/4==0||years/400==0){
                        Monday = 29+Monday;
                        var ldays =days - weekday+1;
                        var dayS=that.setdataType(ldays);
                        var monthS=that.setdataType(months);
                        var lastMonthS =that.setdataType(LastMonths);
                        $("#calendarInputOne").val(years+"-"+lastMonthS+"-"+Monday);
                        $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                        that.featchData(1);
                    }
                    else {
                        Monday = 28 + Monday;
                        var ldays =days - weekday+1;
                        var dayS=that.setdataType(ldays);
                        var monthS=that.setdataType(months);
                        var lastMonthS =that.setdataType(LastMonths);
                        $("#calendarInputOne").val(years + "-" + lastMonthS + "-" + Monday);
                        $("#calendarInputtwo").val(years + "-" + monthS + "-" + dayS);
                        that.featchData(1);
                    }


                }
                else if(months==1){
                    Monday = 31+Monday;
                    years =years-1;
                    var ldays =days - weekday+1;
                    var dayS=that.setdataType(ldays);
                    var monthS=that.setdataType(months);
                    var lastMonthS =that.setdataType(LastMonths);
                    $("#calendarInputOne").val(years+"-"+lastMonthS+"-"+Monday);
                    $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                    that.featchData(1);
                }
                else{
                    Monday = 31+Monday;
                    var ldays =days - weekday+1;
                    var dayS=that.setdataType(ldays);
                    var monthS=that.setdataType(months);
                    var lastMonthS =that.setdataType(LastMonths);
                    $("#calendarInputOne").val(years+"-"+lastMonthS+"-"+Monday);
                    $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                    that.featchData(1);
                }
            }
            else {
                Monday =days-weekday+1-7;
                Monday =that.setdataType(Monday);
                var ldays =days - weekday;
                var dayS=that.setdataType(ldays);
                var monthS=that.setdataType(months);
                $("#calendarInputOne").val(years+"-"+monthS+"-"+Monday);
                $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                that.featchData(1);

            }



        })
        $("#report_thismonths").on("click",function(){
            $("#PageRecent").html("1");
            var ldays =parseInt(days);
            var dayS=that.setdataType(ldays);
            var monthS=that.setdataType(months);
            $("#calendarInputOne").val(years+"-"+monthS+"-"+"01");
            $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
            that.featchData(1);

        })
        $("#report_lastmonth").on("click",function(){
            $("#PageRecent").html("1");
            var lastmonth =parseInt(months)-1;
            if(parseInt(months)==1){
                lastmonth=12
                $("#calendarInputOne").val(years+"-"+lastmonth+"-"+"01");
                $("#calendarInputtwo").val(years+"-"+lastmonth+"-"+"31");
                that.featchData(1);
            }
            else if(lastmonth==3||lastmonth==5||lastmonth==7||lastmonth==8||lastmonth==10||lastmonth==12){
                var Lastmonth=that.setdataType(lastmonth);
                $("#calendarInputOne").val(years+"-"+Lastmonth+"-"+"01");
                $("#calendarInputtwo").val(years+"-"+Lastmonth+"-"+"30");
                that.featchData(1);
            }
            else if(lastmonth==2){
                if(years/4==0||years/400==0){
                    var Lastmonth=that.setdataType(lastmonth);
                    $("#calendarInputOne").val(years+"-"+Lastmonth+"-"+"01");
                    $("#calendarInputtwo").val(years+"-"+Lastmonth+"-"+"29");
                    that.featchData(1);
                }
                else {
                    var Lastmonth=that.setdataType(lastmonth);
                    $("#calendarInputOne").val(years+"-"+Lastmonth+"-"+"01");
                    $("#calendarInputtwo").val(years+"-"+Lastmonth+"-"+"28");
                    that.featchData(1);

                }
            }
            else{
                var Lastmonth=that.setdataType(lastmonth);
                $("#calendarInputOne").val(years+"-"+Lastmonth+"-"+"01");
                $("#calendarInputtwo").val(years+"-"+Lastmonth+"-"+"31");
                that.featchData(1);
            }


        })

    },
    //关闭搜索框
    closeSearch:function(){
        $(document).on("click",function(e){
            if(($(e.target).closest("#containDistributorS").length==0)&&($(e.target).closest("#contianDistributorF").length==0)){
                $("#containDistributorS").css("display","none");
            }
        })
        $(document).on("click",function(e){
            if(($(e.target).closest("#proCommodityItem").length==0)&&($(e.target).closest("#proCommodity").length==0)){
                $("#proCommodityItem").css("display","none");
            }
        })
        $(document).on("click",function(e){
            if(($(e.target).closest("#SearchMerchant").length==0)&&($(e.target).closest("#MerchantContain").length==0)){
                $("#MerchantContain").css("display","none");
            }
        })
    }

}


$(function(){
    $("#check_reportContain").html(tpl);
    report.init();
    report.proCommodity();
    report.selectChange("#produceAllTicket","产品");
    report.selectChange("#distributorAll","分销商");
    report.selectChange("#forOrder","预定渠道");
    report.selectChange("#forDate","日期");
    report.selectChange("#forProduce","产品");
    report.seearchFunction();
    report.calendar();
    report.closeSelector("#selectDataFn","#calendarContain");
    report.closeSelector("#produceIterm","#produceAll");
    report.educeData();
    report.getNowadate();
    report.PageJudgement();
    report.beginJudge();
    report.seearchFunctionTwo();
    report.justForDate();
    report.justdistributor();

    report.changeDate();

    report.closeSearch();



})














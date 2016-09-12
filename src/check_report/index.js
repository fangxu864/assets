/**
 * Created by Administrator on 2016/9/9.
 */
require("./index.scss");
var tpl=require("./index.tpl");
var Calendar = require("COMMON/modules/calendar");
$(function(){
    $("#check_reportContain").html(tpl);
    report_check.init();
    report_check.proCommodity();
    report_check.selectChange("#produceAllTicketG","产品");
    report_check.selectChange("#distributorAllG","分销商");
    report_check.selectChange("#forOrderG","预定渠道");
    report_check.selectChange("#forDateG","日期");
    report_check.selectChange("#forProduceG","产品");
    report_check.seearchFunction();
    report_check.calendar();
    report_check.closeSelector("#selectDataFnG","#calendarContainG");
    report_check.closeSelector("#produceItermG","#produceAllG");
    report_check.educeData();
    report_check.getNowadate();
    report_check.PageJudgement();
    report_check.beginJudge();
    report_check.seearchFunctionTwo();
    report_check.justForDate();
    report_check.justdistributor();

    report_check.changeDate();

    report_check.closeSearch();



})
var report_check ={
    init : function () {
        var that=this;
        that.Calendar = new Calendar();
        that.Calendar.on("selcet",function(data){});
        that.calendarShow("#calendarInputOneG");
        that.calendarShow("#calendarInputtwoG");
        $("#reportSearchBtnG").on("click",function(){
            that.featchData("1");
        });



    },
    calendarShow:function(id){
        var that =this;
        var getdate= new Date();
        var years =getdate.getFullYear();
        var months = getdate.getMonth()+1;
        var days = getdate.getDate();
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
        that.selectContain("#produceItermG","#produceAllG");
        that.selectContain("#proCommodityG","#proCommodityItemG");
        that.selectContain("#contianDistributorFG","#containDistributorSG");
        that.selectContain("#SearchMerchantG","#MerchantContainG")
        $("#containDistributorSelctFG").on("click","li",function () {
            $("#contianDistributorFG").attr("reseller_id",$(this).attr("reseller_id"));
            $("#contianDistributorFG").html($(this).html());
        })


    },
    selectChange:function(target,contain){
        var target=target;

        $(".Commercial").click(function(){
            var choose=$(this).html();
            $("#produceItermG").html(choose);
            var count_way =$(this).attr("count_way");
            $("#produceItermG").attr("count_way",count_way);
            $("#produceAllG").css("display","none")
        })
        //按票汇总，产品后增加票字段
        $(target).click(function(){
            if($(".addTicktItem").length<=0){
                if(target=="#produceAllTicketG"){
                    var $e=$("<th class='tR addTicktItem' >票</th>");
                    $(".reportTable .tL").after($e);
                }

            }
            else{
                $(".addTicktItem").remove();
            }
            $("#produceTlG").html(contain)

        })





    },
    seearchFunction:function(){
        var that=this;
        var input=$("#searchInputG");
        var that= this;
        var key = "";

        $("#searchInputG").keyup(function(event){
            var suggestKey = $("#suggestKeyG");
            var  current = suggestKey.find("li.hover1");
            //搜索框上下浏览选内容
            if(event.keyCode==38){
                if(current.length>0){
                    var prevLi = current.removeClass('hover1').prev();
                    if(prevLi.length>0)
                    {
                        prevLi.addClass('hover1');
                        input.val(prevLi.html());
                        $("#proCommodityG").html("产品名称："+input.val());

                    }
                }
                else
                {
                    var last = suggestKey.find('li:last');
                    last.addClass('hover1');
                    input.val(last.html());
                    $("#proCommodityG").html("产品名称："+input.val());

                }
            }
            else if(event.keyCode == 40){
                if(current.length>0){
                    var nextLi = current.removeClass('hover1').next();
                    if(nextLi.length>0)
                    {
                        nextLi.addClass('hover1');
                        input.val(nextLi.html());
                        $("#proCommodityG").html("产品名称："+input.val());

                    }
                }
                else{
                    var first = suggestKey.find('li:first');
                    first.addClass('hover1');
                    input.val(first.html());
                    $("#proCommodityG").html("产品名称："+input.val());

                }
            }
            else if (event.keyCode==13){
                $("#proCommodityItemG").css("display","none")
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
        $("#suggestKeyG li").click(function(){

            $("#proCommodityG").html("产品名称："+$(this).html());
            $("#proCommodityG").attr("land_id",$(this).attr("land_id"))

            $("#proCommodityItemG").css("display","none");


        })

    },
    seearchFunctionTwo:function(){
        var input=$("#searchInputSecondLG");
        var key = "";

        $("#searchInputSecondLG").keyup(function(event){
            var suggestKey = $("#ComsuggestKeyG");
            var  current = suggestKey.find("li.hover1");
            //搜索框上下浏览选内容
            if(event.keyCode==38){
                if(current.length>0){
                    var prevLi = current.removeClass('hover1').prev();
                    if(prevLi.length>0)
                    {
                        prevLi.addClass('hover1');
                        input.val(prevLi.html());
                        $("#SearchMerchantG").html("商户："+input.val());

                    }
                }
                else
                {
                    var last = suggestKey.find('li:last');
                    last.addClass('hover1');
                    input.val(last.html());
                    $("#SearchMerchantG").html("商户："+input.val());

                }
            }
            else if(event.keyCode == 40){
                if(current.length>0){
                    var nextLi = current.removeClass('hover1').next();
                    if(nextLi.length>0)
                    {
                        nextLi.addClass('hover1');
                        input.val(nextLi.html());
                        $("#SearchMerchantG").html("商户："+input.val());

                    }
                }
                else{
                    var first = suggestKey.find('li:first');
                    first.addClass('hover1');
                    input.val(first.html());
                    $("#SearchMerchantG").html("商户："+input.val());

                }
            }
            else if (event.keyCode==13){
                $("#MerchantContainG").css("display","none")
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
        $("#ComsuggestKeyG li").click(function(){

            $("#SearchMerchantG").html("商户："+$(this).html());
            $("#SearchMerchantG").attr("merchant_id",$(this).attr("data-id"))

            $("#MerchantContainG").css("display","none");


        })
        $("#searchInputSecondLG").on("keyup",function(){
            var listTxt = '',li = '', bEqual=false;
            $.ajax({
                "url" : "/r/report_statistics/adminSearchMerchant/",
                "data" : {page:1, size:100, keyword:$("#searchInputSecondLG").val()},
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
                    $("#ComsuggestKeyG").html(contents);
                }
            });
            $("#ComsuggestKeyG").on("click","li",function(e){
                var target = $(e.currentTarget);
                var merchant_id= target.attr("data-id");
                var html =target.html();
                $("#SearchMerchantG").attr("merchant_id",merchant_id);
                $("#SearchMerchantG").html("商户："+html);
                $("#searchInputSecondLG").val(html);
                $("#MerchantContainG").css("display","none");
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
                    $("#calendarInputOneG").val(years+"-"+LastMonths+"-"+LMonday);
                    $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                }
                else if(months==3){
                    //判断闰年出现的情况
                    if(years/4==0||years/400==0){
                        Monday = 29+Monday;
                        var dayS=that.setdataType(days);
                        var monthS=that.setdataType(months);
                        $("#calendarInputOneG").val(years+"-"+LastMonths+"-"+Monday);
                        $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                    }
                    else {
                        Monday = 28 + Monday;
                        var dayS=that.setdataType(days);
                        var monthS=that.setdataType(months);
                        $("#calendarInputOneG").val(years + "-" + LastMonths + "-" + Monday);
                        $("#calendarInputtwoG").val(years + "-" + monthS + "-" + dayS);
                    }


                }
                else if(months==1){
                    Monday = 31+Monday;
                    years =years-1;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOneG").val(years+"-"+LastMonths+"-"+Monday);
                    $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                }
                else{
                    Monday = 31+Monday;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOneG").val(years+"-"+LastMonths+"-"+Monday);
                    $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                }
            }
            else {
                Monday =days-weekday+1;
                Monday =that.setdataType(Monday);
                var dayS=that.setdataType(days);
                var monthS=that.setdataType(months);
                $("#calendarInputOneG").val(years+"-"+monthS+"-"+Monday);
                $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);

            }
        })

        //三个月内按键
        $("#threeMonthCalendarG").on("click",function(){


            if(months==1||months==2||months==3){
                var lastYear = years - 1;
                var Tmonths =months-3+12;
                Tmonths=that.setdataType(Tmonths);
                var dayS=that.setdataType(days);
                var monthS=that.setdataType(months);
                $("#calendarInputOneG").val(lastYear+"-"+Tmonths+"-"+dayS);
                $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS)
            }
            else{
                var Tmonths =months-3;
                Tmonths=that.setdataType(Tmonths);
                var dayS=that.setdataType(days);
                var monthS=that.setdataType(months);
                $("#calendarInputOneG").val(years+"-"+Tmonths+"-"+dayS);
                $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS)
            }
        });
        //当月内按键
        $("#thisMonthCalendarG").on("click",function(){
            var dayS=that.setdataType(days);
            var monthS=that.setdataType(months);
            $("#calendarInputOneG").val(years+"-"+monthS+"-"+"01");
            $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);

        });
        //本周内按键
        $("#thisWeekCalendarG").on("click",function(){
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
                    $("#calendarInputOneG").val(years+"-"+LastMonths+"-"+LMonday);
                    $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                }
                else if(months==3){
                    //判断闰年出现的情况
                    if(years/4==0||years/400==0){
                        Monday = 29+Monday;
                        var dayS=that.setdataType(days);
                        var monthS=that.setdataType(months);
                        $("#calendarInputOneG").val(years+"-"+LastMonths+"-"+Monday);
                        $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                    }
                    else {
                        Monday = 28 + Monday;
                        var dayS=that.setdataType(days);
                        var monthS=that.setdataType(months);
                        $("#calendarInputOneG").val(years + "-" + LastMonths + "-" + Monday);
                        $("#calendarInputtwoG").val(years + "-" + monthS + "-" + dayS);
                    }


                }
                else if(months==1){
                    Monday = 31+Monday;
                    years =years-1;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOneG").val(years+"-"+LastMonths+"-"+Monday);
                    $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                }
                else{
                    Monday = 31+Monday;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOneG").val(years+"-"+LastMonths+"-"+Monday);
                    $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                }
            }
            else {
                Monday =days-weekday+1;
                Monday =that.setdataType(Monday);
                var dayS=that.setdataType(days);
                var monthS=that.setdataType(months);
                $("#calendarInputOneG").val(years+"-"+monthS+"-"+Monday);
                $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);

            }

        });
        //查询本日的按钮
        $("#todayCalendarG").on("click",function(){
            var dayS=that.setdataType(days);
            var monthS=that.setdataType(months);
            $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
            $("#calendarInputOneG").val(years+"-"+monthS+"-"+dayS);
        })


    },
    calendar:function() {
        var that = this;
        $(".selectDataFn").click(function () {
            $("#calendarContainG").toggle();
            $(".calendarContainClass").click(function () {
                $(".selectDataFn").html($(this).html());
                $("#calendarContainG").css("display", "none");
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
            var btime       = $("#calendarInputOneG").val();
            var etime       = $("#calendarInputtwoG").val();
            var count_way     = $("#produceItermG").attr("count_way");
            var land_id     = $("#proCommodityG").attr("land_id");
            var reseller_id = $("#contianDistributorFG").attr("reseller_id");
            var merchant_id = $("#SearchMerchantG").attr("merchant_id");
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
        var btime       = $("#calendarInputOneG").val();
        var etime       = $("#calendarInputtwoG").val();
        var count_way     = $("#produceItermG").attr("count_way");
        var land_id     = $("#proCommodityG").attr("land_id");
        var reseller_id = $("#contianDistributorFG").attr("reseller_id");
        var exclude_test= $('.checkbox').attr("checked") == undefined ? 0 : 1;
        var merchant_id =$("#SearchMerchantG").attr('merchant_id');
        var export_excel=0;
        if($("#calendarInputOneG").val()==""){
            alert("请选择开始时间！");
            return false;
        }
        else{
            begin_date=$("#calendarInputOneG").val()
        }
        if($("#calendarInputtwoG").val()==""){
            alert("请选择结束时间！");
            return false;
        }
        else{
            end_date=$("#calendarInputtwoG").val();
        }
        if((merchant_id=="")||(land_id=="")||(reseller_id=="")) {
            alert("请确保选择必要的搜索条件！");
            return false;
        }

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

                if(total<=15){
                    $(".buttonCation").css("display","none")
                }
                else{
                    $(".buttonCation").css("display","block")
                }
                var PageNum =Math.ceil(total/15);
                $("#PageTotalG").html(PageNum);
                // $(".reportTable tr").remove();
                var list =data.data.list;
                //将获取到的后端列表数据展示出来
                var ContainHtml ='';
                $.each(list,function(key,val){
                    ContainHtml += '<tr class="tRR"><td>'+ (key+1) +'</td>';
                    ContainHtml += '<td >'+ val.title +'</td>';
                    ContainHtml += '<td >'+ val.order_num +'</td>';
                    ContainHtml += '<td>'+ val.ticket_num +'</td>';
                    ContainHtml += '<td >'+ val.sale_money +'</td>';

                    if(dtype != 2 && dtype != 3) {
                        ContainHtml += '<td class="tL">'+ val.cost_money +'</td>';
                        ContainHtml += '<td class="tL">'+ val.coupon_num +'</td>';
                        ContainHtml += '<td onclick="loadDetail(\'' + data.detail_key + '\', '+ val.id +');">'+ val.coupon_money +'</td>';
                    }

                    ContainHtml += '</tr>';
                });

                if((ContainHtml == '')&&($(".withoutData").length==0)) {
                    ContainHtml = '<td colspan="8" style="color:red;" class="tL withoutData">没有数据</td>';
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
        var PageRecent =parseInt($("#PageRecentG").html());
        var PageTotal =parseInt($("#PageTotalG").html());
        $("#pageButtonOneG").on("click",function(){
            PageRecent =parseInt($("#PageRecentG").html());
            PageTotal =parseInt($("#PageTotalG").html());
            if((PageTotal>=2)&&(PageTotal>=PageRecent)&&(PageRecent>1)){
                PageRecent=PageRecent -1;
                $("#PageRecentG").html(PageRecent);
                that.featchData(PageRecent)
            }
            else{
                return false;
            }
        })
        $("#testButtonG").on("click",function(){
            PageRecent =parseInt($("#PageRecentG").html());
            PageTotal =parseInt($("#PageTotalG").html());
            if(PageTotal>PageRecent){
                PageRecent=PageRecent+1;
                $("#PageRecentG").html(PageRecent);
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
        $("#searchInputG").on("keyup",function(){
            var listTxt = '',li = '', bEqual=false;
            $.ajax({
                "url" : "/r/report_statistics/adminSearchLands/",
                "data" : {
                    page:1,
                    size:100,
                    keyword:$("#searchInputG").val(),
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
                    $("#suggestKeyG").html(contents);
                }
            });
            $("#suggestKeyG").on("click","li",function(e){
                var target = $(e.currentTarget);
                var land_id= target.attr("data-id");
                var html =target.html();
                $("#proCommodityG").attr("land_id",land_id);
                $("#proCommodityG").html("产品名称："+html);
                $("#searchInputG").val(html);
                $("#proCommodityItemG").css("display","none");
            })
        })
    },
    // 搜索分销商
    justdistributor:function(){
        var data = data;
        $("#searchInputSecondG").on("keyup",function(){
            var listTxt = '',li = '', bEqual=false;
            $.ajax({
                "url" : "/r/report_statistics/adminSearchMerchant/",
                "data" : {page:1, size:100, keyword:$("#searchInputSecondG").val()},
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
                    $("#containDistributorSelctFG").html(contents);

                }

            });
            $("#containDistributorSelctFG").on("click","li",function(e){
                var target = $(e.currentTarget);
                var reseller_id= target.attr("data-id");
                var html =target.html();
                $("#contianDistributorFG").attr("reseller_id",reseller_id);
                $("#contianDistributorFG").html(html);
                $("#searchInputSecondG").val(html);
                $("#containDistributorSG").css("display","none");
            })
        })
    },

    //点击产品下拉框获取产品列表（产品内容可能很多）
    getLandList:function(){
        var that= this;
        $("#proCommodityG").click(function(){
            $("#proCommodityG").html("");
            that.justForDate("","/r/report_statistics/adminOrderList/","#suggestKeyG");
        })
        //管理员搜索框查询产品


    },

    beginJudge:function () {

        if($("#reportTableG .tRR").length==0){
            $.ContainHtml = $("<td colspan='6' style='padding:193px 0; text-align:center; background:#fff'  class='queryToday_td'><span class='queryToday_btn_left'>请输入条件搜索 </span></td>");
            $("#reportTableG").append($.ContainHtml);

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
                    $("#calendarInputOneG").val(years+"-"+LastMonths+"-"+LMonday);
                    $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                }
                else if(months==3){
                    //判断闰年出现的情况
                    if(years/4==0||years/400==0){
                        Monday = 29+Monday;
                        var dayS=that.setdataType(days);
                        var monthS=that.setdataType(months);
                        $("#calendarInputOneG").val(years+"-"+LastMonths+"-"+Monday);
                        $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
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
                    $("#calendarInputOneG").val(years+"-"+LastMonths+"-"+Monday);
                    $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                }
                else{
                    Monday = 31+Monday;
                    var dayS=that.setdataType(days);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOneG").val(years+"-"+LastMonths+"-"+Monday);
                    $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                }
            }
            else {
                Monday =days-weekday+1;
                Monday =that.setdataType(Monday);
                var dayS=that.setdataType(days);
                var monthS=that.setdataType(months);
                $("#calendarInputOneG").val(years+"-"+monthS+"-"+Monday);
                $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);

            }


        })
        $("#report_lastweek").on("click",function(){
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
                    $("#calendarInputOneG").val(years+"-"+lastMonthS+"-"+LMonday);
                    $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                }
                else if(months==3){
                    //判断闰年出现的情况
                    if(years/4==0||years/400==0){
                        Monday = 29+Monday;
                        var ldays =days - weekday+1;
                        var dayS=that.setdataType(ldays);
                        var monthS=that.setdataType(months);
                        var lastMonthS =that.setdataType(LastMonths);
                        $("#calendarInputOneG").val(years+"-"+lastMonthS+"-"+Monday);
                        $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                    }
                    else {
                        Monday = 28 + Monday;
                        var ldays =days - weekday+1;
                        var dayS=that.setdataType(ldays);
                        var monthS=that.setdataType(months);
                        var lastMonthS =that.setdataType(LastMonths);
                        $("#calendarInputOneG").val(years + "-" + lastMonthS + "-" + Monday);
                        $("#calendarInputtwoG").val(years + "-" + monthS + "-" + dayS);
                    }


                }
                else if(months==1){
                    Monday = 31+Monday;
                    years =years-1;
                    var ldays =days - weekday+1;
                    var dayS=that.setdataType(ldays);
                    var monthS=that.setdataType(months);
                    var lastMonthS =that.setdataType(LastMonths);
                    $("#calendarInputOneG").val(years+"-"+lastMonthS+"-"+Monday);
                    $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                }
                else{
                    Monday = 31+Monday;
                    var ldays =days - weekday+1;
                    var dayS=that.setdataType(ldays);
                    var monthS=that.setdataType(months);
                    var lastMonthS =that.setdataType(LastMonths);
                    $("#calendarInputOneG").val(years+"-"+lastMonthS+"-"+Monday);
                    $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);
                }
            }
            else {
                Monday =days-weekday+1;
                Monday =that.setdataType(Monday);
                var ldays =days - weekday+1;
                var dayS=that.setdataType(ldays);
                var monthS=that.setdataType(months);
                $("#calendarInputOneG").val(years+"-"+monthS+"-"+Monday);
                $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);

            }



        })
        $("#report_thismonths").on("click",function(){
            var ldays =parseInt(days);
            var dayS=that.setdataType(ldays);
            var monthS=that.setdataType(months);
            $("#calendarInputOneG").val(years+"-"+monthS+"-"+"01");
            $("#calendarInputtwoG").val(years+"-"+monthS+"-"+dayS);

        })
        $("#report_lastmonth").on("click",function(){
            var lastmonth =parseInt(months)-1;
            if(parseInt(months)==1){
                lastmonth=12
                $("#calendarInputOneG").val(years+"-"+lastmonth+"-"+"01");
                $("#calendarInputtwoG").val(years+"-"+lastmonth+"-"+"31");
            }
            else if(lastmonth==3||lastmonth==5||lastmonth==7||lastmonth==8||lastmonth==10||lastmonth==12){
                var Lastmonth=that.setdataType(lastmonth);
                $("#calendarInputOneG").val(years+"-"+Lastmonth+"-"+"01");
                $("#calendarInputtwoG").val(years+"-"+Lastmonth+"-"+"30");
            }
            else if(lastmonth==2){
                if(years/4==0||years/400==0){
                    var Lastmonth=that.setdataType(lastmonth);
                    $("#calendarInputOneG").val(years+"-"+Lastmonth+"-"+"01");
                    $("#calendarInputtwoG").val(years+"-"+Lastmonth+"-"+"29");
                }
                else {
                    var Lastmonth=that.setdataType(lastmonth);
                    $("#calendarInputOneG").val(years+"-"+Lastmonth+"-"+"01");
                    $("#calendarInputtwoG").val(years+"-"+Lastmonth+"-"+"28");

                }
            }
            else{
                var Lastmonth=that.setdataType(lastmonth);
                $("#calendarInputOneG").val(years+"-"+Lastmonth+"-"+"01");
                $("#calendarInputtwoG").val(years+"-"+Lastmonth+"-"+"31");
            }


        })

    },
    //关闭搜索框
    closeSearch:function(){
        $(document).on("click",function(e){
            if(($(e.target).closest("#containDistributorSG").length==0)&&($(e.target).closest("#contianDistributorFG").length==0)){
                $("#containDistributorSG").css("display","none");
            }
        })
        $(document).on("click",function(e){
            if(($(e.target).closest("#proCommodityItemG").length==0)&&($(e.target).closest("#proCommodityG").length==0)){
                $("#proCommodityItemG").css("display","none");
            }
        })
        $(document).on("click",function(e){
            if(($(e.target).closest("#SearchMerchantG").length==0)&&($(e.target).closest("#MerchantContainG").length==0)){
                $("#MerchantContainG").css("display","none");
            }
        })
    }

}

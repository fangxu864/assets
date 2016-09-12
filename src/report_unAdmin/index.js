/**
 * Created by Administrator on 2016/9/8.
 */

require("./index.scss");
var tpl=require("./index.tpl");
var Calendar = require("COMMON/modules/calendar");
var Select = require("COMMON/modules/select");

$(function(){
    $(".ContainOne").html(tpl);
    report.init();
    report.proCommodity();
    report.selectChange("#produceAllTicket","产品");
    report.selectChange("#distributorAll","分销商");
    report.selectChange("#forOrder","预定渠道");
    report.selectChange("#forDate","日期");
    report.selectChange("#forProduce","产品");

    report.calendar();
    report.closeSelector("#selectDataFn","#calendarContainA");
    report.closeSelector("#produceIterm","#produceAllA");
    report.educeData();
    report.getNowadate();
    report.PageJudgement();
    report.beginJudge();

    report.changeDate();
    // report.PageButton();
    report.getLandList();



})
var report ={
    init : function () {
        var that=this;
        that.Calendar = new Calendar();
        that.Calendar.on("selcet",function(data){});
        that.calendarShow("#calendarInputOne");
        that.calendarShow("#calendarInputtwo");
        $("#reportSearchBtnA").on("click",function(){
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
        that.selectContain("#produceIterm","#produceAllA");
        that.selectContain("#proCommodity","#proCommodityItemA");
        that.selectContain("#contianDistributorF","#containDistributorSA");
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
            $("#produceAllA").css("display","none")
        })
        //按票汇总，产品后增加票字段
        $(target).click(function(){
            $("#produceTl").html(contain)
            // if($(".addTicktItem").length<=0){
            //     if(target=="#produceAllTicket"){
            //         var $e=$("<th class='tR addTicktItem' >票</th>");
            //         $(".reportTable .tL").after($e);
            //     }
            //
            // }
            // else{
            //     $(".addTicktItem").remove();
            // }
            // $("#produceTl").html(contain)

        })





    },


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
            $("#calendarContainA").toggle();
            $(".calendarContainClass").click(function () {
                $(".selectDataFn").html($(this).html());
                $("#calendarContainA").css("display", "none");
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

    educeData:function(){
        var that= this;
        $(".trecoreup").on("click",function(){
            var btime       = $("#calendarInputOne").val();
            var etime       = $("#calendarInputtwo").val();
            var count_way     = $("#produceIterm").attr("count_way");
            var land_id     = $("#proCommodityItemA").val();
            var reseller_id = $("#containDistributorSA").val();
            var merchant_id = $("SearchMerchant").attr("merchant_id");

            if(!btime || !etime) {
                return false;
            }

            var url  = '/r/report_statistics/orderList/';
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
        var land_id     = $("#proCommodityItemA").val();
        var reseller_id = $("#containDistributorSA").val();
        var exclude_test= $('.checkbox').attr("checked") == undefined ? 0 : 1;
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
                export_excel:export_excel

            },
            url:"/r/report_statistics/orderList/",
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
                $("#PageTotal").html(PageNum);
                // $(".reportTable tr").remove();
                var list =data.data.list;
                //将获取到的后端列表数据展示出来
                var ContainHtml =''
                $.each(list,function(key,val){
                    ContainHtml += '<tr class="tRR"><td>'+val.title +'</td>';
                    // ContainHtml += '<td>'+ val.title +'</td>';
                    ContainHtml += '<td>'+ val.order_num +'</td>';
                    ContainHtml += '<td>'+ val.ticket_num +'</td>';
                    ContainHtml += '<td>'+ val.sale_money +'</td>';

                    if(dtype != 2 && dtype != 3) {
                        ContainHtml += '<td>'+ val.cost_money +'</td>';
                        ContainHtml += '<td>'+ val.coupon_num +'</td>';
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
        var PageRecent =parseInt($("#PageRecent").html());
        var PageTotal =parseInt($("#PageTotal").html());
        $("#pageButtonOneA").on("click",function(){
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
        $("#testButtonA").on("click",function(){
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



    //点击产品下拉框获取产品列表（产品内容可能很多）
    getLandList:function(){
        var that= this;
        $("#proCommodityItemA").click(function(){
            var url  = '/r/report_statistics/getResellerList/';
            $.post(url, {}, function(res) {
                var code  = res.code;
                var data  = res.data;

                if(code != 200) {
                    alert(res.msg);
                    return false;
                }

                var tmpHtml = '';
                $.each(data, function(key, val) {
                    tmpHtml += '<option value="'+ val.id +'">'+ val.name +'</option>';
                });

                $('#proCommodityItemA').append(tmpHtml);

            }, 'json');

            // that.justForDate("","/r/report_statistics/orderList/","#suggestKey");
        });
        $("#containDistributorSA").click(function(){
             var url  = '/r/report_statistics/getResellerList/';
            $.post(url, {}, function(res) {
                var code  = res.code;
                var data  = res.data;

                if(code != 200) {
                    alert(res.msg);
                    return false;
                }

                var tmpHtml = '';
                $.each(data, function(key, val) {
                    tmpHtml += '<option value="'+ val.id +'">'+ val.name +'</option>';
                });

                $('#containDistributorSA').append(tmpHtml);

            }, 'json');
        })

        //管理员搜索框查询产品


    },
    //翻页按钮，单页没有超过15条记录不出现翻页按钮
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
          //日历的几个快捷键（不知道为什么还需要设置）
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
                        $("#calendarInputOne").val(years+"-"+lastMonthS+"-"+LMonday);
                        $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
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
                        }
                        else {
                            Monday = 28 + Monday;
                            var ldays =days - weekday+1;
                            var dayS=that.setdataType(ldays);
                            var monthS=that.setdataType(months);
                            var lastMonthS =that.setdataType(LastMonths);
                            $("#calendarInputOne").val(years + "-" + lastMonthS + "-" + Monday);
                            $("#calendarInputtwo").val(years + "-" + monthS + "-" + dayS);
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
                    }
                    else{
                        Monday = 31+Monday;
                        var ldays =days - weekday+1;
                        var dayS=that.setdataType(ldays);
                        var monthS=that.setdataType(months);
                        var lastMonthS =that.setdataType(LastMonths);
                        $("#calendarInputOne").val(years+"-"+lastMonthS+"-"+Monday);
                        $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);
                    }
                }
                else {
                    Monday =days-weekday+1;
                    Monday =that.setdataType(Monday);
                    var ldays =days - weekday+1;
                    var dayS=that.setdataType(ldays);
                    var monthS=that.setdataType(months);
                    $("#calendarInputOne").val(years+"-"+monthS+"-"+Monday);
                    $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);

                }



            })
            $("#report_thismonths").on("click",function(){
                var ldays =parseInt(days);
                var dayS=that.setdataType(ldays);
                var monthS=that.setdataType(months);
                $("#calendarInputOne").val(years+"-"+monthS+"-"+"01");
                $("#calendarInputtwo").val(years+"-"+monthS+"-"+dayS);

            })
            $("#report_lastmonth").on("click",function(){
                var lastmonth =parseInt(months)-1;
                if(parseInt(months)==1){
                    lastmonth=12
                    $("#calendarInputOne").val(years+"-"+lastmonth+"-"+"01");
                    $("#calendarInputtwo").val(years+"-"+lastmonth+"-"+"31");
                }
                else if(lastmonth==3||lastmonth==5||lastmonth==7||lastmonth==8||lastmonth==10||lastmonth==12){
                    var Lastmonth=that.setdataType(lastmonth);
                    $("#calendarInputOne").val(years+"-"+Lastmonth+"-"+"01");
                    $("#calendarInputtwo").val(years+"-"+Lastmonth+"-"+"30");
                }
                else if(lastmonth==2){
                    if(years/4==0||years/400==0){
                        var Lastmonth=that.setdataType(lastmonth);
                        $("#calendarInputOne").val(years+"-"+Lastmonth+"-"+"01");
                        $("#calendarInputtwo").val(years+"-"+Lastmonth+"-"+"29");
                    }
                    else {
                        var Lastmonth=that.setdataType(lastmonth);
                        $("#calendarInputOne").val(years+"-"+Lastmonth+"-"+"01");
                        $("#calendarInputtwo").val(years+"-"+Lastmonth+"-"+"28");

                    }
                }
                else{
                    var Lastmonth=that.setdataType(lastmonth);
                    $("#calendarInputOne").val(years+"-"+Lastmonth+"-"+"01");
                    $("#calendarInputtwo").val(years+"-"+Lastmonth+"-"+"31");
                }


            })




        }













}
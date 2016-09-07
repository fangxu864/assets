/**
 * Created by Administrator on 2016/8/26.
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
    report.seearchFunction();
    report.calendar();
    report.closeSelector("#selectDataFn","#calendarContain");
    report.closeSelector("#produceIterm","#produceAll");
    // report.closeSelector("#proCommodity","#proCommodityItem");
    // report.closeSelector("#SearchMerchant","#MerchantContain");
    // report.justForsearch();
    // report.featchData("1");
    report.educeData();
    // report.PageButton();
    report.getNowadate();
    report.PageJudgement();
    report.beginJudge();
    report.seearchFunctionTwo();
    report.justForDate();
    report.justdistributor();



})
var report ={
    init : function () {
        var that=this;
        that.Calendar = new Calendar();
        that.Calendar.on("selcet",function(data){});
        that.calendarShow("#calendarInputOne");
        that.calendarShow("#calendarInputtwo");
        $("#reportSearchBtn").on("click",function(){
          that.featchData("1");
        });



    },
    calendarShow:function(id){
        // var years =getdate.getFullYear();
        // var months = getdate.getMonth()+1;
        // var days = getdate.getDate();
        // var max = years+months+days;
        var that = this;
        $(id).on("focus",function (e) {
            var picker = $(e.target);
            var date = picker.val();
            that.Calendar.show(date,{
                picker:$(e.target),
                top:0,
                left:0,
                min:"2016-06-20",
                max:"2016-09-30",
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
                    var $e=$("<th class='tR addTicktItem' >票</th>");
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
    //获取时间
    getNowadate:function(){
      var getdate= new Date();
        var years =getdate.getFullYear();
        var months = getdate.getMonth()+1;
        var days = getdate.getDate();

        //三个月内按键
         $("#threeMonthCalendar").on("click",function(){

             if((months/10)<1){
                 var  newdate ="";
                 newdate.html("0"+months);
                 alert(newdate.html());
             }

             if(months==1||months==2||months==3){
                 var lastYear = years - 1;
                 var Tmonths =months-3+12;
                 $("#calendarInputOne").val(lastYear+"-"+Tmonths+"-"+days);
                 $("#calendarInputtwo").val(years+"-"+months+"-"+days)
             }
            else{
                var Tmonths =months-3;
                $("#calendarInputOne").val(years+"-"+Tmonths+"-"+days);
                 $("#calendarInputtwo").val(years+"-"+months+"-"+days)
             }
         });
        //当月内按键
            $("#thisMonthCalendar").on("click",function(){
                $("#calendarInputOne").val(years+"-"+months+"-"+"01");
                $("#calendarInputtwo").val(years+"-"+months+"-"+days);

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
                   $("#calendarInputOne").val(years+"-"+LastMonths+"-"+LMonday);
                   $("#calendarInputtwo").val(years+"-"+months+"-"+days);
               }
               else if(months==3){
                   //判断闰年出现的情况
                    if(years/4==0||years/400==0){
                        Monday = 29+Monday;
                        $("#calendarInputOne").val(years+"-"+LastMonths+"-"+Monday);
                        $("#calendarInputtwo").val(years+"-"+months+"-"+days);
                    }
                    else {
                        Monday = 28 + Monday;
                        $("#calendarInputOne").val(years + "-" + LastMonths + "-" + Monday);
                        $("#calendarInputtwo").val(years + "-" + months + "-" + days);
                    }


               }
               else if(months==1){
                   Monday = 31+Monday;
                   years =years-1;
                   $("#calendarInputOne").val(years+"-"+LastMonths+"-"+Monday);
                   $("#calendarInputtwo").val(years+"-"+months+"-"+days);
               }
               else{
                   Monday = 31+Monday;
                   $("#calendarInputOne").val(years+"-"+LastMonths+"-"+Monday);
                   $("#calendarInputtwo").val(years+"-"+months+"-"+days);
               }
            }
            else {
                Monday =days-weekday+1;
                $("#calendarInputOne").val(years+"-"+months+"-"+Monday);
                $("#calendarInputtwo").val(years+"-"+months+"-"+days);

            }

        });
        //查询本日的按钮
        $("#todayCalendar").on("click",function(){
            $("#calendarInputtwo").val(years+"-"+months+"-"+days);
            $("#calendarInputOne").val(years+"-"+months+"-"+days);
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
    // //查询产品搜索框查询
    // justForsearch:function(){
    //     var that = this;
    //
    //     $("#searchInput").bind("keyup",function(){
    //         var data = $(this).val();
    //         that.justForDate(data,"/r/report_statistics/adminOrderList/","#suggestKey");
    //     })
    //     $("#searchInputSecond").bind("keyup",function(){
    //         var data2 =$(this).val();
    //         that.justForDate(data,"/r/report_statistics/adminOrderList/","#ComsuggestKey");
    //     })
    //     //获取分销商账号
    //
    //     $(".selectDistributor").change(function(){
    //         var ResellerJudge = $("#ResellerOPt").attr("selected")=="undefine"?1:0;
    //          if(ResellerJudge==0){
    //           // that.justForDate("","url","containDistributorSelctF");
    //         }
    //     })
        //汇总方式调换,更改列表内容？
        // $("#produceAll").click(function(){
        //     alert($("#produceIterm").attr("count_way"))
        // })

    // },

    //导出数据
    educeData:function(){
        var that= this;
      $(".trecoreup").on("click",function(){
          var btime       = $("#calendarInputOne").val();
          var etime       = $("#calendarInputtwo").val();
          var count_way     = $("#produceIterm").attr("count_way");
          var land_id     = $("#proCommodity").attr("land_id");
          var reseller_id = $("#contianDistributorF").attr("reseller_id");
          var merchant_id = $("SearchMerchant").attr("merchant_id");

          if(!btime || !etime) {
              return false;
          }

          var url  = '/r/report_statistics/adminOrderList/';
          var data = {'begin_date' : btime, 'end_date' : etime, 'count_way':count_way, size:500, land_id : land_id, reseller_id : reseller_id, export_excel : 1};



          if(isSuper) {
              url = '/r/report_statistics/adminOrderList/';
              data['merchant_id'] = $('#merchant_id').val();
              data['land_id']     = $('#land_id').val();
              data['reseller_id'] = $('#reseller_id').val();

              data['exclude_test'] = $('.checkbox').attr("checked") == undefined ? 0 : 1;
          }

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
            url:"/r/report_statistics/adminOrderList/",
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
                    ContainHtml += '<tr class="tRR"><td>'+ (key+1) +'</td>';
                    ContainHtml += '<td>'+ val.title +'</td>';
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

                if(ContainHtml == '') {
                    ContainHtml = '<td colspan="8" style="color:red;">没有数据</td>';
                }
                $(".reportTable .tRR").remove();
                var  containHead =$(".reportTable .headShow").html();
               $(".reportTable").html(containHead+ContainHtml);




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
        $("#searchInput").on("keyup",function(){
            var listTxt = '',li = '', bEqual=false;
            $.ajax({
                "url" : "/r/report_statistics/adminSearchLands/",
                "data" : {page:1, size:100, keyword:$("#searchInput").val()},
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
                "url" : "/r/report_statistics/adminSearchMerchant/",
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
    diffluence:function(method,delay,duration){
        var begin = new Date();
        var timer = null;
        return function(){
            var current = new Date(), args = Array.prototype.slice.call(arguments), context = this;
            clearTimeout(timer);
            if(current - begin >= duration){
                method.apply(context,args);
                begin = current;
            }else{
                timer = setTimeout(function(){
                    method.apply(context,args);
                },delay);
            }
        }
    },
    beginJudge:function () {

        if($("#reportTable .tRR").length==0){
            $.ContainHtml = $("<td colspan='6' style='padding:193px 0; text-align:center; background:#fff'  class='queryToday_td'><span class='queryToday_btn_left'>请输入条件搜索 </span></td>");
            $("#reportTable").append($.ContainHtml);

        }
        else{
            $(".queryToday_td").remove();
        }

    }











}
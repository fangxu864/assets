/**
 * Created by Administrator on 2016/8/26.
 */
require("./index.scss");
var tpl=require("./index.tpl");
var Calendar = require("COMMON/modules/calendar");
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
    report.closeSelector("#contianDistributorF","#containDistributorS");
    report.justForsearch();
    report.featchData();
    report.educeData();
})
var report ={
    init : function () {
        var that=this;
        that.Calendar = new Calendar();
        that.Calendar.on("selcet",function(data){});
        that.calendarShow("#calendarInputOne");
        that.calendarShow("#calendarInputtwo");
        $("#reportSearchBtn").on("click",function(){
          that.featchData();
        });



    },
    calendarShow:function(id){
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
                    that.featchData(valText);
                    key=valText;
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
    //日历选项
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
    //查询产品搜索框查询
    justForsearch:function(){
        var that = this;

        $("#searchInput").bind("keyup",function(){
            var data = $(this).val();
            that.justForDate(data,"url","#suggestKey");
        })
        $("#searchInputSecond").bind("keyup",function(){
            var data2 =$(this).val();
            that.justForDate(data,"url","#ComsuggestKey");
        })
        //获取分销商账号


        $("#ResellerOPt").on("select",function(e){
            e.preventDefault();
            alert("123");
            var ResellerJudge = $("#ResellerOPt").attr("selected")=="undefine"?1:0;

            if(ResellerJudge==1){
                alert("fdsfadjsak")
                that.justForDate("","url","containDistributorSelctF");
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

          if(!btime || !etime) {
              return false;
          }

          var url  = '####';
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
    featchData:function(){
        var btime       = $("#calendarInputOne").val();
        var etime       = $("#calendarInputtwo").val();
        var count_way     = $("#produceIterm").attr("count_way");
        var land_id     = $("#proCommodity").attr("land_id");
        var reseller_id = $("#contianDistributorF").attr("reseller_id");
        var exclude_test= $('.checkbox').attr("checked") == undefined ? 0 : 1;
        // if($("#calendarInputOne").val()==""){
        //     alert("请选择开始时间！");
        //      return false;
        // }
        // else{
        //     begin_date=$("#calendarInputOne").val()
        // }
        // if($("#calendarInputtwo").val()==""){
        //     alert("请选择结束时间！");
        //      return false;
        // }
        // else{
        //     end_date=$("#calendarInputtwo").val();
        // }



    },




    //请求数据部分
    //
    justForDate:function(data,url,target){
        var data = data;
        $.ajax({
            dataType:"json",
            type:"post",
            data:{
                data:data
            },
            url:"url",
            success:function(data){
                var data= data;
                for(var i=0;i<data.length;i++){
                    var $e=$("<div></div>");
                    $e.html(data[i].name);
                    $e.attr("LandId",data.id);
                    $(target).append($e);
                }
            },
            error:function(msg){
                alert(msg);
            }
        })
    },
    //点击产品下拉框获取产品列表（产品内容可能很多）
    getLandList:function(){
        var that= this;
        $("#proCommodity").click(function(){
            $("#proCommodity").html("");
            that.justForDate("","url","#suggestKey");
        })
        //管理员搜索框查询产品


    }










}
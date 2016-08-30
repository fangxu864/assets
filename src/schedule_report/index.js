/**
 * Created by Administrator on 2016/8/26.
 */
require("./index.scss");
require("./index.tpl");
var report ={
    //下拉列表的功能实现
    selectContain:function(a,b){
        $(a).click(function(e){
            $(b).toggle();
            if($(b).css("display")=="block"){
            }
            $(".returnData").click(function(){
                var choose=$(this).html();
                $(a).html(choose);
                $(b).css("display","none")
            })
        })

    },
    //
    proCommodity:function(){
        var that=this;
        that.selectContain("#produceIterm","#produceAll");
        that.selectContain("#proCommodity","#proCommodityItem");
        that.selectContain("#contianDistributorF","#containDistributorS")

    },
    selectChange:function(target,contain){
        //按票汇总，产品后增加票字段
        $(target).click(function(){
            if($(".addTicktItem").length<=0){
                var $e=$("<th class='tR addTicktItem' >票</th>");
                $(".reportTable .tL").after($e);
            }
            else{
                $(".addTicktItem").remove();
            }
            $("#produceTl").html(contain)

        })





    }

}
$(function(){
    report.proCommodity();
    report.selectChange("#produceAllTicket","产品");
    report.selectChange("#distributorAll","分销商");
    report.selectChange("#forOrder","预定渠道");
    report.selectChange("#forDate","日期");

})
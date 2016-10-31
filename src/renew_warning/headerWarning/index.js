/**
 * Created by Administrator on 2016/10/28.
 */
//引入modules
var LoopTip=require("./loopTip");
//引入tpl
var loopTip_tpl=require("./loopTip/loopTip.xtpl");


var HeaderWarning={
    init:function () {
        isWarning=true;
        if(isWarning){
            $("#special_w .subnav").eq(0).css("position","relative").append(loopTip_tpl);
            var loop_tip=new LoopTip({
                "container":$("#loopTip_box"),
                "content":"您好，您的票付通账户将于2016年11月11日到期，为避免影响您的正常使用，请提前续费或联系客服。（电话：18065144515）"
            });
        }
    }
    
};


$(function () {
    HeaderWarning.init()
});


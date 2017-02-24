/**
 * Created by Administrator on 2016/12/16.
 */
 $(function () {
   require("./expiredText.scss");
   var Cookie = require("./cookies.js");
   var dialog=require("COMMON/modules/dialog-simple");
   var expiredTextTpl = require("./expiredText.tpl");
   var memberID = $("#memberId").attr("data-id");

   //过期模拟部分————————————————————————————————————————————————————————
   var dialog_expired = new dialog({
       width : 800,
       height : 600,
       closeBtn : true,
       content : expiredTextTpl,
       drag : true,
       speed : 200,
       offsetX : 0,
       offsetY : 0,
       overlay : true,
       headerHeightMin : 46
   });

     //判断当天是否访问过
     var lastDate = Cookie.getCookie('lastDate'+memberID);
     console.log(lastDate);
     console.log(new Date().getDate());
     if(lastDate){
         var today = new Date().getDate();
         if(today == lastDate){
             console.log("Cookie存在,但是相等");
             // return false
         }else{
             console.log("Cookie存在,但是不相等");

             Cookie.setCookie('lastDate'+memberID,today,{expireHours:24});
         }
     }else{
         console.log("Cookie不存在");
         var today = new Date().getDate();
         Cookie.setCookie('lastDate'+memberID,today,{expireHours:24});
     }

     $.post("/r/AppCenter_ModuleList/getModuleListOfExpireSoon",{},function (res) {
         var data = res.data;
         var code = res.code;

         if(code==200){

             if(data.length > 0){

               dialog_expired.open();
               $.each(data,function (index,value) {
                   var i = index+1;
                   if(index < 10){
                       var seq = "0"+i;
                   }else {
                       var seq = i;
                   }
                   var newLi = $('<li> <span>'+seq+'、</span> <span> <em style="padding: 0 5px">'+value[0].name+'</em>将于<em class="etime">'+value[0].expire_time+'</em>到期。</span> <span class="renew" data-id="'+value[0].module_id+'">续费</span> </li>')
                   $("#appBox_expired").append(newLi)
               });
               $(".renew").on("click",function (e) {
                   window.location.href="new/appcenter_pay.html?appid="+$(e.target).attr("data-id");
               })

             }else{
              console.log("无过期应用");
             }

         }else{
             console.log(res.msg)
         }

     })



});
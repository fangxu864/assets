/**
 * Created by Administrator on 2016/12/16.
 */
 $(function () {
   require("./expiredText.scss");
   var Cookie = require("./cookies.js");
   var dialog=require("COMMON/modules/dialog-simple");
   var expiredTextTpl = require("./expiredText.tpl");
    var Service = require("./getModuleListOfExpireSoon_Service.js");
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
    Service({},{
        success:function (data) {

                //判断当天是否访问过
                var lastDate = Cookie.getCookie('lastDate');
                if(lastDate){
                    var today = new Date().getDate();
                    console.log(today);
                    if(today == lastDate){
                        return false
                    }else{
                        dialog_expired.open();
                        Cookie.setCookie('lastDate',today,{expireHours:24});
                    }
                }else{
                    dialog_expired.open();
                    var today = new Date().getDate();
                    Cookie.setCookie('lastDate',today,{expireHours:24});
                }

                $.each(data,function (index,value) {
                    var i = index+1;
                    if(index < 10){
                        var seq = "0"+i;
                    }else {
                        var seq = i;
                    }
                    var newLi = $('<li> <span>'+seq+'、</span> <span> <em style="padding: 0 5px">'+value.name+'</em>将于<em class="etime">'+value.expire_time+'</em>到期。</span> <span class="renew" data-id="'+value.module_id+'">续费</span> </li>')
                    $("#appBox_expired").append(newLi)
                });
                $(".renew").on("click",function (e) {
                    window.location.href="appcenter_pay.html?appid="+$(e.target).attr("data-id");
                })
            }
        
    })
   // $.post("/r/appCenter_ModuleList/getModuleListOfExpireSoon",{},function (req) {
   //     if(req.code == 200){
   //         //判断当天是否访问过
   //         // var lastDate = Cookie.getCookie('lastDate');
   //         // console.log(lastDate);
   //         // if(lastDate){
   //         //     var today = new Date().getDate();
   //         //     console.log(today);
   //         //     if(today == lastDate){
   //         //         return false
   //         //     }else{
   //         //         _this.dialog_expired.open();
   //         //         Cookie.setCookie('lastDate',today,{expireHours:24});
   //         //     }
   //         // }else{
   //         //     _this.dialog_expired.open();
   //         //     var today = new Date().getDate();
   //         //     Cookie.setCookie('lastDate',today,{expireHours:24});
   //         // }
   //
   //
   //
   //
   //
   //         $.each(req.data,function (index,value) {
   //             var i = index+1;
   //             if(index < 10){
   //                 var seq = "0"+i;
   //             }else {
   //                 var seq = i;
   //             }
   //             var newLi = $('<li> <span>'+seq+'、</span> <span> <em style="padding: 0 5px">'+value.name+'</em>将于<em class="etime">'+value.expire_time+'</em>到期。</span> <span class="renew">续费</span> </li>')
   //             $("#appBox_expired").append(newLi)
   //         })
   //     }
   // });


   //过期模拟部分————————————————————————————————————————————————————————
});
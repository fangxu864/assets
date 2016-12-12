/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");
var getAppdetail = require("../common/service/appDetail_service.js");
// var Template = {
//     appBox : PFT.Util.ParseTemplate(require("./tpl/details.tpl"))
// };

var demo = {
    isNew: true,
    isExpired: true,
}
var Main = PFT.Util.Class({
    init : function(){
        this.loadAjax();
    },
    // renderAppBox : function(data){
    //     var html = Template.appBox(data);
    //     console.log(html);
    // },

    //后台数据如果是硬件就加载硬件的模版
    //如果是软件就加载软件的模版和数据
    loadAjax:function () {
        getAppdetail({},{
            success:function (req) {


                if(req.Ishardware){
                    $(".section-appdetails").empty().append(require("./tpl/hardware.tpl"));
                    return false
                }

                $(".section-appdetails").empty().append(require("./tpl/software.tpl"));
                //后台数据导入
                $("#appName").text(req.appName);
                $("#appText").append(req.appText);
                $("#num").text(req.appUseNumber);
                $("#appDetails").text(req.appDetail);
                $("#etime").text(req.etime);
                $("#appDetails").text(req.appDetail);
                $("#price").text(req.price);
                
                var recommend = req.recomend;
                for(var i=0 ; i<recommend.length ; i++){
                    //new
                    var state = recommend[i].state;
                    if(state == 0){
                        var newLi = $('<li> <div class="app-item"> <div class="app-left"> <i class="ui-app-icon"></i> <p class="app-open"><span class="app-usernum c-warning">'+recommend[i].useNum+'</span> 用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"><strong class="app-name">'+recommend[i].appName+'</strong></div> <div class="text-ellipsis"><span class="app-price">'+recommend[i].text+'</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-default-reverse w100">免费试用</a> </div> </div> </div> <i class="icon-new"></i> </li>')
                    }else if(state == 1){
                        var newLi = $('<li> <div class="app-item"> <div class="app-left"> <i class="ui-app-icon"></i> <p class="app-open"><span class="app-usernum c-warning">'+recommend[i].useNum+'</span> 用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"><strong class="app-name">'+recommend[i].appName+'</strong></div> <div class="text-ellipsis"><span class="app-price">'+recommend[i].text+'</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-default-reverse w100">续费</a> </div> </div> </div>  </li>')
                    }else if(state == -1){
                        var newLi = $('<li> <div class="app-item"> <div class="app-left"> <i class="ui-app-icon"></i> <p class="app-open"><span class="app-usernum c-warning">'+recommend[i].useNum+'</span> 用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"><strong class="app-name">'+recommend[i].appName+'</strong></div> <div class="text-ellipsis"><span class="app-price">'+recommend[i].text+'</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-default-reverse w100">使用</a> </div> </div> </div> <i class="icon-expired"></i> </li>')
                    }
                    
                    $("#app-list").append(newLi)
                }


                var status = req.status;
                if(status == 0){
                    $("#btn").text("免费试用");
                    //信息提示框部分初始化
                    var btnLeft = $("#btn").offset().left;
                    var btnTop = $("#btn").offset().top;
                    $("#btn").mouseenter(function () {
                        $("#message_box_close").show().offset(function (n,c) {
                            newPos = new Object();
                            newPos.left =  btnLeft - 20;
                            newPos.top= btnTop - 80;
                            return newPos
                        })
                    }).mouseleave(function () {
                        $("#message_box_close").hide()
                    });
                }else if(status == 1){
                    $("#btn").text("续费");
                    //信息提示框部分初始化
                    var btnLeft = $("#btn").offset().left;
                    var btnTop = $("#btn").offset().top;
                    $("#btn").mouseenter(function () {
                        $("#message_box_open").show().offset(function (n,c) {
                            newPos = new Object();
                            newPos.left =  btnLeft - 50;
                            newPos.top= btnTop - 80;
                            return newPos
                        })
                    }).mouseleave(function () {
                        $("#message_box_open").hide()
                    });
                }else if(status == -1){
                    $("#btn").text("开通");
                    //信息提示框部分初始化
                    var btnLeft = $("#btn").offset().left;
                    var btnTop = $("#btn").offset().top;
                    $("#btn").mouseenter(function () {
                        $("#message_box_close").show().offset(function (n,c) {
                            newPos = new Object();
                            newPos.left =  btnLeft + 30;
                            newPos.top= btnTop - 80;
                            return newPos
                        })
                    }).mouseleave(function () {
                        $("#message_box_close").hide()
                    });
                }

            }
        })
    }
});

$(function () {
    var appDetail = new Main()
});
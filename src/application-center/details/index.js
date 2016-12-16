/**
 * Author: Zhengjiashen
 * Date: 2016/12/1 9:52
 * Description: ""
 */

require("./index.scss");

var getAppdetail = require("../common/service/appDetail_service.js");

var Main = PFT.Util.Class({

    //过期弹窗，暂不确定出现的位置，先放在这里测试
    init : function(){
        
        this.loadAjax();
    },

    loadAjax:function () {
        var _this = this;
        // 获取后台数据
        getAppdetail({},{
            success:function (req) {
                _this.renderAppDetails(req)
            }
        })
    },

    renderAppDetails:function (req) {

        //判断硬件详情还是APP详情
        if(req.Ishardware){
            $(".section-appdetails").empty().append(require("./tpl/hardware.tpl"));
            return false
        }

        //如果是软件详情，后台数据导入
        $(".section-appdetails").empty().append(require("./tpl/software.tpl"));
        $("#appName").text(req.appName);        //app名称
        $("#appText").append(req.appText);      //app文本
        $("#num").text(req.appUseNumber);       //使用人数
        $("#appDetails").text(req.appDetail);   //详情
        $("#etime").text(req.etime);            //到期时间
        $("#appDetails").text(req.appDetail);   //应用详情
        $("#price").show().text(req.price);            //价格

        //应用开通状态判断
        this.checkStatus(req.status);

        //推荐应用
        var recommend = req.recomend;
        for(var i=0 ; i<recommend.length ; i++){

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
    },

    checkStatus:function (status) {
        var btnLeft = $("#btn").position().left;
        var btnTop = $("#btn").position().top;
        console.log(btnLeft);
        console.log(btnTop);
        if(status == 0){
            $("#btn").text("免费试用");
            var showBox =  $("#message_box_close");
        }else if(status == 1){
            $("#btn").text("续费");
            var showBox =  $("#message_box_open");
            $("#price").hide();

        }else if(status == -1){
            $("#btn").text("开通");
            var showBox =  $("#message_box_close");
        }

        $("#btn").mouseenter(function () {
            showBox.show().css({
                'position':'absolute',
                'left': btnLeft-showBox.width()/2+btnLeft/2 +'px',
                'top': btnTop-showBox.height()-20 +'px'
            })
        }).mouseleave(function () {
            showBox.hide()
        });
    },
});

$(function () {
    var appDetail = new Main()
});
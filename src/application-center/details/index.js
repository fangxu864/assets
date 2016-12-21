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
    getParam:function () {
        
    },
    loadAjax:function () {
        var _this = this;
        // 获取后台数据
        getAppdetail({module_id:10,ptypeApp:0},{
            complete:function (req) {
                if(req.code == 200){
                    console.log(req.data);
                    _this.renderAppDetails(req.data)
                }


            }
        })
    },

    renderAppDetails:function (req) {
        var _this = this;
        var data = req.data;

        //判断硬件详情还是APP详情
        if(!req.type){
            $(".section-appdetails").empty().append(require("./tpl/hardware.tpl"));

            $("#name").text(data.name);        //app名称
            $("#summary").append(data.summary);      //app文本
            $("#appDetails").text(data.introduce);   //应用详情

            if(data.pictures){
                for(var i=0 ; i <pictures.length ; i++){
                    var newImg = $('<img  class="img" src="'+pictures[i]+'" alt="">');
                    $("#pictures").append(newImg)
                }
            }

            if(req.link){
                for(var i=0 ; i <req.link.length ; i++){
                    var detail = req.link[i].detail;
                    var newLi = $('<li><img class="img" " src="'+detail.pictures+'" alt=""></li>')
                }
            }

        }else if (req.type){
            //如果是软件详情，后台数据导入
            $(".section-appdetails").empty().append(require("./tpl/software.tpl"));

            $("#appName").text(data.name);        //app名称
            $("#appText").append(data.summary);      //app文本
            $("#num").text(data.open_num);       //使用人数
            $("#etime").text(_this.changeTimeType(data.expire_time));            //到期时间
            $("#appDetails").text(data.introduce);   //应用详情
            $("#price").show().text(req.price);            //价格
            $(".line1_detail").find(".ui-app-icon").css({
                "background-image": "url("+data.icon+")"     //图标
            });


            //应用开通状态判断
            this.checkStatus(data);

            //价格
            var moduleFree = data.checkData.moduleFree;
            if(moduleFree){
                for (var i = 0 ; i < moduleFree.length ; i++){
                    var newLi = $('<li> <span class="free">'+moduleFree[i].free+'</span> <span class="mode">'+moduleFree[i].mode+'</span> </li>')
                    $("#price").append(newLi)
                }
            }

            //推荐应用
            var recommend = req.link;
            console.log(recommend.length);
            for(var i=0 ; i<recommend.length ; i++){
                var detail = recommend[i].detail;
                var checkData = recommend[i].detail.checkData;
                var state = checkData.showType;
                var newLi = $('<li class="linkApp" data-type="'+detail.id+'"> <div class="app-item"> <div class="app-left"> <i class="ui-app-icon"></i> <p class="app-open"><span class="app-usernum c-warning">'+detail.open_num+'</span> 用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"><strong class="app-name">'+detail.name+'</strong></div> <div class="text-ellipsis"><span class="app-price">'+detail.summary+'</span></div> <div class="app-btn-w"> <a href="javascript:;"  class="btn btn-default-reverse w100 showType" ></a> </div> </div> </div>');
                newLi.find(".ui-app-icon").css({
                    "background-image": "url("+detail.icon+")"
                })

                if(state == -1){
                    newLi.find(".showType").text("续费")
                }else if(state == 0){
                    newLi.find(".showType").text("免费试用")
                }else if(state == 1){
                    newLi.find(".showType").text("开通")
                }
                else if(state == 2){
                    newLi.find(".showType").text("使用")
                }
                else if(state == 3){
                    newLi.find(".showType").text("去看看")
                }

                $("#app-list").append(newLi);

            }
        }
    },

    checkStatus:function (data) {
        var _this = this;
        var btnLeft = $("#btn").position().left;
        var btnTop = $("#btn").position().top;
        var status = data.checkData.showType,
            topType = data.checkData.topType,
            topName = data.checkData.topName;

        if(status == 0){
            $("#btn").text("免费试用");
            var showBox =  $("#message_box_close");
        }else if(status == -1){
            $("#btn").text("续费");
            var showBox =  $("#message_box_open");
            $("#price").hide();

        }else if(status == 1){
            $("#btn").text("开通");
            var showBox =  $("#message_box_close");
        }else if(status == 2){
            $("#btn").text("使用");
            var showBox =  $("#message_box_close");
        }else if(status == 3){
            $("#btn").text("去看看");
            var showBox =  $("#message_box_close");
        }

        if(topType == 2){
            showBox.find("#topName").text(topName);
            showBox.find("#secondAppName").text(data.name);
        }else if(topType == 1){
            console.log(12345)
            showBox.find("#begin_time").text(_this.changeTimeType(data.begin_time));
            showBox.find("#expire_time").text(_this.changeTimeType(data.expire_time))
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
    
    changeTimeType:function (timestamp) {
        var newDate = new Date();
        newDate.setTime(timestamp * 1000);
        return newDate.toLocaleDateString()
    }
});

$(function () {
    var appDetail = new Main()
});
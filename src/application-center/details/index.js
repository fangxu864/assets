
require("./index.scss");
//require("./expiredText/index.js");
var getAppdetail = require("../common/service/appDetail_service.js");

var Main = PFT.Util.Class({

    //过期弹窗，暂不确定出现的位置，先放在这里测试
    init : function(){
        this.getParam();
        this.loadAjax();
    },
    getParam:function () {
        var thisURL = document.URL;
        var  getval =thisURL.split('?')[1];
        if(getval){
            this.module_id = getval.split("=")[1];
        }else{
            alert("请先选择您要查看的应用。");
            window.location.href="appcenter.html";
        }

    },
    loadAjax:function () {
        var _this = this;
        // 获取后台数据
        getAppdetail({module_id:_this.module_id},{
            complete:function (req) {
                if(req.code == 200){
                    _this.renderAppDetails(req.data);
                    _this.btnInit()
                }
            }
        })
    },

    renderAppDetails:function (req) {
        var _this = this;
        var data = req.data;

        //判断硬件详情还是APP详情
        if(!req.type){
            //硬件详情
            $(".section-appdetails").empty().append(require("./tpl/hardware.tpl"));
            //
            // $("#name").text(data.name);        //app名称
            // $("#summary").append(data.summary);      //app文本
            // $("#appDetails").text(data.introduce);   //应用详情
            //
            // if(data.pictures){
            //     for(var i=0 ; i <pictures.length ; i++){
            //         var newImg = $('<img  class="img" src="'+pictures[i]+'" alt="">');
            //         $("#pictures").append(newImg)
            //     }
            // }
            //
            // if(req.link){
            //     for(var i=0 ; i <req.link.length ; i++){
            //         var detail = req.link[i].detail;
            //         var newLi = $('<li><img class="img" " src="'+detail.pictures+'" alt=""></li>')
            //     }
            // }

        }else if (req.type){
            //如果是软件详情，后台数据导入
            $(".section-appdetails").empty().append(require("./tpl/software.tpl"));

            $("#title").text(data.name);
            $("#appName").text(data.name);        //app名称
            $("#appText").append(data.summary);      //app文本
            $("#appText").attr("title",data.summary);      //app文本
            $("#num").text(data.open_num);       //使用人数
            $("#etime").text(_this.changeTimeType(data.expire_time));            //到期时间
            $("#appDetails").text(data.introduce);   //应用详情
            $("#price").show().text(req.price);            //价格
            if(data.icon){
                $(".line1_detail").find(".ui-app-ico img").attr("src",data.icon);
            }



            //应用开通状态判断
            this.checkStatus(data);

            //推荐应用

            var recommend = req.link;
            if(recommend){
                for(var i=0 ; i<recommend.length ; i++){
                    var detail = recommend[i].detail;
                    var checkData = recommend[i].detail.checkData;
                    var state = checkData.showType;
                    // var newLi = $('<li class="linkApp" data-type="'+detail.id+'"> <div class="app-item"> <div class="app-left"> <i class="ui-app-ico"></i> <p class="app-open"><span class="app-usernum c-warning">'+detail.open_num+'</span> 用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"><strong class="app-name">'+detail.name+'</strong></div> <div class="text-ellipsis"><span class="app-price">'+detail.summary+'</span></div> <div class="app-btn-w"> <a href="javascript:;"  class="btn btn-default-reverse w100 showType" ></a> </div> </div> </div>');
                    // newLi.find(".ui-app-icon").css({
                    //     "background-image": "url("+detail.icon+")"
                    // })

                    if(state == -1){
                        var newLi = $('<li class="app-item"><div class="app-left"> <i class="ui-app-ico"><img src="http://static.12301.cc/assets/build/images/appcenter/icons/default.png" alt=""></i> <p class="app-open"><span class="app-usernum c-warning"></span>用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"> <strong class="app-name">未知</strong> </div> <div class="text-ellipsis"> <span class="app-price app-summary">未知</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-default mr10 show" data-id = "'+detail.module_id+'">使用</a> <a href="javascript:;" class="btn-link" data-id = "'+detail.module_id+'">续费</a> </div> </div> </li>')
                    }else if(state == 0){
                        var newLi = $('<li class="app-item"> <div class="app-left"> <i class="ui-app-ico"><img src="http://static.12301.cc/assets/build/images/appcenter/icons/default.png" alt=""></i> <p class="app-open"><span class="app-usernum c-warning"></span>用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"> <strong class="app-name">未知</strong> </div> <div class="text-ellipsis"> <span class="app-price app-summary">未知</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-reverse w100 show" data-id = "'+detail.module_id+'">免费试用</a> </div> </div><i class="ico-new"></i></li>')
                    }else if(state == 1){
                        var newLi = $('<li class="app-item"> <div class="app-left"> <i class="ui-app-ico"><img src="http://static.12301.cc/assets/build/images/appcenter/icons/default.png" alt=""></i> <p class="app-open"><span class="app-usernum c-warning"></span>用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"> <strong class="app-name">未知</strong> </div> <div class="text-ellipsis"> <span class="app-price app-summary">未知</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-reverse w100 open" data-id = "'+detail.module_id+'">开通</a> </div> </div> </li>')
                    }
                    else if(state == 2){
                        var newLi = $('<li class="app-item"> <div class="app-left"> <i class="ui-app-ico"><img src="http://static.12301.cc/assets/build/images/appcenter/icons/default.png" alt=""></i> <p class="app-open"><span class="app-usernum c-warning"></span>用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"> <strong class="app-name">未知</strong> </div> <div class="text-ellipsis"> <span class="app-price app-summary">未知</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-reverse w100 use" data-use = "'+detail.url+'" data-id = "'+detail.module_id+'">使用</a> </div> </div> </li>')
                    }
                    else if(state == 3){
                        var newLi = $('<li class="app-item"> <div class="app-left"> <i class="ui-app-ico"><img src="http://static.12301.cc/assets/build/images/appcenter/icons/default.png" alt=""></i> <p class="app-open"><span class="app-usernum c-warning"></span>用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"> <strong class="app-name">未知</strong> </div> <div class="text-ellipsis"> <span class="app-price app-summary">未知</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-reverse w100 show" data-id = "'+detail.module_id+'">去看看</a> </div> </div><i class="ico-expired"></i></li>')
                    }


                    newLi.find(".app-usernum").text(detail.open_num);
                    newLi.find(".app-name").text(detail.name);
                    newLi.find(".app-summary").text(detail.summary);

                    if(data.icon){
                        newLi.find(".ui-app-ico img").attr("src",data.icon);
                    }

                    $("#app-list").append(newLi);

                }
            }
        }
    },

    checkStatus:function (data) {
        var _this = this;
        var btnLeft = $("#btn").position().left;
        var btnTop = $("#btn").position().top;
        var status = data.checkData.showType,
            topType = data.checkData.topType,
            topName = data.checkData.topName,
            moduleFree = data.checkData.moduleFree;

        //按钮文字部分
        if(status == 0){
            $("#btn").text("免费试用").on("click",function () {
                _this.freeTrial()
            })
        }else if(status == -1){
            $("#btn").text("续费").on("click",function () {
                window.location.href="appcenter_pay.html?appid="+_this.module_id
            })
        }else if(status == 1){
            $("#btn").text("开通").on("click",function () {
                window.location.href="appcenter_pay.html?appid="+_this.module_id
            });

            //价格提示部分
            if(moduleFree){
                var price = "";
                for (var key in moduleFree){
                    price+=moduleFree[key].free + "元 / " + moduleFree[key].mode +"&nbsp;&nbsp;";
                }
                $("#price").text(price)
            }else(
                console.log("none")
            )
        }else if(status == 2){
            $("#btn").text("使用").on("click",function () {
                window.location.href="appcenter_details.html?module_id="+_this.module_id
                
            })
        }else if(status == 3){
            $("#btn").text("去看看").on("click",function () {
                window.location.href="appcenter_details.html?module_id="+_this.module_id
            })
        }


        //悬浮提示部分
        if(topType == 2){
            var showBox =  $("#message_box_close");
            showBox.find("#topName").text(topName);
            showBox.find("#secondAppName").text(data.name);
        }else if(topType == 1){
            var showBox =  $("#message_box_open");
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
        var year = newDate.getFullYear();
        var month = newDate.getMonth()+1;
        var day = newDate.getDate();
        return year+"-"+month+"-"+day
    },

    freeTrial:function () {
        $.post("/r/AppCenter_ModulePayment/freeTrial",{module_id:this.module_id},function (data) {
            if(data.code ==  200){
                alert("已为您开通免费试用");
                location.reload()
            }else{
                alert(data.msg);
            }
        })
    },

    btnInit:function () {
        $("#app-list").find(".show").on("click",function (e) {
            window.location.href="appcenter_details.html?module_id="+ $(e.target).attr("data-id");
        });


        $("#app-list").find(".btn-link").on("click",function (e) {
            window.location.href="appcenter_pay.html?appid="+$(e.target).attr("data-id");
        });

        $("#app-list").find(".open").on("click",function (e) {
            window.location.href="appcenter_pay.html?appid="+$(e.target).attr("data-id");
        });

        $("#app-list").find(".use").on("click",function (e) {
            window.location.href=$(e.target).attr("data-url");
        });
    }
});

$(function () {
    var appDetail = new Main()
});
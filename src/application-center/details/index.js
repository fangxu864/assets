
require("./index.scss");

var dialog = require("COMMON/modules/dialog-simple"),
    loading = require('COMMON/js/util.loading.pc.js'),
    getAppdetail = require("../common/service/appDetail_service.js"),
    hardware = require("./tpl/hardware.tpl"),
    software = require("./tpl/software.tpl"),
    dialog_topIndex_content = require("./tpl/topIndex.tpl");


var preDomain = PFT.PREFIX_DOMAIN() || "";

var Main = PFT.Util.Class({

    init : function(){
        this.initDialog();
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
            loading:function () {
            var html = loading("加载中",{ height: 800 });
                $(".section-appdetails").append(html)
            },
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
            //硬件详情---------------------------------------------------------

            $(".section-appdetails").empty().append( hardware );

            var hardwareBase = this.hardwareBase;
            var id = this.module_id;
            if(id == 10){
                var link = [9,11,15]
            }else if(id == 9){
                var link = [10,11,15]
            }else if(id == 11){
                var link = [10,9,15]
            }else if(id == 15){
                var link = [10,9,11]
            }

            $("#head").text(hardwareBase.name[id]);
            $("#name").text(hardwareBase.name[id]);        //app名称
            $("#summary").append(hardwareBase.summary[id]);      //app文本
            $("#appDetails").append($(hardwareBase.introduce[id]));   //应用详情
            $("#picture").attr("src",hardwareBase.pictures[id]);

            $("#appDetails").addClass("yingjian");

            for(var i = 0 ; i < link.length ; i++){
                var newLi = $(' <li style="margin-left: 62px" class="yingjian link" data-id="'+link[i]+'"> <h4 class="yingjian_name">'+hardwareBase.name[link[i]]+'</h4> <a href="appcenter_details.html?module_id='+link[i]+'"> <img src='+hardwareBase.link[link[i]]+' alt='+hardwareBase.name[link[i]]+'> </a> </li>');
                $("#app-list").append(newLi);
            }


        }else if (req.type){
            //如果是软件详情---------------------------------------------------------------------------------
            $(".section-appdetails").empty().append( software );

            $("#title").text(data.name);
            $("#appName").text(data.name);        //app名称
            $("#appText").append(data.summary);      //app文本
            $("#appText").attr("title",data.summary);      //app文本
            $("#num").text(data.open_num);       //使用人数
            $("#etime").text(_this.changeTimeType(data.expire_time));            //到期时间
            $("#appDetails").html(data.introduce);   //应用详情
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
                        var newLi = $('<li><div class="app-item"><div class="app-left"> <i class="ui-app-ico"><img src="http://static.12301.cc/assets/build/images/appcenter/icons/default.png" alt=""></i> <p class="app-open"><span class="app-usernum c-warning"></span>用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"> <strong class="app-name">未知</strong> </div> <div class="text-ellipsis"> <span class="app-price app-summary">未知</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-default mr10 use" data-url = "'+detail.checkData.url+'" data-id = "'+detail.module_id+'">使用</a> <a href="javascript:;" class="btn-link" data-id = "'+detail.module_id+'">续费</a> </div> </div></div></li>')
                    }else if(state == 0){
                        var newLi = $('<li><div class="app-item"> <div class="app-left"> <i class="ui-app-ico"><img src="http://static.12301.cc/assets/build/images/appcenter/icons/default.png" alt=""></i> <p class="app-open"><span class="app-usernum c-warning"></span>用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"> <strong class="app-name">未知</strong> </div> <div class="text-ellipsis"> <span class="app-price app-summary">未知</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-reverse w100 show" data-id = "'+detail.module_id+'">免费试用</a> </div> </div></div><i class="ico-new"></i></li>')
                    }else if(state == 1){
                        var newLi = $('<li><div class="app-item"> <div class="app-left"> <i class="ui-app-ico"><img src="http://static.12301.cc/assets/build/images/appcenter/icons/default.png" alt=""></i> <p class="app-open"><span class="app-usernum c-warning"></span>用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"> <strong class="app-name">未知</strong> </div> <div class="text-ellipsis"> <span class="app-price app-summary">未知</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-reverse w100 open" data-id = "'+detail.module_id+'">开通</a> </div> </div></div></li>')
                    }
                    else if(state == 2){
                        // var newLi = $('<li><div class="app-item"> <div class="app-left"> <i class="ui-app-ico"><img src="http://static.12301.cc/assets/build/images/appcenter/icons/default.png" alt=""></i> <p class="app-open"><span class="app-usernum c-warning"></span>用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"> <strong class="app-name">未知</strong> </div> <div class="text-ellipsis"> <span class="app-price app-summary">未知</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-reverse w100 use" data-url = "'+detail.checkData.url+'" data-id = "'+detail.module_id+'">使用</a> </div> </div></div></li>')
                        var newLi = $('<li><div class="app-item"><div class="app-left"> <i class="ui-app-ico"><img src="http://static.12301.cc/assets/build/images/appcenter/icons/default.png" alt=""></i> <p class="app-open"><span class="app-usernum c-warning"></span>用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"> <strong class="app-name">未知</strong> </div> <div class="text-ellipsis"> <span class="app-price app-summary">未知</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-default mr10 use" data-url = "'+detail.checkData.url+'" data-id = "'+detail.module_id+'">使用</a></div></div></div></li>')
                    }
                    else if(state == 3){
                        var newLi = $('<li><div class="app-item"> <div class="app-left"> <i class="ui-app-ico"><img src="http://static.12301.cc/assets/build/images/appcenter/icons/default.png" alt=""></i> <p class="app-open"><span class="app-usernum c-warning"></span>用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"> <strong class="app-name">未知</strong> </div> <div class="text-ellipsis"> <span class="app-price app-summary">未知</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-reverse w100 show" data-id = "'+detail.module_id+'">去看看</a> </div> </div></div><i class="ico-expired"></i></li>')
                    }else if(state == -2){
                        // var newLi = $('<li><div class="app-item"> <div class="app-left"> <i class="ui-app-ico"><img src="http://static.12301.cc/assets/build/images/appcenter/icons/default.png" alt=""></i> <p class="app-open"><span class="app-usernum c-warning"></span>用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"> <strong class="app-name">未知</strong> </div> <div class="text-ellipsis"> <span class="app-price app-summary">未知</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-reverse w100 show" data-id = "'+detail.module_id+'">去看看</a> </div> </div></div><i class="ico-expired"></i></li>')
                        var newLi = $('<li><div class="app-item"> <div class="app-left"> <i class="ui-app-ico"><img src="http://static.12301.cc/assets/build/images/appcenter/icons/default.png" alt=""></i> <p class="app-open"><span class="app-usernum c-warning"></span>用户<br>已开通</p> </div> <div class="app-right"> <div class="text-ellipsis"> <strong class="app-name">未知</strong> </div> <div class="text-ellipsis"> <span class="app-price app-summary">未知</span></div> <div class="app-btn-w"> <a href="javascript:;" class="btn btn-reverse w100 open" data-id = "'+detail.module_id+'">开通</a> </div> </div></div></li>')
                        console.log(newLi);
                        newLi.css("display","none");
                        newLi.find(".app-item").css("height","97px");
                    }

                    newLi.find(".app-usernum").text(detail.open_num);
                    newLi.find(".app-name").text(detail.name);
                    newLi.find(".app-summary").text(detail.summary);
                    newLi.find(".app-summary").attr("title",detail.summary);

                    if(detail.icon){
                        newLi.find(".ui-app-ico img").attr("src",detail.icon);
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
        var checkData = data.checkData,
            status = checkData.showType,
            topType = checkData.topType,
            topName = checkData.topName,
            moduleFree = checkData.moduleFree,
            showextime = checkData.showextime,
            show_hide = checkData.show_hide;

        //是否显示到期时间
            if(showextime == 0 ){
                $("#expiredTime").hide();
            }
        //按钮文字部分
        if(status == 0){
            $("#btn").text("免费试用 ("+ data.free_day +"天)").on("click",function () {
                if(topType == 2){
                    _this.checkIsTop(checkData);
                    return false
                }
                _this.freeTrial();
            });

            //价格提示部分
            if(moduleFree){
                var price = "";
                for (var key in moduleFree){
                    if(key !=0 ){
                        price+= "；     " + moduleFree[key].free + "元 / " + moduleFree[key].mode ;
                    }else{
                        price+=moduleFree[key].free + "元 / " + moduleFree[key].mode ;
                    }

                }
                $("#price").text(price)
            }else(
                console.log("none")
            )
        }else if(status == -1){
            $("#btn").text("续费").on("click",function () {
                window.location.href="appcenter_pay.html?appid="+_this.module_id
            })
        }else if(status == 1){
            $("#btn").text("开通").on("click",function () {
                if(topType == 2){
                    _this.checkIsTop(checkData);
                    return false
                }
                window.location.href = preDomain + "new/appcenter_pay.html?appid="+_this.module_id
            });

            //价格提示部分
            if(moduleFree){
                var price = "";
                for (var key in moduleFree){
                    price+=moduleFree[key].free + "元 / " + moduleFree[key].mode +"&nbsp;&nbsp;";
                }
                console.log(price);
                $("#price").text(price)
            }else(
                console.log("none")
            )
        }else if( status == 2 ){
            if ( show_hide == 0 ) {
                $("#btn").text("使用").on("click",function () {
                    window.location.href= checkData.url ? (preDomain + checkData.url) : preDomain + "new/appcenter_details.html?module_id="+_this.module_id;
                })
            } else {
                $("#btn").css("display","none");
            }
        }else if(status == 3){
            $("#btn").text("去看看").on("click",function () {
                window.location.href = preDomain + "new/appcenter_details.html?module_id="+_this.module_id
            })
        }else if(status == -2){
            $("#btn").css("display","none");
        }


        //悬浮提示部分
        if(topType == 2){
            var showBox =  $("#message_box_close");
            showBox.find("#topName").text(topName);
            showBox.find("#secondAppName").text(data.name);
        }
        // else if(topType == 1 && showextime == 1 ){
        //     var showBox =  $("#message_box_open");
        //     showBox.find('.m-appname').text( data.name );
        //     showBox.find("#begin_time").text(_this.changeTimeType(data.begin_time));
        //     showBox.find("#expire_time").text(_this.changeTimeType(data.expire_time))
        // }

        $("#btn").mouseenter(function () {
            showBox && showBox.show().css({
                'position':'absolute',
                'left': btnLeft-showBox.width()/2+btnLeft/2 +'px',
                'top': btnTop-showBox.height()-20 +'px'
            })
        }).mouseleave(function () {
            showBox && showBox.hide()
        });
    },

    //时间格式转化
    changeTimeType:function (timestamp) {
        var newDate = new Date();
        newDate.setTime(timestamp * 1000);
        var year = newDate.getFullYear();
        var month = newDate.getMonth()+1;
        var day = newDate.getDate();
        return year+"-"+month+"-"+day
    },

    //免费试用接口调用
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

    //推荐应用链接
    btnInit:function () {
        $("#app-list").find(".show").on("click",function (e) {
            window.location.href = preDomain + "new/appcenter_details.html?module_id="+ $(e.target).attr("data-id");
        });


        $("#app-list").find(".btn-link").on("click",function (e) {
            window.location.href = preDomain + "new/appcenter_pay.html?appid="+$(e.target).attr("data-id");
        });

        $("#app-list").find(".open").on("click",function (e) {
            window.location.href = preDomain + "new/appcenter_pay.html?appid="+$(e.target).attr("data-id");
        });

        $("#app-list").find(".use").on("click",function (e) {
            window.location.href = preDomain + $(e.target).attr("data-url");
        });
    },

    //上级应用提示
    checkIsTop:function (checkData) {
        this.dialog_topIndex.open();
        var thisApp = $("#title").text();
        $("#targetApp").text(thisApp);
        $("#topApp").text(checkData.topName);
        $("#topApp2").text(checkData.topName);

        $("#topLink").on("click",function () {
            window.location.href = preDomain + "new/appcenter_details.html?module_id="+parseInt(checkData.id);
        })
    },

    initDialog:function () {
        //提示框初始化
        this.dialog_topIndex = new dialog({
            width : 600,
            height : 300,
            closeBtn : true,
            content : dialog_topIndex_content,
            drag : true,
            speed : 200,
            offsetX : 0,
            offsetY : 0,
            overlay : true,
            headerHeightMin : 46
        });

    },

    //硬件详情数据库
    hardwareBase:{
        name:{
            10:"MINI云票务",
            9:"云票务",
            11:"云闸机",
            15:"自助售取票机"
        },
        pictures:{
            10:"http://static.12301.cc/assets/build/images/appcenter/miniyun_big.jpg",
            9:"http://static.12301.cc/assets/build/images/appcenter/yunpiaowu_big.jpg",
            11:"http://static.12301.cc/assets/build/images/appcenter/yunzaji_big.jpg",
            15:"http://static.12301.cc/assets/build/images/appcenter/zizhuji_big.jpg"
        },
        link:{
            10:"http://static.12301.cc/assets/build/images/appcenter/miniyun.jpg",
            9:"http://static.12301.cc/assets/build/images/appcenter/yunpiaowu.jpg",
            11:"http://static.12301.cc/assets/build/images/appcenter/yunzaji.jpg",
            15:"http://static.12301.cc/assets/build/images/appcenter/zizhuji.jpg"
        },
        summary:{
            10:"移动式电子票务系统",
            9:"中小景区票务专家",
            11:"超级全能王",
            15:"景区自主运营神器"
        },
        introduce:{
            10:'<p class="title">产品标签:</p> <p class="content">移动售票&nbsp;&nbsp;全能支付&nbsp;&nbsp;网络取票 <br>会员营销&nbsp;&nbsp;全网通讯&nbsp;&nbsp;数据分析 </p> <p class="title">重要参数:</p> <p class="content">1.彩色、5.5英寸IPS显示屏，分辨率1280*720<br>2.全屏触控式触摸屏，高速灵敏<br>3.支持微信支付、支付宝支付  银联刷卡、Apple pay等主流支付方式<br> 4.支持会员卡、旅游一卡通优惠购票<br> 5.全网通讯：2G、3G、4G、WiFi、热点、蓝牙<br> </p>',
            9:'<p class="title">产品标签:</p> <p class="content">“售-取-检-管”一体化；销售动态实时查询；<br>多渠道购票，一个终端统一取票 </p> <p class="title">重要参数:</p> <p class="content"> 1.安全稳定，银行证券级数据保障<br> 2.203DPI高清热转式/热感式打印，打印效率达8 IPS<br> 3.霍尼韦尔二维码阅读功能，读码快速精准<br> 4.支持3G、4G、LAN、Wi-Fi多种通讯介质<br> 5.支持微信、支付宝付款码扫码支付<br> </p>',
            11:'<p class="title">产品标签:</p> <p class="content">闪付闪验&nbsp;&nbsp;门票打印&nbsp;&nbsp;远程管理 <br>多渠道购买、统一验证 <br>数据快速传输、云端存储 </p> <p class="title">重要参数:</p> <p class="content"> 1. 全电动智能三棍闸机芯，检测精度1度<br> 2. 平均无故障运行大于300万次<br> 3. 支持门票打印<br> 4. 7寸TFT高清液晶屏<br> 5. 支持LAN、WiFi、4G卡通讯<br> 6. 人像采集摄像头<br> 7. 支付宝、微信付款码闪付<br> 8. 可刷二代身份证、二维码、IC卡<br> </p>',
            15:'<p class="title">产品标签:</p> <p class="content">游客自助线上预订现场取票 <br>支持景区自主运营现场售票 </p> <p class="title">重要参数:</p> <p class="content"> 1.使用钢板、铸铝和工程塑料，模具制造，工艺精良<br> 2.放置式安装模式，安装简单容易<br> 3.支持微信、支付宝、银联刷卡等支付方式<br> 4.支持4G、LAN、WiFi多种通讯介质<br> 5.支持互联网取票，凭手机二维码、身份证验证取票<br> </p>'
        }

    }
});

$(function () {
    var appDetail = new Main()
});
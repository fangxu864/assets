/**
 * Created by Administrator on 2017/4/28.
 */

//-------------css--------------
require("./index.scss");

//-------------tpl--------------
var frameTpl = require("./tpl/frame.xtpl");
var recordTb = require("./tpl/recordTb.xtpl");
//-----------通用插件-----------
var Message = require("pft-ui-component/Message");
var Pagination = require("COMMON/modules/pagination-x");
var Select = require("COMMON/modules/select");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
var DatePicker = require("COMMON/modules/datepicker");
var tips = require("COMMON/modules/tips/index.js");
var Tips = new tips ();
//-----------自建模块-----------
var renderNav = require("../common/nav/index.js");
//公共资源common resource
var CR = require("./CR.js");
var readIdCard = require("../common/readIdCard/index.js");
var readIdCard1 = new readIdCard();
var readIdCard2 = new readIdCard();


var buyTicket = PFT.Util.Class({

    init: function () {
        var _this = this;
        this.container = $("#GBuyTicketWrap");
        this.container.html(frameTpl);
        this.recordTbody = this.container.find(".ticket-record-wrap .record-tb tbody");
        renderNav("3" , this.container.find(".nav-box"));
        this.pagination = new Pagination({
            container : _this.container.find(".record-pag-box") , //必须，组件容器id
            count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });
     
        this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
            _this.recordParamHub.page = toPage;
            _this.getRecordData();
        });
        this.initDatepicker();
        this.getLandsData();
        this.bind()
    },

    bind: function () {
        var _this = this ;
        var CON = this.container;
        var recordCon = this.container.find(".ticket-record-wrap");

        //点击主页面产品选择框
        CON.on("click" ,".filter-box .land-inp" ,function (e) {
            //点击时才初始化产品选择框
            if( !_this.mainLandSelect ){
                _this.mainLandSelect = new Select({
                    height:300,
                    field : {
                        id : "id",
                        name : "title",
                        keyword : "title"
                    },
                    trigger : $("#landInpMain"),
                    data: _this.landListData
                });
                $(this).click();
            }
        });
        recordCon.on("click" ,".record-filter .land-inp" ,function (e) {
            //点击时才初始化产品选择框
            if( !_this.recordLandSelect ){
                _this.recordLandSelect = new Select({
                    height:300,
                    field : {
                        id : "id",
                        name : "title",
                        keyword : "title"
                    },
                    trigger : $("#landInpRecord"),
                    data: _this.landListData
                });
                $(this).click();
            }
        });

        //点击购票按钮
        CON.on("click", ".filter-box .buy-btn" ,function () {
            var params = {};
            var landInp = CON.find(".filter-box .land-inp");
            var idNumInp = CON.find(".filter-box .idNum-inp");
            var userNameInp = CON.find(".filter-box .userName-inp");
            var ticketNumInp = CON.find(".filter-box .ticket-num");
            var lid = landInp.attr("data-id");
            var id_card = $.trim( idNumInp.val() );
            var name = $.trim( userNameInp.val() );
            var ticketNum = $.trim( ticketNumInp.val() );
            if(!CR.judgeTrue(lid)){
                Tips.closeAllTips();
                Tips.show({
                    lifetime : 1500 ,
                    direction:'right',
                    hostObj : landInp ,
                    content : "请选择产品",
                    bgcolor : "#f0c245"
                });
                return false;
            }
            if(!/^[0-9]+$/.test(ticketNum)){
                if(ticketNum == "") {
                    ticketNumInp.val(1);
                    ticketNum = 1;
                }else{
                    Tips.closeAllTips();
                    Tips.show({
                        lifetime : 1500 ,
                        direction:'right',
                        hostObj : ticketNumInp ,
                        content : "请填写正确的购票数量",
                        bgcolor : "#f0c245"
                    });
                    return false;
                }
            }
            if(!PFT.Util.Validate.idcard(id_card)){
                Tips.closeAllTips();
                Tips.show({
                    lifetime : 1500 ,
                    direction:'right',
                    hostObj : idNumInp ,
                    content : "请填写正确的身份证号",
                    bgcolor : "#f0c245"
                });
                return false;
            }
            if( name == ""){
                // userNameInp.val("--");
                name = "--";
                // Tips.closeAllTips();
                // Tips.show({
                //     lifetime : 1500 ,
                //     direction:'right',
                //     hostObj : userNameInp ,
                //     content : "请填写姓名",
                //     bgcolor : "#f0c245"
                // });
                // return false;
            }
            params["lid"] = lid;
            params["id_card"] = id_card;
            params["name"] = name;
            params["ticket"] = ticketNum;
            $.ajax({
                url: CR.url.addOrderRecord,    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步
                data: params,    //参数值
                type: "POST",   //请求方式
                timeout:5000,   //设置超时 5000毫秒
                beforeSend: function() {
                    //请求前的处理
                },
                success: function(res) {
                    // 请求成功时处理
                    if(res.code == 200 ){
                        Message.success("购票记录成功");
                        recordCon.find(".record-filter .land-inp").val(landInp.val()).attr("data-id",lid);
                        recordCon.find(".record-filter .idNum-inp").val("");
                        recordCon.find(".record-filter .userName-inp").val("");
                        recordCon.find(".record-filter .search-btn").click();
                    }else{
                        Message.error(res.msg)
                    }
                },
                complete: function(res,status) {
                    //请求完成的处理
                    if(status=="timeout"){
                        Message.warning("请求超时");

                    }
                },
                error: function() {
                    //请求出错处理
                    Message.warning("请求出错");
                }
            });
        });

        //点击购票记录搜索按钮
        recordCon.on("click" ,".record-filter .search-btn",function () {
            var bTimeInp = recordCon.find(".record-filter .bTimeInp"),
                eTimeInp = recordCon.find(".record-filter .eTimeInp"),
                landInp = recordCon.find(".record-filter .land-inp"),
                idNumInp = recordCon.find(".record-filter .idNum-inp"),
                nameInp = recordCon.find(".record-filter .userName-inp");
            var bTime = bTimeInp.val(),
                eTime = eTimeInp.val(),
                landId = landInp.attr("data-id"),
                idNum = $.trim( idNumInp.val() ),
                name = $.trim( nameInp.val() );
            if(bTime == ""){
                Tips.closeAllTips();
                Tips.show({
                    lifetime : 1500 ,
                    direction:'right',
                    hostObj :  bTimeInp ,
                    content : "请选择起始时间",
                    bgcolor : "#f0c245"
                });
                return false;
            }
            if(eTime == ""){
                Tips.closeAllTips();
                Tips.show({
                    lifetime : 1500 ,
                    direction:'right',
                    hostObj :  eTimeInp ,
                    content : "请选择结束时间",
                    bgcolor : "#f0c245"
                });
                return false;
            }
            if(!CR.judgeTrue(landId)){
                Tips.closeAllTips();
                Tips.show({
                    lifetime : 1500 ,
                    direction:'right',
                    hostObj :  landInp ,
                    content : "请选择产品",
                    bgcolor : "#f0c245"
                });
                return false;
            }
            _this.recordParamHub.lid = landId;
            _this.recordParamHub.btime = new Date(bTime.replace(/\-/g,"/")).getTime() / 1000;
            _this.recordParamHub.etime = Math.floor( ( new Date(eTime.replace(/\-/g,"/")).getTime() + 1000*60*60*24-1)/1000 );
            _this.recordParamHub.name = name;
            _this.recordParamHub.id_card = idNum;
            _this.recordParamHub.page = 1;
            _this.getRecordData()

        });

        //点击读卡
        CON.on("click" ,".filter-box .get-idNum" ,function (e) {
            readIdCard1.doSend('{"cmd":"idread"}');
        });
        recordCon.on("click" ,".record-filter .get-idNum" ,function (e) {
            readIdCard2.doSend('{"cmd":"idread"}');
        });

        readIdCard1.on("socketMessage" ,function (data) {
            CON.find(".filter-box .idNum-inp").val(data.code);
            CON.find(".filter-box .userName-inp").val(data.name);
        }) ;
        readIdCard2.on("socketMessage" ,function (data) {
            recordCon.find(".record-filter .idNum-inp").val(data.code);
            recordCon.find(".record-filter .userName-inp").val(data.name);
        })

    },

    /**
     * 获取产品列表数据
     */
    getLandsData: function () {
        var _this = this;
        $.ajax({
            url: CR.url.getLand,    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: {},    //参数值
            type: "GET",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                // 请求成功时处理
                _this.landListData = res.data;
                
                //初始化处理
                _this.mainLandSelect = new Select({
                    height:300,
                    field : {
                        id : "id",
                        name : "title",
                        keyword : "title"
                    },
                    trigger : $("#landInpMain"),
                    data: _this.landListData
                });
                _this.recordLandSelect = new Select({
                    height:300,
                    field : {
                        id : "id",
                        name : "title",
                        keyword : "title"
                    },
                    trigger : $("#landInpRecord"),
                    data: _this.landListData
                });
                _this.container.find(".ticket-record-wrap .record-filter .search-btn").click();
            },
            complete: function(res,status) {
                //请求完成的处理
                if(status=="timeout"){
                    Message.warning("获取产品列表数据，请求超时");
                }
            },
            error: function() {
                //请求出错处理
                Message.warning("获取产品列表数据，请求出错");
            }
        });
    },

    /**
     * @method 初始化日历
     */
    initDatepicker : function(){
        var _this = this;
        var beginInp = _this.container.find(".bTimeInp");
        var endInp = _this.container.find(".eTimeInp");
        var today = DatePicker.CalendarCore.gettoday();
        beginInp.val(today);
        endInp.val(today);
        var datepicker = this.datepicker = new DatePicker();
        this.container.on("click",".bTimeInp",function(e){
            var tarInp = $(this);
            var endtime = endInp.val();
            var date = tarInp.val();
            if(!date) date = today ;
            var max = endtime ? endtime.substr(0,10) : "";
            datepicker.open(date,{
                picker : tarInp,
                todayAfterDisable : false,
                max : max
            });
        });
        this.container.on("click",".eTimeInp",function(e){
            var tarInp = $(this);
            var beingTime = beginInp.val();
            var beginDate = beingTime.substr(0,10);
            var date = tarInp.val();
            if(!date) date = today ;
            var min = beingTime ? beingTime.substr(0,10) : "";
            datepicker.open(date,{
                picker : tarInp,
                todayAfterDisable : false,
                min : min
            });
        });
    },

    /**
     * @method 获取购票记录
     */
    getRecordData: function () {
        var _this = this;
        var params = _this.recordParamHub;
        var loadingStr = PFT.Util.LoadingPc("努力加载中...",{
            tag : "tr",
            colspan : 5,
            height : 200
        });
        //看看是否有缓存
        // if(_this.cacheHub[$.param(_this.paramHub)]){
        //     //render
        //     var res = _this.cacheHub[$.param(params)];
        //     dealRes( res );
        //     return false;
        // }else{
        //     //显示查询状态
        //     // _this.showLoading('loading');
        // }
        $.ajax({
            url: CR.url.getOrderRecord,    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: params,    //参数值
            type: "POST",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
                _this.recordTbody.html(loadingStr);
            },
            success: function(res) {
                // 请求成功时处理
                //缓存数据
                _this.cacheHub[$.param(params)] = $.extend({},res);
                dealRes( res )
            },
            complete: function(res,status) {
                //请求完成的处理
                // _this.hideLoading();
                if(status=="timeout"){
                    Message.alert("请求超时")
                }
            },
            error: function() {
                //请求出错处理
                _this.recordTbody.html("<tr><td colspan='5' style='height: 200px;text-align: center;font-size: 14px;color: orangered'>请求出错，请稍后重试...</td></tr>");
            }
        });

        function phpTimeStampToJs(phpTimeStamp){
            var stamp = Number(phpTimeStamp) * 1000;
            var now = new Date(stamp);
            var year = now.getFullYear();
            var month = now.getMonth()+1;
            var date = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            return   year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;

        }

        function dealRes( res ) {
            if(res.code == 200 ){
                var list = res.data.list;
                if(CR.judgeTrue(list)){
                    for(var i = 0 ; i < list.length ;i ++){
                        list[i].time = phpTimeStampToJs(list[i].time);
                    }
                    var html = _this.recordTemplate({data: res.data});
                    _this.recordTbody.html(html);
                    _this.pagination.render({current:res.data.page ,total: Math.ceil(Number(res.data.count) / _this.pageSize )});
                }else{
                    // _this.hideLoading();
                    _this.container.find(".record-pag-box").hide();
                    _this.recordTbody.html("<tr><td colspan='5' style='height: 200px;text-align: center;font-size: 14px;color: orangered'>暂无数据，请重新输入条件搜索</td></tr>");
                }
            }else{
                //通知queryState模块显示错误信息
                _this.recordTbody.html("<tr><td colspan='5' style='height: 200px;text-align: center;font-size: 14px;color: orangered'>"+res.msg+"</td></tr>");
                _this.container.find(".pag-box").hide();
            }
        }
    },

    /**
     * 读卡
     * @returns {boolean}
     */
    handleIdCard : function(){

        console.log("身份证阅读器");

        //开始链接控件
        var CertCtl = document.getElementById("CertCtl");
        if(CertCtl.connect){
            var connectResult = CertCtl.connect();

            connectResult = JSON.parse(connectResult);

            if( connectResult.resultFlag == 0 ){

                var readResult = CertCtl.readCert();
                readResult = JSON.parse(readResult);
                if(readResult.resultFlag == "0"){

                    var con = readResult.resultContent;

                    var idNum = con.certNumber;
                    var pic = con.identityPic;

                    $("#idNum").val(idNum);
                    $(".fileuploadTextInp").val(pic);
                    $("#ImgUpLoadIdCardBox").css("display","none");
                    $("#idCardReaderBox").html('<div style="color:red;font-size:20px;">上传中</div>').css("display","block");

                    //上传图片
                    PFT.Util.Ajax('/r/Resource_ImageUpload/uploadIdCard',{
                        type : "post",
                        params : {
                            id : idNum,
                            identify :"annualActive",
                            data : pic
                        },
                        loading : function(){
                        },
                        success : function(res){
                            var code = res.code;
                            var msg = res.msg;
                            var data = res.data;
                            var src = data.src;
                            console.log(src);
                            $("#ImgUpLoadIdCardBox").remove();
                            $("#idCardReaderBox").html('<img id="uploadPhotoImg" src="'+ src +'" ></img>');
                            alert("身份证头像上传成功");
                        },
                        complete : function(){
                        },
                        fail : function(res){
                            $("#ImgUpLoadIdCardBox").css("display","block");
                            $("#idCardReaderBox").css("display","none");
                            alert("身份证头像上传失败");
                        }
                    })

                }else{
                    alert("身份证信息获取失败，请将身份证放置在读卡器上再点击读取");
                }

            }else{
                alert("无法连接读卡器，请打开读卡器开关并插入USB口");
            }

        }else{
            alert("请使用IE浏览器或重新安装插件");
            return false
        }

    },
    cacheHub:{},
    recordParamHub: {
        page_size: 15
    },
    pageSize:15,
    recordTemplate: ParseTemplate(recordTb)






});

$(function () {
    new buyTicket();
});

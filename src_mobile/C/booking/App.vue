<template>
    <div id="bodyContainer" class="bodyContainer" v-if="!!pageReady">
        <div class="prodTtile pad15"><span class="t" v-text="orderInfo.title"></span></div>
        <div class="modBox attr">
            <input-line
                    v-if="p_type!=='C'"
                    :id="'beginTimeInp'"
                    :model.sync="calendar.date"
                    :type="'text'"
                    :label="beginTimeText"
                    :readonly="true"
                    :click="onBeginTimeInputClick"
                    :label-width="'80px'"
                    :icon="'rili'"
                    :icon-click="onBeginTimeIconClick"
                    :placeholder="'请选择日期'">
            </input-line>
            <input-line
                    v-if="p_type=='H'"
                    :model.sync="showPuct.selected_text"
                    :type="'text'"
                    :label="'场次时间'"
                    :readonly="true"
                    :click="onChangciInputClick"
                    :label-width="'80px'"
                    :icon="'jiantou-sin-right'"
                    :placeholder="'请选择场次'">
            </input-line>
            <input-line
                    v-if="p_type=='B'"
                    :model.sync="assStation.text"
                    :type="'text'"
                    :label="'集合地点'"
                    :readonly="true"
                    :click="onAssStationInpClick"
                    :label-width="'80px'"
                    :icon="'jiantou-sin-right'"
                    :placeholder="'请选择集合地点'">
            </input-line>
            <begintime-endtime
                    v-if="p_type=='C'"
                    :pid="pid"
                    :aid="aid"
                    :daycount.sync="hotel.daycount"
                    :begintime.sync="hotel.begintime"
                    :endtime.sync="hotel.endtime"
                    :switchor.sync="hotel.switchor"
                    :ticket-list.sync="ticketList"
                    v-on:begintime-click="onHotelBegintimeClick"
                    v-on:endtime-click="onHotelEndtimeClick">
            </begintime-endtime>
            <div class="buyDescBox pad15">
                <span class="validTime descFlag" v-text="orderInfo.validTime"></span>
                <span class="descFlag verifyTime" v-if="orderInfo.verifyTime!=''" v-text="orderInfo.verifyTime"></span>
                <span class="descFlag refund_rule" v-text="orderInfo.refund_rule_text"></span>
                <span class="descFlag batch_check_rule" v-if="orderInfo.batch_day && orderInfo.batch_day!=0" v-text="orderInfo.batch_day"></span>
                <span @click="refundRuleShow=true" class="descFlag refund_ruleBtn" v-if="orderInfo.refund_rule && orderInfo.refund_rule!=2">退票规则</span>
            </div>
        </div>

        <div class="ticketListBox" style="margin-top:5px">
            <ticket-list
                    :total-money.sync="totalMoney"
                    :need-id="needID"
                    :pid="pid"
                    :list.sync="ticketList">
            </ticket-list>
        </div>
        <div class="modBox" style="margin-top:5px;">
            <span id="addContactBtn" class="addContactBtn" @click="onAddContactBtnClick">+</span>
            <input-line
                    :id="'ordernameInp'"
                    :model.sync="submitData.ordername.value"
                    :type="'text'"
                    :label="'联系人'"
                    :label-width="'80px'"
                    :validator="'noBlank'"
                    :validate-type="'blur'"
                    :validate-reault.sync="submitData.ordername.validateResult"
                    :error-msg="'！必填'"
                    :placeholder="'联系人姓名'">
            </input-line>
            <input-line
                    :id="'mobileInp'"
                    :model.sync="submitData.contacttel.value"
                    :type="'number'"
                    :label="'手机号'"
                    :label-width="'80px'"
                    :validator="'typePhone'"
                    :validate-type="'blur'"
                    :validate-reault.sync="submitData.contacttel.validateResult"
                    :error-msg="'！手机号格式错误'"
                    :placeholder="'用于接收订单信息'">
            </input-line>
            <input-line
                    v-if="needID==1"
                    :id="'idcardInp'"
                    :model.sync="submitData.sfz.value"
                    :type="'text'"
                    :label="'身份证'"
                    :label-width="'80px'"
                    :validator="'idcard'"
                    :validate-type="'blur'"
                    :validate-reault.sync="submitData.sfz.validateResult"
                    :error-msg="'！格式错误'"
                    :placeholder="'身份证号'">
            </input-line>
            <input-line
                    v-if="needID==2"
                    :model.sync="calTourIdCard_text"
                    :type="'text'"
                    :icon="'jiantou-sin-right'"
                    :label="'游客信息'"
                    :readonly="true"
                    :click="onOpenSheetIdCard"
                    :label-width="'80px'">
            </input-line>
        </div>
        <div class="totalMoneyFixBar">
            <div class="con">
                总金额：<span style="color:#f37138"><i class="yen">&yen;</i><span style="font-size:0.4rem;" v-text="totalMoney"></span></span>
            </div>
            <div id="submitBtn" @click="onSubmitBtnClick" class="submitBtn">提交订单</div>
        </div>
        <sheet-idcard
                v-if="needID==2"
                :show.sync="sheetIdcardShow"
                :list.sync="ticketList">
        </sheet-idcard>

        <sheet-changci
                v-if="p_type=='H'"
                :pid="pid"
                :aid="aid"
                :date="calendar.date"
                v-on:changci-change="onChangeciChange"
                :show.sync="showPuct.sheetShow">
        </sheet-changci>

        <sheet-refundrule
                :show.sync="refundRuleShow"
                :rule-list="orderInfo.cancel_cost"
                :reb="orderInfo.reb"
                :reb_type="orderInfo.reb_type"
                v-if="orderInfo.refund_rule!=2">
        </sheet-refundrule>

        <sheet-action
                v-if="p_type=='B'"
                v-on:click="onassStationItemClick"
                :menus="assStation.menus"
                :cancel-text="'确定'"
                :align="'left'"
                :show.sync="assStation.show">
        </sheet-action>

        <sheet-calendar
                v-on:switch-day="onCalendarSwitchDay"
                :yearmonth.sync="calendar.yearmonth"
                :disable-todaybefore="true"
                :show.sync="calendar.show">
        </sheet-calendar>
        <sheet-contact
                v-on:select="onContactSheetSelect"
                :show.sync="contactSheet.show">
        </sheet-contact>
    </div>
</template>
<!--<script>-->
<script type="es6">
    import "./index.scss";
    let Toast = require("COMMON/modules/toast");
    let Alert = PFT.Mobile.Alert;
    let Confirm = PFT.Mobile.Confirm;
    let GetStoragePrice = require("SERVICE_M/booking-storage-price");
    let GetStoragePriceHotel = require("SERVICE_M/booking-storage-price-hotel");
    let GetOrderInfo = require("SERVICE_M/booking-orderinfo");
    let SubmitOrder = require("SERVICE_M/booking-submit-order");
    let NumberToFixed = require("COMMON/js/util.numberToFixed");
    let CalendarCore = require("COMMON/js/calendarCore");

    //2016-12-09新增需求  http://bug.12301.test/index.php?m=task&f=view&taskID=278
    var AlertTipWhenMobileIsFenxiao = function(){
        //判断是否在微信内置浏览器内
        var isWXBrowser = /micromessenger/.test(navigator.userAgent.toLowerCase());
        if(isWXBrowser){ //如果在微信内
            PFT.Mobile.Alert(function(){
                var html = "";
                html += '<div class="tipBtnGroup">';
                html += '<a class="tipBtn goon" javascript:void(0)>以散客身份继续购票</a>';
                html += '<a class="tipBtn replace" javascript:void(0)>更换手机号</a>';
                html += '</div>';
                return html;
            },"您所填写的手机号已绑定为平台用户，您可以选择：");
        }else{
            PFT.Mobile.Alert("您所填写的手机号已绑定为平台用户，请更换手机号");
        }
    };

    export default {
        data(){
            return {
                pageReady : false,
                aid : PFT.Util.UrlParse()["aid"] || "",
                pid : PFT.Util.UrlParse()["pid"] || "",
                p_type : "",
                needID : -1,
                calendar : {
                    date : "",
                    yearmonth : "",
                    show : false
                },
                ticketList : [],
                totalMoney : 0,
                submitData : {
                    //联系人手机号
                    contacttel : {
                        value : "",
                        validateResult : -1
                    },
                    //联系人姓名
                    ordername : {
                        value : "",
                        validateResult : -1
                    },
                    //联系人身份证
                    sfz : {
                        value : "",
                        validateResult : -1
                    }
                },
                refundRuleShow : false,
                sheetIdcardShow : false,

                contactSheet : {
                    show : false
                },

                orderInfo : {}, //以上为各个产品类型的公用数据


                //演出类产品
                showPuct : {
                    selected_text : "",
                    sheetShow : false
                },
                //酒店类产品，
                hotel : {
                    switchor : "",
                    daycount : 1,  //入住天数
                    begintime : CalendarCore.gettoday(),
                    endtime : CalendarCore.nextDay()
                },
                //线路类产品 集合地点
                assStation : {
                    show : false,
                    menus : {},
                    text : ""
                }
            }
        },
        ready(){






            this.toast = new Toast();
            GetOrderInfo(this.pid,this.aid,{
                loading : ()=>{
                    this.toast.show("loading","努力加载中...")
                },
                complete : ()=>{
                    this.toast.hide()
                },
                success : (data)=>{
                    this.p_type = data.p_type;
                    this.orderInfo = data;
                    //如果返回的是限制时段，更改游玩日期
                    //if(data.validTime.search("~")>-1){
                         //this.calendar.date=data.validTime.match(/[\d\-]+/)[0]
                    //}
                    this.needID = data.needID;

                    //现在开始日期也从服务端返回 2017-01-17
                    this.calendar.date = data.startDate;

                    this.ticketList = this.adaptListData(data.tickets);
                    if(data.assStation){
                        var assStationMenus = {};
                        data.assStation.forEach(function(item,index){
                            assStationMenus[index] = item;
                        })
                        this.assStation.menus = assStationMenus;
                    }
                    this.pageReady = true;
                    if(this.p_type=='C'){
                        this.queryStoragePrice_Hotel();
                    }else{
                        this.onCalendarSwitchDay({date:this.calendar.date});
                    }

                    //微信自定义分享
                    var title = data.title;
                    document.title = title;
                    PFT.CustomWXShare.init({
                        title : title,
                        desc : title,
                        //imgUrl : data.imgpath,  暂时还没有产品图片这个字段，需要后端提供
                        link : GetWXShareLinkUrl()
                    });






                },
                fail : (msg)=>{
                    Alert(msg);
                }
            });


            //2016-12-09新增需求  http://bug.12301.test/index.php?m=task&f=view&taskID=278
            $(document).on("click",".tipBtnGroup .tipBtn",function(e){
                var tarBtn = $(e.currentTarget);
                var orignText = tarBtn.text();
                if(tarBtn.hasClass("replace")){
                    $("#pui-m-alertBox").find(".alertFoot").trigger("click");
                    $("#mobileInp").focus();
                }else{
                    PFT.Util.Ajax("/r/Mall_Member/resellerUseSankeAccountLogin/",{
                        type : "post",
                        params : {
                            token : PFT.Util.getToken()
                        },
                        loading : function(){
                            tarBtn.text("正在请求微信授权，请稍后...");
                        },
                        complete : function(){
                            tarBtn.text(orignText);
                        },
                        success : function(res){
                            var code = res.code;
                            var msg = res.msg || PFT.AJAX_ERROR_TEXT;
                            var data = res.data;
                            //"code":401,200,  200:成功；401：非法访问/请换号码登录
                            if(code==200){
                                window.location.href = "http://" + data.url;
                            }else if(code==401){
                                Alert(msg);
                            }
                        },
                        tiemout : function(){
                            Alert(PFT.AJAX_TIMEOUT_TEXT);
                        },
                        serverError : function(){
                            Alert(PFT.AJAX_ERROR_TEXT);
                        }
                    })
                }
            })
        },
        computed : {
            pids(){
                var pids = [];
                this.ticketList.forEach((item,index)=>{
                    pids.push(item.pid)
                });
                return pids.join("-");
            },
            beginTimeText(){
                return {
                    A : "游玩日期",
                    F : "游玩日期",
                    H : "演出日期",
                    B : "集合日期"
                }[this.p_type];
            },
            calTourIdCard(){
                var total = 0;
                var completed = 0;
                this.ticketList.forEach((item,index) =>{
                    total += item.count;
                    var tourMsg = item.tourMsg;
                    if(tourMsg){
                        tourMsg.forEach((tour,_index) =>{
                            let name = tour.name;
                            let idcard = tour.idcard;
                            if(name && idcard && PFT.Util.Validate.idcard(idcard)) completed += 1;
                        })
                    }
                })
                return {
                    total : total,
                    completed : completed
                };
            },
            calTourIdCard_text(){
                var calTourIdCard = this.calTourIdCard;
                return "已编辑"+calTourIdCard.completed+"/"+calTourIdCard.total;
            }
        },
        methods : {
            onOpenSheetIdCard(){
                this.sheetIdcardShow = true;
            },
            onBeginTimeInputClick(e){
                this.calendar.show = true;
                this.calendar.yearmonth = e.target.value;
            },
            onBeginTimeIconClick(e){
                this.calendar.show = true;
                this.calendar.yearmonth = this.calendar.date;
            },
            onChangciInputClick(e){
                this.showPuct.sheetShow = true;
            },
            onAssStationInpClick(e){
                this.assStation.show = true;
            },
            onassStationItemClick(key,text){
                this.assStation.text = text;
            },
            onHotelBegintimeClick(e){
                this.hotel.switchor = "begin";
                this.calendar.yearmonth = this.hotel.begintime;
                this.calendar.show = true;
            },
            onHotelEndtimeClick(e){
                this.hotel.switchor = "end";
                this.calendar.yearmonth = this.hotel.endtime;
                this.calendar.show = true;
            },
            onContactSheetSelect(data){
                var mobile = data.mobile;
                var name = data.name;
                this.contactSheet.show = false;
                this.submitData.ordername.value = name;
                this.submitData.ordername.validateResult = 1;
                this.submitData.contacttel.value = mobile;
                this.submitData.contacttel.validateResult = 1;
            },
            //当日历改变日期时
            onCalendarSwitchDay(data){
                var date = this.calendar.date = data.date;
                var p_type = this.p_type;
                if(p_type=="A" || p_type=="F" || p_type=="B"){ //景点||套票产品||线路
                    if(!date || !this.pids || !this.aid) return false;
                    GetStoragePrice({
                        pids : this.pids,
                        aid : this.aid,
                        date : date
                    },{
                        loading : () =>{
                            this.toast.show("loading","努力加载中...");
                        },complete : () =>{
                            this.toast.hide();
                        },success : (data) =>{
                            this.updateTicketList(data);
                        }
                    })
                }else if(p_type=="H"){
                    this.ticketList.forEach((ticket,index) =>{
                        var price = data.price;
                        if(typeof price!=="undefined") ticket["jsprice"] = data.price;
                    })
                    //接下来什么事都不做，data.dete的变化会映射到calendar.date
                    //而calendar.date已通过v-model绑定到子组件sheet-changci里了
                    //此时sheet-changci里已watch date的变化去自动调用queryChangciList方法
                }else if(p_type=="C"){ //酒店类产品
                    this.calendar.yearmonth = date;
                    var begintime = this.hotel.begintime;
                    var begintime_s = +new Date(begintime);
                    var endtime = this.hotel.endtime;
                    var endtime_s = +new Date(endtime);
                    var date_s = +new Date(date);
                    if(this.hotel.switchor=="begin"){
                        if(date_s>=endtime_s){
                            this.hotel.endtime = (function(){
                                var _begintime = new Date(date);
                                var endtime = new Date(_begintime.getTime()+24*60*60*1000);
                                var year = endtime.getFullYear();
                                var month = endtime.getMonth()*1+1;
                                var day = endtime.getDate();
                                if(month<10) month = "0"+month;
                                if(day<10) day = "0"+day;
                                var result = year+"-"+month+"-"+day;
                                return result;
                            })();
                        }
                        this.hotel.begintime = date;
                    }else{ //切换的是离店时间
                        if(date_s<=begintime_s) return Alert("离店时间必须晚于入住时间");
                        this.hotel.endtime = date;
                    }
                    var daycount = +new Date(this.hotel.endtime) - (+new Date(this.hotel.begintime));
                    daycount = daycount / (24 * 60 *60 * 1000);
                    this.hotel.daycount = daycount;


                    //修改入住时间或离店时间都会重新请求一次价格跟库存
                    this.queryStoragePrice_Hotel();

                    //this.$broadcast("calendar-date-switch",data);
                }
            },
            //当场次变化时
            onChangeciChange(data,msg){
                var round_name = data.round_name;
                var bt = data.bt || "";
                var et = data.et || "";
                var area_storage = data.area_storage;
                var ticketList = this.ticketList;

                if(typeof data!=="string"){
                    this.showPuct.selected_text = round_name+" "+bt+" - "+et;
                    ticketList.forEach((ticket,index) =>{
                        var result = {};
                        var pid = ticket.pid;
                        var zone_id = ticket.zone_id;
                        if(!zone_id) return false;
                        var storage = area_storage[zone_id];
                        if(typeof storage==="undefined") return false;
                        result[pid] = {};
                        result[pid]["store"] = storage;
                        this.updateTicketList(result);
                    })
                }else{
                    if(data=="fail"){
                        this.showPuct.selected_text = msg;
                    }else if(data=="empty"){
                        this.showPuct.selected_text = "暂无演出场次信息";
                    }
                }
            },
            onAddContactBtnClick(e){
                this.contactSheet.show = true;
            },
            //酒店类产品 修改入住时间或离店时间都会重新请求一次价格跟库存
            queryStoragePrice_Hotel(){
                var pid = this.pid;
                var aid = this.aid;
                var beginDate = this.hotel.begintime;
                var endDate = this.hotel.endtime;
                GetStoragePriceHotel({
                    pid : pid,
                    aid : aid,
                    beginDate : beginDate,
                    endDate : endDate
                },{
                    loading : () => { this.toast.show("loading","努力加载中...")},
                    success : (data) => {
                        this.toast.hide();

                        var price = data.jsprice;

                        var store = (function(){
                            var storage = data.store;
                            var storeArray = [];
                            for(var i in storage) storeArray.push(storage[i]);
                            var daycount = storeArray.length;

                            var getStoreMin = function(array){
                                if(array.length==0) return null;
                                var no_limit_arr = [];
                                var limit_arr = [];
                                array.forEach(function(item,index){
                                    if(item==-1) no_limit_arr.push(item);
                                    if(item!=-1) limit_arr.push(item);
                                })
                                //都为-1
                                if(no_limit_arr.length==array.length) return -1;
                                return Math.min.apply({},limit_arr);
                            };

                            var storeMin = getStoreMin(storeArray);

                            if(daycount==1){ //预订1天
                                return{
                                    daycount : daycount,
                                    storeNum : storeArray[0],
                                    storeText : ""
                                }
                            }else{ //预订1天以上

                                //在多天中只要有一天库存为0(没有库存)，即视为用户选择的时间段内没有库存，无法下单
                                //有问题请 @产品-詹必魁
                                if(storeMin==0){
                                    return{
                                        daycount : daycount,
                                        storeNum : 0,
                                        storeText : "无"
                                    }
                                }else{ //如果选择的时间段内都有库存(包含不限库存)，库存取最小的那天
                                    if(storeMin==-1){ //时间段内每一天库存都为不限(都为-1)
                                        return{
                                            daycount : daycount,
                                            storeNum : -1,
                                            storeText : ""
                                        }
                                    }else{ //如果时间段内有不限的 也有 具体库存的，取具体库存最小值,但是页面上只要显示"有" 有问题请@产品-詹必魁
                                        return{
                                            daycount : daycount,
                                            storeNum : storeMin,
                                            storeText : "有"
                                        }
                                    }
                                }
                            }
                        })();

                        var updateData = {};
                        var d = updateData[this.ticketList[0]["pid"]] = {}; //酒店类产品永远只能下单票，不存在连票  所以这里只选定ticketList的第一个元素
                        d["price"] = price;
                        d["store"] = store.storeNum;
                        d["storeText"] = store.storeText;

                        this.updateTicketList(updateData);


                    },
                    fail : (msg) => {
                        this.toast.hide();
                        Alert(msg);
                    }
                })
            },
            updateTicketList(data){
                //data = {
                //    pid1 : {
                //        price : "",
                //        store : "",
                //        storeText : ""  酒店类产品需要用到此字段
                //    },
                //    pid2 : {
                //        price : "",
                //        store : "",
                //        storeText : ""  酒店类产品需要用到此字段
                //    }
                //};
                var list = this.ticketList;
                for(var i in list){
                    var pid = list[i]["pid"];
                    var obj = data[pid];
                    if(!obj) continue;
                    var store = obj.store * 1;
                    var buy_up = list[i]["buy_up"] * 1;
                    var buy_low = list[i]["buy_low"] * 1;
                    if(typeof obj.price!=="undefined") list[i]["jsprice"] = obj.price;
                    if(typeof obj.storeText!=="undefined") list[i]["storeText"] = obj.storeText;
                    //日历切换后，更新第一张票的购买数量
                    if (i == 0 && list[i]["count"] <= 0) {
						list[i]["count"] = buy_low;
					}
                    list[i]["storage"] = store;
                    if(store== -1){
                        if(buy_up!= -1){ //限制最多购买张数
                            list[i]["max"] = buy_up;
                        }else{
                            list[i]["max"] = -1;
                        }
                    }else{
                        if(buy_up!= -1){
                            list[i]["max"] = Math.min(store,buy_up);
                        }else{
                            list[i]["max"] = store;
                        }
                    }
                }
            },
            adaptListData(list){
                var result = [];
                var totalMoney = 0;
                list.forEach((item,index) => {
                    var json = {};
                    var buy_up = item.buy_up;   //限制最大购买张数(即一次最多只能购买多少张)
                    var buy_low = item.buy_low; //限制最少购买张数(即一次最少需要购买多少张)
                    if(buy_low==0) item["buy_low"] = -1;//后端返回0时，即表示不限 (这里要我吐槽一下坑爹的后端，一会是-1 一会是0)
                    if(buy_up==0) item["buy_up"] = -1;
                    json["max"] = (buy_up==-1) ? -1 : buy_up * 1;
                    json["min"] = (buy_low==-1) ? -1 : buy_low * 1;
                    json["can_0"] = index==0 ? false : true;
                    json["storage"] = -1;
                    json["storeText"] = "";
                    json["count"] = index==0 ? json["min"] : 0;
                    if(this.needID==2){
                        json["tourMsg"] = [];
                        for(var i=0; i<json["count"]; i++){
                            json["tourMsg"].push({
                                idcard : "",
                                name : ""
                            })
                        }
                    }
                    for(var i in item){
                        json[i] = item[i];
                    }
                    totalMoney += json["count"] * item.jsprice;
                    result.push(json);
                })

                //计算页面初始化时的总金额
                this.totalMoney = Number(NumberToFixed(totalMoney,2));

                return result;
            },

            //提交订单
            onSubmitBtnClick(e){


                //var host = "";
                //var hostname = window.location.hostname;
                //if(hostname.split(".")[0]=="wx"){
                //    host = hostname;
                //}else{
                //    host = hostname + "/wx";
                //}
                //var __ordernum = "3330351";
                //return window.location.href="http://"+host+"/html/order_pay_c.html?ordernum="+__ordernum+'&h='+window.location.hostname;

                var submitBtn = e.target;
                if(submitBtn.classList.contains("disable")) return false;
                var p_type = this.p_type;
                var needID = this.needID;
                var $$ = function(selector){ return document.getElementById(selector)};
                var ticketList = this.ticketList;
                var ticketListUl = $$("ticketListUl");
                var tnum = ticketList[0]["count"];

                //首先判断购买数量
                if(tnum==0) return Alert("主票预订票数不能为0");

                //获取开始时间 结束时间
                var begintime = p_type!="C" ? $$("beginTimeInp").value : this.hotel.begintime;
                var endtime = p_type!="C" ? null : this.hotel.endtime;

                //联系人，手机号，身份证
                var ordernameInp = $$("ordernameInp");
                var mobileInp = $$("mobileInp");
                var idcardInp = $$("idcardInp");
                var ordername = ordernameInp.value;
                var mobile = mobileInp.value;
                var sfz = idcardInp ? idcardInp.value : "";
                if(!ordername) return Alert("请填写联系人姓名");
                if(!mobile) return Alert("请填写取票人手机号");
                if(idcardInp && !sfz) return Alert("请填写取票人身份证");
                if(!PFT.Util.Validate.typePhone(mobile)) return Alert("请输入正确格式手机号");
                if(idcardInp && !PFT.Util.Validate.idcard(sfz)) return Alert("取票人身份证格式错误");

                //提交数据之前，先把用户填写的联系人保存在localStorage
                this.$broadcast("orderBtn.click",{name:ordername,mobile:mobile});



                //需要多张身份证时  每张身份证都需要填写姓名跟身份证
                if(needID==2){
                    var tourMsgContainer = $$("tourMsgContainer");
                    var items = tourMsgContainer.querySelectorAll(".idcardItem");
                    var tourMsgArray = [].map.call(items,function(item,index){
                        var name = item.querySelector(".nameInp").value;
                        var idcard = item.querySelector(".idcardInp").value;
                        return{
                            name : name,
                            idcard : idcard
                        }
                    });
                    var idcards = tourMsgArray.map(function(item,index){ return item.idcard});
                    var isUnique = (function(){
                        var json = {};
                        var result = true;
                        for(var i=0; i<idcards.length; i++){
                            if(json[idcards[i]]){
                                result = false;
                                break;
                            }else{
                                json[idcards[i]] = true;
                            }
                        }
                        return result;
                    })();
                    if(!isUnique){ //如果身份证有重复
                        return Alert("游客信息里，身份证重复");
                    }



                    var tourists = tourMsgArray.map(function(item,index){ return item.name});
                    var idcards_available = idcards.every(function(item,index){
                        return PFT.Util.Validate.idcard(item);
                    });
                    var tourists_available = tourists.every(function(item,index){
                        return item!="";
                    });
                    if(!tourists_available) return Alert("游客信息里，姓名不能为空");
                    if(!idcards_available) return Alert("游客信息里，身份证填写有误");

                }

                //获取联票数据
                var link = {};
                [].forEach.call(ticketListUl.querySelectorAll(".item"),function(item,index){
                    if(index==0) return false;
                    var pid = item.getAttribute("data-pid");
                    var count = item.querySelector(".countInp").value;
                    if(count!=0) link[pid] = count;
                })



                //开始提交数据
                var submitData = {
                    pid : this.pid,
                    aid : this.aid,
                    tnum : tnum,               //主票购买张数
                    begintime : begintime,     //开始时间
                    contacttel : mobile,       //取票人手机号
                    ordername : ordername      //联系人姓名
                };
                if(needID==1) submitData["sfz"] = sfz; //需要一张身份证
                if(needID==2){ //需要多张身份证
                    submitData["idcards"] = idcards;
                    submitData["tourists"] = tourists;
                }
                if(!PFT.Util.isEmptyObject(link)) submitData["link"] = link; //如果有下连票

                if(p_type=="C") submitData["endtime"] = endtime;  //酒店产品加入结束时间

                if(p_type=="H"){ //演出类产品
                    //演出类产品 获取场馆id 场次id 分区id
                    var selectChangciItem = [].filter.call($$("changciLiContainer").querySelectorAll(".changciItem"),function(item,index){
                        return item.classList.contains("selected");
                    })[0];
                    if(!selectChangciItem) return Alert("请选择场次");
                    var zoneid = ticketList[0]["zone_id"];  //分区id
                    var roundid = selectChangciItem.getAttribute("data-roundid"); //场馆id
                    var venusid = selectChangciItem.getAttribute("data-venusid"); //场次id
                    submitData["zoneid"] = zoneid;
                    submitData["roundid"] = roundid;
                    submitData["venusid"] = venusid;
                }

                //return console.log(submitData);

                //从localStorage里取parentId 如果存在此值，表明当前页面是用户从分享链接进来的，parentId即为分享者的id
                var parentId = window.localStorage.getItem("PFT-MALL-C-FENX");
                if(parentId) submitData["parentId"] = parentId;



                //开始提交数据
                SubmitOrder(submitData,{
                    loading : () => {
                        this.toast.show("loading","正在提交订单...");
                        submitBtn.classList.add("disable");
                    },
                    complete : () => {
                        this.toast.hide();
                    },
                    success : (data) => {
                        var ordernum = data.ordernum;
                        var paymode = data.paymode;
                        var host = "";
                        var hostname = window.location.hostname;
                        if(hostname.split(".")[0]=="wx"){
                            host = hostname;
                        }else{
                            host = hostname + "/wx";
                        }
                        var ordernum = data.ordernum;
                        if(paymode==4){
                            window.location.href = "ordersuccess.html?ordernum="+ordernum+"&paymode=1";
                        }else{
                            window.location.href="http://"+host+"/html/order_pay_c.html?ordernum="+ordernum+'&h='+hostname;
                        }
                    },
                    fail : (code,msg) => {
                        if(code>=400){ //重复下单  这种情况下页面不允许再提交订单，提交按钮需禁用
                            Alert(msg);
                        }else{
                            if(code==205){ //如果所填写的手机号是分销商
                                AlertTipWhenMobileIsFenxiao();
                            }else{ //一般错误
                                Alert(msg);
                            }
                            submitBtn.classList.remove("disable");
                        }
                    }
                })
            }
        },
        components : {
            sheetCalendar : require("COMMON_VUE_COMPONENTS/sheet-calendar"),
            sheetAction : require("COMMON_VUE_COMPONENTS/sheet-action"),
            ticketList : require("COMMON_VUE_COMPONENTS/ticket-list-booking"),
            sheetIdcard : require("COMMON_VUE_COMPONENTS/sheet-booking-idcard"),
            begintimeEndtime : require("./components/begintime-endtime"),
            inputLine : require("./components/input-line"),
            sheetRefundrule : require("./components/sheet-refund-rule"),
            sheetChangci : require("./components/sheet-changci"),
            sheetContact : require("./components/sheet-contact")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/main";
    .modBox{
        position:relative;
        .addContactBtn{
            position:absolute;
            z-index:10;
            display:block;
            top:9px;
            right:10px;
            width:30px;
            height:30px;
            line-height:30px;
            text-align:center;
            color:$blue;
            font-size:24px;
            font-weight:bold;
            &:active{
                background:$gray90;
            }
        }
    }
    .modBox.attr{
        margin-top:10px;
        background:#f5f5f5;
        border-top:1px solid #e5e5e5;
    }
    .tipBtnGroup{
        .tipBtn{
            display:block;
            width:180px;
            height:32px;
            line-height:32px;
            color:$blue;
            border:1px solid $blue;
            margin:0 auto;
            &:first-child{
                margin-top:10px;
                 margin-bottom:15px;
             }
        }
    }
</style>

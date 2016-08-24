<template>
    <div id="bodyContainer" class="bodyContainer" v-if="!!pageReady">
        <div class="prodTtile pad15"><span class="t" v-text="orderInfo.title"></span></div>
        <div class="modBox">
            <input-line
                    v-if="p_type!=='C'"
                    :model.sync="calendar.date"
                    :type="'text'"
                    :label="beginTimeText"
                    :readonly="true"
                    :click="onBeginTimeInputClick"
                    :label-width="'80px'"
                    :icon="'rili'"
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
            <input-line
                    :model.sync="submitData.ordername.value"
                    :type="'text'"
                    :label="'联系人'"
                    :label-width="'80px'"
                    :validator="'noBlank'"
                    :validat-type="'blur'"
                    :validat-reault.sync="submitData.ordername.validatResult"
                    :error-msg="'！必填'"
                    :placeholder="'联系人姓名'">
            </input-line>
            <input-line
                    :model.sync="submitData.contacttel.value"
                    :type="'number'"
                    :label="'手机号'"
                    :label-width="'80px'"
                    :validator="'typePhone'"
                    :validat-type="'blur'"
                    :validat-reault.sync="submitData.contacttel.validatResult"
                    :error-msg="'！手机号格式错误'"
                    :placeholder="'用于接收订单信息'">
            </input-line>
            <input-line
                    v-if="needID==1"
                    :model.sync="submitData.sfz.value"
                    :type="'text'"
                    :label="'身份证'"
                    :label-width="'80px'"
                    :validator="'idcard'"
                    :validat-type="'blur'"
                    :validat-reault.sync="submitData.sfz.validatResult"
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
                :rule-list="orderInfo.cancel_cost.length ? orderInfo.cancel_cost : orderInfo.reb"
                v-if="orderInfo.refund_rule!=2">
        </sheet-refundrule>

        <sheet-calendar
                v-on:switch-day="onCalendarSwitchDay"
                :yearmonth.sync="calendar.yearmonth"
                :disable-todaybefore="true"
                :show.sync="calendar.show">
        </sheet-calendar>
    </div>
</template>

<script type="es6">
    import "./index.scss";
    let Toast = require("COMMON/modules/toast");
    let GetStoragePrice = require("SERVICE_M/booking-storage-price");
    let GetStoragePriceHotel = require("SERVICE_M/booking-storage-price-hotel");
    let GetOrderInfo = require("SERVICE_M/booking-orderinfo");
    export default {
        data(){
            return {
                pageReady : false,
                aid : PFT.Util.UrlParse()["aid"] || "",
                pid : PFT.Util.UrlParse()["pid"] || "",
                p_type : "",
                needID : -1,
                calendar : {
                    date : "2016-08-15",
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
                orderInfo : {},
                sheetIdcardShow : false,//以上为各个产品类型的公用数据

                //演出类产品
                showPuct : {
                    selected_text : "",
                    sheetShow : false
                },
                //酒店类产品，
                hotel : {
                    switchor : "",
                    daycount : 2,  //入住天数
                    begintime : "2016-08-23",
                    endtime : "2016-08-25"
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
                    this.needID = data.needID;
                    this.ticketList = this.adaptListData(data.tickets);
                    this.pageReady = true;
                    if(this.p_type=='C') this.queryStoragePrice_Hotel();
                },
                fail : (msg)=>{
                    alert(msg);
                }
            })
        },
        computed : {
            pids(){
                var pids = [];
                this.ticketList.forEach((item,index)=>{
                    pids.push(item.pid)
                });
                return pids.join(",");
            },
            beginTimeText(){
                return {
                    A : "游玩日期",F : "游玩日期",H : "演出日期",B : "集合日期"
                }[this.p_type];
            },
            calTourIdCard(){
                var total = 0;
                var completed = 0;
                this.ticketList.forEach((item,index) =>{
                    total += item.count;
                    item.tourMsg.forEach((tourMsg,_index) =>{
                        let name = tourMsg.name;
                        let idcard = tourMsg.idcard;
                        if(name && idcard && PFT.Util.Validate.idcard(idcard)) completed += 1;
                    })
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
            onChangciInputClick(e){
                this.showPuct.sheetShow = true;
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
            //当日历改变日期时
            onCalendarSwitchDay(data){
                var date = this.calendar.date = data.date;
                var p_type = this.p_type;
                if(p_type=="A" || p_type=="F" || p_type=="B"){ //景点||套票产品||线路
                    if(!date || !this.pids || !this.aid) return false;
                    GetStoragePrice(this.p_type,{
                        pids : this.pids,
                        aid : this.aid,
                        date : date
                    },{
                        loading : () =>{
                            this.toast.show("loading","努力加载中...")
                        },complete : () =>{
                            this.toast.hide()
                        },success : (data) =>{
                            this.updateTicketList(data)
                        }
                    })
                }else if(p_type=="H"){

                    this.ticketList.forEach((ticket,index) =>{
                        ticket["jsprice"] = data.price;
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
                        if(date_s<=begintime_s) return alert("离店时间必须晚于入住时间");
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
            onChangeciChange(data){
                var round_name = data.round_name;
                var bt = data.bt || "";
                var et = data.et || "";
                var area_storage = data.area_storage;
                var ticketList = this.ticketList;
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
            },

            //酒店类产品 修改入住时间或离店时间都会重新请求一次价格跟库存
            queryStoragePrice_Hotel(){
                var pid = this.pid;
                var aid = this.aid;
                var beginDate = this.begintime;
                var endDate = this.endtime;
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
                                    if(storeMin==-1){ //时间段内每一天库存都为不限
                                        return{
                                            daycount : daycount,
                                            storeNum : -1,
                                            storeText : "有"
                                        }
                                    }else{ //如果时间段内有不限的 也有 具体库存的，取具体库存最小值
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
                        alert(msg);
                    }
                })
            },
            updateTicketList(data){
                console.log(data);
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
                    for(var i in item) json[i] = item[i];
                    result.push(json);
                })
                return result;
            },

            //提交订单
            onSubmitBtnClick(e){

            }
        },
        components : {
            sheetCalendar : require("COMMON_VUE_COMPONENTS/sheet-calendar"),
            ticketList : require("COMMON_VUE_COMPONENTS/ticket-list-booking"),
            sheetIdcard : require("COMMON_VUE_COMPONENTS/sheet-booking-idcard"),
            begintimeEndtime : require("./components/begintime-endtime"),
            inputLine : require("./components/input-line"),
            sheetRefundrule : require("./components/sheet-refund-rule"),
            sheetChangci : require("./components/sheet-changci")
        }
    }
</script>

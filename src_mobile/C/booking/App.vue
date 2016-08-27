<template>
    <div id="bodyContainer" class="bodyContainer" v-if="orderInfoState=='success'">
        <div class="prodTtile pad15"><span class="t" v-text="orderInfo.title"></span></div>
        <div class="modBox">
            <input-line
                    v-if="p_type!=='C'"
                    :model.sync="beginCalendar.date"
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
            <div class="buyDescBox pad15">
                <span class="validTime descFlag" v-text="orderInfo.validTime"></span>
                <span class="descFlag verifyTime" v-if="orderInfo.verifyTime!=''" v-text="orderInfo.verifyTime"></span>
                <span class="descFlag refund_rule" v-text="orderInfo.refund_rule_text"></span>
                <span @click="refundRuleShow=true" class="descFlag refund_ruleBtn" v-if="orderInfo.refund_rule && orderInfo.refund_rule!=2">退票规则</span>
            </div>
        </div>

        <div class="ticketListBox" style="margin-top:5px">
            <ticket-list :total-money.sync="totalMoney" :need-id="needID" :pid="pid" :list.sync="ticketList"></ticket-list>
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
                    :click="openSheetIdCard"
                    :label-width="'80px'">
            </input-line>
        </div>
        <div class="totalMoneyFixBar">
            <div class="con">
                总金额：<span style="color:#f37138"><i class="yen">&yen;</i><span style="font-size:0.4rem;" v-text="totalMoney"></span></span>
            </div>
            <div id="submitBtn" @click="onSubmitBtnClick" class="submitBtn">提交订单</div>
        </div>



        <sheet-idcard v-if="needID==2" :show.sync="sheetIdcardShow" :list.sync="ticketList"></sheet-idcard>

        <sheet-changci
                :pid="pid"
                :aid="aid"
                :date="beginCalendar.date"
                v-on:changci-change="onChangeciChange"
                :show.sync="showPuct.sheetShow">
        </sheet-changci>

        <sheet-refundrule
                :show.sync="refundRuleShow"
                :rule-list="orderInfo.cancel_cost.length ? orderInfo.cancel_cost : orderInfo.reb"
                v-if="orderInfoState=='success' && orderInfo.refund_rule!=2">
        </sheet-refundrule>

        <sheet-calendar
                v-on:switch-day="onBeginTimeChange"
                :yearmonth.sync="beginCalendar.yearmonth"
                :show.sync="beginCalendar.show">
        </sheet-calendar>
    </div>
</template>

<script type="es6">
    import "./index.scss";
    let Toast = require("COMMON/modules/toast");
    let GetStoragePrice = require("SERVICE_M/booking-storage-price");
    let GetOrderInfo = require("SERVICE_M/booking-orderinfo");
    export default {
        data(){
            return {
                aid : PFT.Util.UrlParse()["aid"] || "",
                pid : PFT.Util.UrlParse()["pid"] || "",
                p_type : "",
                needID : -1,
                beginCalendar : {
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
                orderInfoState : "",
                orderInfo : {},
                sheetIdcardShow : false,
                //以上为各个产品类型的公用数据

                //演出类产品
                showPuct : {
                    selected_text : "",
                    sheetShow : false
                }
            }
        },
        ready(){
            this.toast = new Toast();
            GetOrderInfo(this.pid,{
                loading : ()=> {
                    this.orderInfoState = "loading";
                    this.toast.show("loading","努力加载中...")
                },
                complete : ()=> { this.toast.hide()},
                success : (data)=> {
                    this.p_type = data.p_type;
                    this.orderInfo = data;
                    this.needID = data.needID;
                    this.orderInfoState = "success";
                },
                fail : (msg)=> {
                    this.orderInfoState = "fail";
                    alert(msg);
                }
            })
        },
        computed : {
            pids(){
                var pids = [];
                this.ticketList.forEach((item,index)=>{ pids.push(item.pid) });
                return pids.join(",");
            },
            beginTimeText(){
                return{
                    A : "游玩日期",
                    F : "游玩日期",
                    H : "演出日期",
                    B : "集合日期"
                }[this.p_type];
            },
            calTourIdCard(){
                var total = 0;
                var completed = 0;
                this.ticketList.forEach((item,index) => {
                    total += item.count;
                    item.tourMsg.forEach((tourMsg,_index) => {
                        let name = tourMsg.name;
                        let idcard = tourMsg.idcard;
                        if(name && idcard && PFT.Util.Validate.idcard(idcard)) completed += 1;
                    })
                })
                return{
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
            onBeginTimeInputClick(e){
                this.beginCalendar.show = true;
                this.beginCalendar.yearmonth = e.target.value;
            },
            onChangciInputClick(e){
                this.showPuct.sheetShow = true;
            },
            //开始时间变化时
            onBeginTimeChange(data){
                var date = this.beginCalendar.date = data.date;
                var p_type = this.p_type;
                if(!date || !this.pids || !this.aid) return false;
                if(p_type=="A" || p_type=="F" || p_type=="B"){ //景点||套票产品||线路
                    this.queryStoragePrice({date:date});
                }else if(p_type=="C"){ //酒店

                }else if(p_type=="H"){ //演出
                    this.ticketList.forEach((ticket,index) => {
                        ticket["jsprice"] = data.price;
                    })
                    //接下来什么事都不做，data.dete的变化会映射到beginCalendar.date
                    //而beginCalendar.date已通过v-model绑定到子组件sheet-changci里了
                    //此时sheet-changci里已watch date的变化去自动调用queryChangciList方法
                }
            },
            //当场次变化时
            onChangeciChange(data){
                var round_name = data.round_name;
                var bt = data.bt || "";
                var et = data.et || "";
                var area_storage = data.area_storage;
                var ticketList = this.ticketList;
                this.showPuct.selected_text = round_name + " " + bt + " - " + et;
                ticketList.forEach((ticket,index) => {
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
            //用户修改购买条件时(修改日期，酒店类产品修改入店时间，离店时间，演出类产品修改场次等)，刷新票列表属性(价格，库存等)
            queryStoragePrice(opt){
                var p_type = this.p_type;
                if(p_type=="A" || p_type=="F" || p_type=="B"){
                    GetStoragePrice(this.p_type,{
                        pids : this.pids,
                        aid : this.aid,
                        date : opt.date
                    },{
                        loading : () => { this.toast.show("loading","努力加载中...") },
                        complete : () => { this.toast.hide() },
                        success : (data) => { this.updateTicketList(data) }
                    })
                }
            },
            updateTicketList(data){
                //data = {
                //    pid1 : {
                //        price : "",
                //        store : ""
                //    },
                //    pid2 : {
                //        price : "",
                //        store : ""
                //    }
                //};
                var list = this.ticketList;
                for(var i in list){
                    var pid = list[i]["pid"];
                    var obj = data[pid];
                    if(!obj) continue;
                    var store = obj.store * 1;
                    var buy_up = list[i]["buy_up"];
                    var buy_low = list[i]["buy_low"];
                    if(typeof obj.price!=="undefined") list[i]["jsprice"] = obj.price;
                    list[i]["storage"] = store;
                    if(store==-1){
                        if(buy_up!=-1){ //限制最多购买张数
                            list[i]["max"] = buy_up;
                        }else{
                            list[i]["max"] = -1;
                        }
                    }else{
                        if(buy_up!=-1){
                            list[i]["max"] = Math.min(store,buy_up);
                        }else{
                            list[i]["max"] = store;
                        }
                    }
                }
            },
            openSheetIdCard(){
                this.sheetIdcardShow = true;
            },

            //提交订单
            onSubmitBtnClick(e){

            }
        },
        components : {
            sheetCalendar : require("COMMON_VUE_COMPONENTS/sheet-calendar"),
            ticketList : require("COMMON_VUE_COMPONENTS/ticket-list-booking"),
            sheetIdcard : require("COMMON_VUE_COMPONENTS/sheet-booking-idcard"),
            inputLine : require("./components/input-line"),
            sheetRefundrule : require("./components/sheet-refund-rule"),
            sheetChangci : require("./components/sheet-changci")
        }
    }
</script>

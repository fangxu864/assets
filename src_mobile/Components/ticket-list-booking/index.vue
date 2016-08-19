<template>
    <div class="ticketListContainer">
        <ul class="ticketListUl" v-if="state=='success'">
            <li class="item" v-for="item in list">
                <div class="ptitle"><span class="t" v-text="item.title"></span></div>
                <div class="bcon">
                    <div class="bbCon">
                        <span class="conBox price">单价：<i class="yen">&yen;</i><span class="num" v-text="item.jsprice"></span></span>
                        <span style="margin-left:8px;" v-if="item.storage!=-1" class="conBox storage">库存：<span class="num" v-text="item.storage"></span></span>
                    </div>
                    <div class="countBox">
                        <count :value.sync="item.count"
                               :id="item.pid+'-'+item.tid"
                               :max="item.max"
                               :min="item.min"
                               :can_0="item.can_0"
                               v-on:count-change="onCountChange">
                        </count>
                        <p class="buyLimitTip" v-if="(item.buy_low!=-1) || (item.buy_up!=-1)">
                            <span class="buy_low" v-if="item.buy_low!=-1" v-text="item.buy_low+'张起买'"></span>
                            <span class="buy_up" v-if="item.buy_up!=-1" v-text="'最高限买'+item.buy_up+'张'"></span>
                        </p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script type="es6">
    let GetTicketList = require("SERVICE_M/booking-ticket-list");
    export default {
        props : {
            pid : {
                type : String,
                require : true,
                default : "111"
            },
            list : {
                type : Array,
                require : true,
                twoway : true,
                default : function(){ return[]}
            },
            totalMoney : {
                type : Number,
                require : true,
                twoway : true,
                default : 0
            },
            needID : {
                type : String,
                default : "0"
            }
        },
        data(){
            return{
                state : "",
                stateMsg : ""
            }
        },
        ready(){
            GetTicketList(this.pid,{
                loading : ()=>{
                    this.state = "loading";
                    this.stateMsg = PFT.AJAX_LOADING_TEXT;
                },
                success : (list)=>{
                    this.stateMsg = "请求票类列表成功";
                    this.list = this.adaptListData(list);
                    this.state = "success";
                },
                empty : ()=>{
                    this.stateMsg = "暂无可售票类";
                    this.state = "empty";
                },
                fail : (msg)=>{
                    this.stateMsg = msg;
                    this.state = "fail";
                }
            })
        },
        methods : {
            adaptListData(list){
                list.forEach((item,index) => {
                    var buy_up = item.buy_up;
                    var buy_low = item.buy_low;
                    item["max"] = (buy_up==-1) ? -1 : buy_up * 1;
                    item["min"] = (buy_low==-1) ? -1 : buy_low * 1;
                    item["can_0"] = index==0 ? false : true;
                    item["storage"] = -1;
                    item["count"] = index==0 ? item.min : 0;
                    if(this.needID==2){
                        item["tourMsg"] = [];
                        for(var i=0; i<item["count"]; i++){
                            item["tourMsg"].push({
                                idcard : "",
                                name : ""
                            })
                        }
                    }
                })
                return list;
            },
            onCountChange(id,count,oldVal){
                var pid = id.split("-")[0];
                var tid = id.split("-")[1];
                this.list.forEach((ticket,index) => {
                    var tourMsg = ticket.tourMsg;
                    if(pid!=ticket.pid || tid!=ticket.tid) return false;
                    var newTourMsg = [];
                    for(var i=0; i<count; i++){
                        var oldTourMsgItem = tourMsg[i] || {};
                        newTourMsg.push({
                            name : oldTourMsgItem.name || "",
                            idcard : oldTourMsgItem.idcard || ""
                        })
                    }
                    //只赋值一次
                    this.list[index]["tourMsg"] = newTourMsg;
                })
            }
        },
        computed : {
            totalMoney(){
                var total_money = 0;
                this.list.forEach((item,index)=>{
                    var jsprice = item.jsprice;
                    var count = item.count;
                    total_money += (jsprice * count);
                })
                return total_money;
            }
        },
        components : {
            count : require("COMMON_VUE_COMPONENTS/count")
        }
    }
</script>
<style lang="sass">
    $countBoxWidth : 120px;
    .ticketListUl{ padding:0}
    .ticketListUl .item{ padding:25px 15px 23px; border-bottom:1px solid #e5e5e5; overflow:hidden; background:#fff}
    .ticketListUl .item:last-child{ border-bottom:0 none}
    .ticketListUl .item .ptitle{ font-size:0.35rem; font-weight:bold; margin-bottom:3px;  line-height:1.5}
    .ticketListUl .item .bcon{ position:relative; min-height:26px; padding-right:$countBoxWidth}
    .ticketListUl .item .bbCon{ line-height:26px;}
    .ticketListUl .item .conBox{ display:inline-block}
    .ticketListUl .item .countBox{ position:absolute; top:0; right:0; width:$countBoxWidth;}
    .ticketListUl .item .conBox.price .num{ font-size:0.4rem; color:#f37138}
    .ticketListUl .item .conBox.price .yen{ color:#f37138}
    .ticketListUl .item .buyLimitTip{ color:#258cc9; font-size:0.3rem; text-align:right; padding-top:3px;}
</style>
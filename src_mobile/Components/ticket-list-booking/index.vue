<template>
    <div class="ticketListContainer">
        <ul class="ticketListUl">
            <li class="item" v-for="item in list">
                <div class="minBox">
                    <div class="ptitle"><span class="t" v-text="item.title"></span></div>
                    <div class="bcon">
                        <div class="bbCon">
                            <span class="conBox price">单价：<i class="yen">&yen;</i><span class="num" v-text="item.jsprice"></span></span>
                        <span style="margin-left:8px;" v-if="(item.storage!=-1 || item.storeText)" class="conBox storage">
                            库存：<span class="num" v-text="(item.storeText=='有' || item.storeText=='无') ? item.storeText : item.storage"></span>
                        </span>
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
                </div>
                <div class="sonTicketBox" v-if="item.sonTickets && item.sonTickets.length>0">
                    <div class="tit">包含子票：</div>
                    <div class="sonTicketItem" v-for="son in item.sonTickets">
                        <span class="t" v-text="son.title"></span><span class="star">*</span><span class="num" v-text="son.num"></span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script type="es6">
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
        methods : {
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
    @import "COMMON/css/base/core/variables";
    $countBoxWidth : 120px;
    .ticketListUl{ padding:0}
    .ticketListUl .item{  border-bottom:1px solid #e5e5e5;}
    .ticketListUl .item .minBox{ padding:25px 15px 23px; overflow:hidden; background:#fff}
    .ticketListUl .item:last-child{ border-bottom:0 none}
    .ticketListUl .item .ptitle{ font-size:0.35rem; font-weight:bold; margin-bottom:3px;  line-height:1.5}
    .ticketListUl .item .bcon{ position:relative; min-height:26px; padding-right:$countBoxWidth}
    .ticketListUl .item .bbCon{ line-height:26px;}
    .ticketListUl .item .conBox{ display:inline-block}
    .ticketListUl .item .countBox{ position:absolute; top:0; right:0; width:$countBoxWidth;}
    .ticketListUl .item .conBox.price .num{ font-size:0.4rem; color:#f37138}
    .ticketListUl .item .conBox.price .yen{ color:#f37138}
    .ticketListUl .item .buyLimitTip{ color:#258cc9; font-size:0.3rem; text-align:right; padding-top:3px;}
    .ticketListUl .sonTicketBox{ padding:10px 15px 20px; background:#fafafa; font-size:0.30rem; line-height:1.6; border-top:1px solid $gray96}
</style>
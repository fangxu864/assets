<template>
    <div class="ticketListContainer">
        <template v-if="state!=='success'">
            <div class="state" :class="state" v-text="state_text"></div>
        </template>
        <template v-if="state=='success'">
            <ul id="ticketListUl" class="ticketList">
                <li class="item" v-for="item in list">
                    <table><tbody><tr>
                        <td class="col col_1">
                            <p class="ttitle">
                                <span v-if="item.zone_name" class="zoneName">{{'【'+item.zone_name+'】'}}</span><span class="tit" v-text="item.ticket"></span>
                            </p>
                            <p class="tdesc" v-text="item.intro" v-if="item.intro"></p>
                            <div class="flagGroup" v-if="item.tags && item.tags.length">
                                <span class="flag" v-for="tag in item.tags" v-text="tag"></span>
                            </div>
                            <template v-if="item.sonTickets && item.sonTickets.length>0">
                                <div class="sonTicketsWrap">
                                    <p class="ptop">包含子票：</p>
                                    <ul>
                                        <li class="sonTicketItem" v-for="son in item.sonTickets">
                                            <span class="ptit" v-text="son.title"></span>
                                            <i class="star">*</i>
                                            <em class="count" v-text="son.num"></em><span class="per" v-text="{A:'张',B:'张',C:'间',F:'张',H:'张'}[son.p_type]"></span>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </td>
                        <td class="col col_2">
                            <a style="display:block" :href="'booking.html?aid='+item.aid+'&pid='+item.pid">
                                <span class="price tprice"><i class="yen">&yen;</i><em class="num" v-text="item.tprice"></em></span></br>
                                <span class="price jsprice"><i class="yen">&yen;</i><em class="num" v-text="item.jsprice"></em></span></br>
                                <span class="buyBtn">预定</span>
                            </a>
                        </td>
                    </tr></tbody></table>
                </li>
            </ul>
            <div class="switchBtn" @click="onSwitchHeight" v-if="itemLen>max" :class="{'down':slideDown}">
                <span class="t">更多<span v-text="ptype_text"></span></span>
                <i class="iconfont icon-fold up"></i>
                <i class="iconfont icon-unfold down"></i>
            </div>
        </template>
    </div>
</template>
<script type="es6">
    export default {
        props : {
            ptype : {
                type : String,
                default : "A"
            },
            state : {
                type : String,
                default : ""
            },
            errorMsg : {
                type : String,
                default : ""
            },
            list : {
                type : Array,
                default : function(){
                    return [];
                }
            },
            max : { //最多显示几个item,超出的会先被隐藏
                type : Number,
                default : 5
            }
        },
        data(){
            return{
                slideDown : false
            }
        },
        watch : {
            list : function(val){
                if(val.length>this.max){
                    setTimeout(()=>{
                        this.setHeight("up");
                    },50)
                }
            }
        },
        computed : {
            itemLen(){
                return this.list.length;
            },
            ptype_text(){
                return this.ptype=="C" ? "房型" : "票类";
            },
            state_text(){
                return{
                    loading : PFT.AJAX_LOADING_TEXT,
                    complete : PFT.AJAX_COMPLETE_TEXT,
                    fail : this.errorMsg,
                    empty : "暂无票类..."
                }[this.state]
            }
        },
        methods : {
            onSwitchHeight(){
                this.slideDown = !this.slideDown;
                var dir = this.slideDown ? "down" : "up";
                this.setHeight(dir);
            },
            setHeight(dir){
                var listUl = document.getElementById("ticketListUl");
                var items = listUl.querySelectorAll(".item");
                var totalHeight = 0;
                var num = dir=="down" ? items.length : this.max;
                Array.prototype.forEach.call(items,function(elem,index){
                    if(index<num) totalHeight += elem.offsetHeight;
                })
                listUl.style.height = totalHeight+"px";
            },
            getPer(ptype){
                return{
                    "A" : "张",
                    "B" : "张",
                    "C" : "间",
                    "F" : "张",
                    "H" : "张"
                }
            }
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/main";
    .ticketListContainer .ticketList{ overflow:hidden; transition:height 0.1s; width:100%}
    .ticketListContainer .item{ padding:10px 10px 13px; background:#fff; border-bottom:1px solid #e5e5e5; font-size:0.35rem; line-height:1.5}
    .ticketListContainer .item .ttitle{ font-size:0.4rem; font-weight:bold; line-height:1.3}
    .ticketListContainer .item .tdesc{ color:#92A0AB}
    .ticketListContainer .item .flagGroup{ margin-top:5px}
    .ticketListContainer .item .flag{ padding:1px 5px; margin-right:3px; color:#0797D9; background:rgb(245,245,245); font-size:0.3rem}
    .ticketListContainer .item .jsprice{ color:#F07845; font-size:0.45rem}
    .ticketListContainer .item .jsprice .yen{ font-size:0.4rem}
    .ticketListContainer .item .tprice{ text-decoration:line-through; color:#92A0AB}
    .ticketListContainer .item .buyBtn{ padding:4px 15px; background:#F07845; color:#fff;}
    .ticketListContainer .switchBtn{ height:32px; line-height:29px; text-align:center; background:#fff; border-bottom:1px solid #dbdbdb}
    .ticketListContainer .switchBtn .iconfont.up{ display:none}
    .ticketListContainer .switchBtn.down .iconfont.up{ display:inline-block}
    .ticketListContainer .switchBtn.down .iconfont.down{ display:none}
    .ticketListContainer table{ width:100%; table-layout:fixed}
    .ticketListContainer table .col_1{ width:75%}
    .ticketListContainer table .col_2{ width:25%; text-align:right}
    .ticketListContainer .state{ height:150px; line-height:150px; background:#fff; text-align:center}
    .ticketListContainer .sonTicketsWrap{
        margin-top:15px;
        font-size:12px;
        line-height:1.5;
        .count{
            color:$orange;
        }
    }
    .ticketListContainer .zoneName{ color:$blue}
</style>
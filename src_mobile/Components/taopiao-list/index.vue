<template>
    <div :style="{height:height+'px'}" id="taopiaoListContainer" class="taopiaoListContainer">
        <div class="taoTop" @click="this.on=!on" :class="{'on':on}">
            <span class="t">相关套票</span>
            <span class="tri"><i class="iconfont icon-fold up"></i><i class="iconfont icon-unfold down"></i></span>
        </div>
        <div :style="{top:-top+'px'}" class="taoList">
            <div class="state" v-if="state!=='success'" v-text="state_text"></div>
            <ticket-list v-if="state=='success'"
                    :state="state"
                    :error-msg="errorMsg"
                    :max="max"
                    :list="list">
            </ticket-list>
        </div>
    </div>
</template>
<script type="es6">
    let RelatePackageList = require("SERVICE_M/relate-package-list");
    let TicketListCore = require("COMMON_VUE_COMPONENTS/ticket-list-core");
    export default {
        props : {
            lid : {
                type : String,
                require : true,
                default : ""
            }
        },
        data(){
            return{
                state : "",
                top : 150,
                height : 44,
                list : [],
                errorMsg : "",
                max : 1000,
                on : false,
                taoTopHeight : 0
            }
        },
        ready(){
            this.taoTopHeight = $("#taopiaoListContainer .taoTop").height();
        },
        watch : {
            on(val){
                if(val){ //打开状态
                    setTimeout(()=>{
                        this.height = $("#taopiaoListContainer .taoList").height() + this.taoTopHeight;
                    },30)
                    this.top = 0;
                }else{
                    if(this.list.length){
                        var taopiaoListContainer = document.getElementById("taopiaoListContainer");
                        var taoList = taopiaoListContainer ? taopiaoListContainer.querySelector(".taoList") : null;
                        this.top = taoList ? taoList.offsetHeight : 150;
                    }else{
                        this.top = 150;
                    }
                    this.height = this.taoTopHeight;
                }
                //加载列表
                if(val && (this.list.length==0) && (this.state=="") && this.lid) this.fetchList(this.lid);
            },
            list(val){
                if(val.length>0){
                    setTimeout(()=>{
                        this.height = $("#taopiaoListContainer .taoList").height() + this.taoTopHeight;
                    },30)
                }
            }
        },
        computed : {
            state_text(){
                return{
                    loading : PFT.AJAX_LOADING_TEXT,
                    complete : PFT.AJAX_COMPLETE_TEXT,
                    empty : "暂无相关套票",
                    fail : this.errorMsg
                }[this.state];
            }
        },
        methods : {
            fetchList(lid){
                RelatePackageList(lid,{
                    loading : ()=> {
                        this.state = "loading";
                    },
                    complete : ()=> {
                        this.state = "complete";
                    },
                    success : (list)=> {
                        this.state = "success";
                        this.list = list;
                    },
                    empty : ()=> {
                        this.state = "empty";
                    },
                    fail : (msg)=> {
                        this.state = "fail";
                        this.errorMsg = msg;
                    }
                })
            }
        },
        components : {
            TicketList : TicketListCore
        }
    }
</script>
<style lang="sass">
    #taopiaoListContainer{ overflow:hidden; transition:height 0.2s;}
    #taopiaoListContainer .taoTop{ position:relative; z-index:2; height:43px; line-height:43px; border-bottom:1px solid #dbdbdb; padding:0 10px; background:#fff}
    #taopiaoListContainer .taoTop .t{ float:left}
    #taopiaoListContainer .taoTop .tri{ float:right}
    #taopiaoListContainer .taoTop .iconfont.up{ display:none}
    #taopiaoListContainer .taoTop.on .iconfont.up{ display:inline}
    #taopiaoListContainer .taoTop.on .iconfont.down{ display:none}
    #taopiaoListContainer .taoList{ position:relative; z-index:1; background:#fff; transition:top 0.2s}
    #taopiaoListContainer .state{ text-align:center; height:150px; line-height:150px; background:#fff;}
</style>

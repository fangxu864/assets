<template>
    <sheet-core :show.sync="show">
        <div class="changciLiContainer" slot="content">
            <div class="stateText" v-if="state!='success'" v-text="stateText"></div>
            <ul class="changciList" v-if="state=='success'">
                <li @click="onItemClick(item)" data-id="{{item.id}}" :class="{'selected':selected_id==item.id}" class="changciItem" v-for="item in list">
                    {{item.round_name+" "+item.bt+"-"+item.et}}
                </li>
            </ul>
            <div @click="show=false" class="cancelBtn">关闭</div>
        </div>
    </sheet-core>
</template>
<script type="es6">
    let GetChangciList = require("SERVICE_M/booking-changci-list");
    export default {
        props : {
            pid : {
                type : String,
                default : ""
            },
            aid : {
                type : String,
                default : ""
            },
            date : {
                type : String,
                default : ""
            },
            show : {
                type : Boolean,
                twoway : true,
                default : false
            }
        },
        data(){
            return{
                state : "",
                selected_id : "",
                list : []
            }
        },
        computed : {
            stateText(){
                var text = "";
                var state = this.state;
                if(state=="loading"){
                    text = PFT.AJAX_LOADING_TEXT;
                }else if(state=="success"){
                    text = "请求成功";
                }else if(state=="empty"){
                    text = "此日期暂无演出";
                }else if(state.indexOf("fail")>-1){
                    text = state.split(":")[1];
                }
                return text;
            }
        },
        ready(){
            this.queryChangciList(this.date);
        },
        watch : {
            date(date){
                this.queryChangciList(date);
            }
        },
        methods : {
            queryChangciList(date){
                GetChangciList({
                    pid : this.pid,
                    aid : this.aid,
                    date : date
                },{
                    loading : () => {
                        this.state = "loading";
                    },
                    success : (list) => {
                        this.list = list;
                        this.state = "success";
                        this.selected_id = list[0]["id"];
                        this.$dispatch("changci-change",list[0])
                    },
                    empty : () => {
                        this.state = "empty";
                    },
                    fail : (msg) => {
                        this.state = "fail:"+msg;
                    }
                })
            },
            onItemClick(selectItem){
                this.selected_id = selectItem.id;
                this.show = false;
                this.$dispatch("changci-change",selectItem)
            }
        },
        components : {
            sheetCore : require("COMMON_VUE_COMPONENTS/sheet-core")
        }
    }
</script>
<style lang="sass">
    .changciLiContainer .cancelBtn{ height:43px; line-height:43px; text-align:center; border-top:1px solid #e5e5e5; color:#258cc9}
    .changciLiContainer .changciItem{ height:43px; line-height:43px; padding-left:15px; overflow:hidden; border-bottom:1px solid #e5e5e5}
    .changciLiContainer .changciItem.selected{ color:#258cc9}
    .changciLiContainer .changciItem:last-child{ border-bottom:0 none}
</style>
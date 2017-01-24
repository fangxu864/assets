<template>
    <actionsheet-core :show.sync="show" :height="height">
        <div slot="content">
            <ul class="actionUl">
                <li class="actionItem" :class="{selected:selected_key==key,left:align=='left',center:align=='center',right:align=='right'}" v-for="(key,value) in menus" v-html="value" @click="onActionItemClick(key,value)"></li>
            </ul>
            <div class="cancelBtn" @click="onCancalBtnClick" v-if="cancelText!==''" v-html="cancelText"></div>
        </div>
    </actionsheet-core>
</template>
<script type="es6">
    export default {
        props : {
            show : {
                type : Boolean,
                require : true,
                default : true,
                twoWay : true
            },
            height : {
                type : String,
                default : ""
            },
            cancelText : {
                type : String,
                default : ""
            },
            menus : {
                require : true,
                default : function(){
                    return {};
                }
            },
            initTrigger : {
                type : Boolean,
                default : true
            },
            align : {
                type : String,
                default : "center"
            }
        },
        data(){
            return{
                selected_key : ""
            }
        },
        ready(){
            if(this.initTrigger){
                var index = 0;
                var menus = this.menus;
                var first_key = "";
                var first_text = "";
                for(var i in menus){
                    if(index==0){
                        first_key = i;
                        first_text = menus[i];
                    }
                    index += 1;
                }
                this.selected_key = first_key;
                this.$dispatch("click",first_key,first_text);
            }
        },
        methods : {
            onActionItemClick(key,text){
                this.selected_key = key;
                this.$dispatch("click",key,text);
                this.show = false;
            },
            onCancalBtnClick(e){
                this.show = false;
                this.$dispatch("cannel",e);
            }
        },
        components : {
            ActionsheetCore : require("COMMON_VUE_COMPONENTS/sheet-core")
        }
    }
</script>
<style lang="sass">
    .ui-actionsheetContainer .actionItem{
        line-height:1.5;
        border-bottom:1px solid #e5e5e5;
        overflow:hidden;
        background:#fff;
        padding:12px 10px;
    }
    .ui-actionsheetContainer .actionItem.center{ text-align:center}
    .ui-actionsheetContainer .actionItem.left{ text-align:left}
    .ui-actionsheetContainer .actionItem.right{ text-align:right}
    .ui-actionsheetContainer .cancelBtn{ height:43px; line-height:43px; text-align:center; color:#008fc2; margin-top:5px; border-top:1px solid #e5e5e5; background:#fff}
    .ui-actionsheetContainer .actionItem:active,.ui-actionsheetContainer .cancelBtn:active{ background:rgba(0,0,0,0.02)}
    .ui-actionsheetContainer .actionItem.selected{ color:#008fc2}
</style>
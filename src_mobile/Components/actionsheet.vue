<template>
    <actionsheet-core :show.sync="show" :height="height">
        <div slot="content">
            <ul class="actionUl">
                <li class="actionItem" v-for="(key,value) in menus" v-html="value" @click="onActionItemClick(key,value)"></li>
            </ul>
            <div class="cancelBtn" @click="show=false" v-if="cancelText!==''" v-html="cancelText"></div>
        </div>
    </actionsheet-core>
</template>
<script type="es6">
    import ActionsheetCore from "COMMON_VUE_COMPONENTS/actionsheet-core.vue";
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
                type : Object,
                require : true,
                default : {}
            }
        },
        methods : {
            onActionItemClick(key,text){
                this.$dispatch("click",key,text);
                this.show = false;
            }
        },
        components : {
            ActionsheetCore : ActionsheetCore
        }
    }
</script>
<style lang="sass">
    .ui-actionsheetContainer .actionItem{ height:43px; line-height:43px; text-align:center; border-bottom:1px solid #e5e5e5; overflow:hidden}
    .ui-actionsheetContainer .cancelBtn{ height:43px; line-height:43px; margin-top:10px; border-top:1px solid #e5e5e5; text-align:center}
    .ui-actionsheetContainer .actionItem:active,.ui-actionsheetContainer .cancelBtn:active{ background:rgba(0,0,0,0.02)}
</style>
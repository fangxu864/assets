<template>
    <sheet-core :height="'100%'" :show.sync="show">
        <div id="contactContainer" class="contactContainer" slot="content">
            <div class="contact-header">常用联系人</div>
            <div class="content">
                <ul class="userList">
                    <li class="userItem">
                        <i class="uicon uicon-shanchu"></i>
                    </li>
                </ul>
            </div>
            <div @click="show=false" class="foot-cancelBtn">取消</div>
        </div>
    </sheet-core>
</template>
<script type="es6">
    export default {
        props : {
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

        },
        ready(){

        },
        watch : {

        },
        methods : {

        },
        components : {
            sheetCore : require("COMMON_VUE_COMPONENTS/sheet-core")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/main";
#contactContainer{
    height:100%;
    overflow:hidden;

    .contact-header{
        height:40px;
        line-height:40px;
        text-align:center;
        border-bottom:1px solid $gray90;
    }
    .content{
        position:absolute;
        top:41px;
        bottom:44px;
        left:0;
        right:0;
        width:100%;
        overflow:auto;
        -webkit-overflow-scrolling:touch;
    }
    .foot-cancelBtn{
        position:absolute;
        bottom:0;
        left:0;
        right:0;
        height:43px;
        line-height:43px;
        text-align:center;
        border-top:1px solid $gray90;
        color:$blue;
    }



}
</style>
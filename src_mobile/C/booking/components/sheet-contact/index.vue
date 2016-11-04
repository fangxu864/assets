<template>
    <sheet-core :height="'100%'" :show.sync="show">
        <div id="contactContainer" class="contactContainer" slot="content">
            <div class="contact-header">常用联系人</div>
            <div class="content">
                <ul class="userList">
                    <li class="userItem">
                        <div class="nameCol">
                            <span class="name">人人人人</span>
                            <span class="mobile">18305917866</span>
                        </div>
                        <a href="javascript:void(0)" class="deleteBtn"><i class="uicon uicon-shanchu"></i></a>
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

    .userItem{
        height:45px;
        line-height:45px;
        margin:0 10px;
        overflow:hidden;
        border-bottom:1px solid $gray90;

        .nameCol{
            float:left;
            .name{
                display:inline-block;
                width:70px;
                padding-left:10px;
            }
        }
        .deleteBtn{
            float:right;
            height:100%;
            line-height:43px;
            width:45px;
            text-align:center;


        }

    }



}
</style>
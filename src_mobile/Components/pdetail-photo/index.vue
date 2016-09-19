<template>
    <div class="pdetailPhotoContainer">
        <template v-if="state=='success'">
            <image-loador :src="src" :height="height" :fixed="fixed"></image-loador>
            <div class="infoBox" v-if="title && address">
                <p class="landTitle" v-text="title"></p>
                <div class="landAddr">
                    <p class="addrText" v-text="address"></p>
                    <i class="iconfont icon-daohang"></i>
                </div>
            </div>
        </template>
    </div>
</template>
<script type="es6">
    export default {
        props : {
            state : {
                type : String,
                default : ""
            },
            src : {
                type : String,
                default : ""
            },
            title : {
                type : String,
                default : ""
            },
            address : {
                type : String,
                default : ""
            }
        },
        data(){
            return{
                height : 150,
                fixed : false  //不固定photoContainer高度，由图片高度而定
            }
        },
        components : {
            ImageLoador : require("COMMON_VUE_COMPONENTS/image-loador")
        }
    }
</script>
<style lang="sass">
    .pdetailPhotoContainer{ position:relative}
    .pdetailPhotoContainer .infoBox{ position:absolute; left:0; right:0; bottom:0; padding:8px 10px; font-size:0.35rem; line-height:1.5; background:rgba(0,0,0,0.4); color:#fff}
    .pdetailPhotoContainer .landTitle{ font-weight:bold}
    .pdetailPhotoContainer .landAddr{ position:relative; padding-right:30px;}
    .pdetailPhotoContainer .landAddr .iconfont{ position:absolute; top:-7px; right:0;}

</style>
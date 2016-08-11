<template>
    <div class="pdetailPhotoContainer">
        <image-loador :src="src" :height="height" :flex="flex" v-if="state!=='loading' && state!==''"></image-loador>
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
            }
        },
        data(){
            return{
                height : 150,
                flex : true
            }
        },
        components : {
            ImageLoador : require("COMMON_VUE_COMPONENTS/image-loador.vue")
        }
    }
</script>
<style lang="sass"></style>
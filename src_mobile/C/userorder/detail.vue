<template>
    <div class="detailPage">
        <div style="line-height:100px; text-align:center"><span style="font-size:1rem" v-text="id"></span></div>
    </div>
</template>
<script type="es6">
    export default{
        data(){
            return{
                infoData : {},
                id : "",
                active : false
            }
        },
        route : {
            data(transition){
                this.$set("id",transition.to.params.id);
                this.$set("active",true);
            },
            activate(){

            },
            deactivate(){
                this.$set("id","");
                this.$set("active",false);
            }
        },
        methods : {

        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/main";
    .detailPage{
        position:fixed;
        left:0;
        right:0;
        top:0;
        bottom:0;
        z-index:10;
        background:$bgColor;
    }
</style>
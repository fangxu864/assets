<template>
    <fix-header>
        <a class="leftBtn" href="javascript:void(0)" @click="onCityBtnClick" slot="left">
            <i class="iconfont icon-sevenbabicon31"></i>
            <span class="t" v-text="area"></span>
        </a>
        <div class="centerBox" slot="center">
            <a href="javascript:void(0)" class="searchBox"><i class="iconfont icon-search"></i><span class="t">产品名称</span></a>
        </div>
        <a class="rightBtn" href="javascript:void(0)" slot="right"><i class="iconfont icon-lianxiren"></i></a>
    </fix-header>
</template>
<script type="es6">
    export default {
        props : {
            area : {
                type : String,
                default : ""
            }
        },
        methods : {
            onCityBtnClick(){
                console.log("onCityBtnClick");
                this.$dispatch("openCitySwitchor");
            }
        },
        components : {
            fixHeader : require("COMMON_VUE_COMPONENTS/fix-header")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/core/px2rem";
    #indexPageFixHeader .gFixHeader .leftBtn{ width:90px; padding-left:10px; text-align:left; overflow:hidden}
    #indexPageFixHeader .gFixHeader .leftBtn .t{ font-size:0.35rem}
    $height : 65;
    $marginTop : 12.25;
    #indexPageFixHeader .gFixHeader .searchBox{ display:block; width:70%; height:px2rem($height); line-height:px2rem($height); margin:px2rem($marginTop) auto 0; background:#e5f5fc; color:#92a0ab; border-radius:3px}
    #indexPageFixHeader .gFixHeader .searchBox .iconfont{ font-size:0.48rem; margin-right:3px; top:1px;}
</style>
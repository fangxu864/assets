<template>
    <fix-header>
        <a class="leftBtn" href="javascript:void(0)" @click="citySwitchorShow=true" slot="left">
            <i class="iconfont icon-sevenbabicon31"></i>
            <span class="t" v-text="city"></span>
        </a>
        <div class="centerBox" slot="center">
            <a href="javascript:void(0)" class="searchBox"><i class="iconfont icon-search"></i><span class="t">产品名称</span></a>
        </div>
        <a class="rightBtn" href="javascript:void(0)" slot="right"><i class="iconfont icon-lianxiren"></i></a>
    </fix-header>
</template>
<script type="es6">
    export default {
        components : {
            fixHeader : require("COMMON_VUE_COMPONENTS/fix-header.vue")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/core/px2rem";
    #indexPageFixHeader .gFixHeader .leftBtn{ width:90px; padding-left:10px; text-align:left; overflow:hidden}
    $height : 65;
    $marginTop : 12.25;
    #indexPageFixHeader .gFixHeader .searchBox{ display:block; width:70%; height:px2rem($height); line-height:px2rem($height); margin:px2rem($marginTop) auto 0; background:#e5f5fc; color:#92a0ab; border-radius:3px}
    #indexPageFixHeader .gFixHeader .searchBox .iconfont{ font-size:0.48rem; margin-right:3px; top:1px;}
</style>
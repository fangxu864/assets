<template>
    <div v-bind:style="{zIndex:zIndex}" class="gFixHeader">
        <slot name="left"></slot>
        <slot name="center"></slot>
        <slot name="right"></slot>
    </div>
</template>
<script type="es6">
    export default {
        props : {
            zIndex : {
                type : Number,
                default : 99
            }
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/core/variables";
    @import "COMMON/css/base/core/px2rem";
    $height : 90;
    .gFixHeader{ position:fixed; left:0; right:0; top:0; height:px2rem($height); line-height:px2rem($height); padding:0; box-shadow:0 1px 1px rgba(0,0,0,0.1); background:#fff}
    .gFixHeader .leftBtn,.gFixHeader .rightBtn{ display:block; position:absolute; top:0; bottom:0; width:50px; line-height:px2rem($height); color:$blue; text-align:center;}
    .gFixHeader .leftBtn{ left:0}
    .gFixHeader .rightBtn{ right:0}
    .gFixHeader .iconfont{ line-height:inherit; font-size:0.6rem}
    .gFixHeader .centerBox{ margin:0 50px; height:100%; line-height:px2rem($height); overflow:hidden; text-align:center; color:#fff; font-size:0.4rem; font-weight:normal}
</style>

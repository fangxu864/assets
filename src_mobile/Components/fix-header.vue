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
    @import "COMMON/css/base/core/_px2rem.scss";
    $height : 85;
    .gFixHeader{ position:fixed; left:0; right:0; top:0; height:px2rem($height); line-height:px2rem($height); background:#2a98da;}
    .gFixHeader .leftBtn,.gFixHeader .rightBtn{ display:block; position:absolute; top:0; bottom:0; width:50px; line-height:px2rem($height); color:#fff; text-align:center;}
    .gFixHeader .leftBtn{ left:0}
    .gFixHeader .rightBtn{ right:0}
    .gFixHeader .fixHeaderTitle{ margin:0 50px; line-height:px2rem(85); overflow:hidden; text-align:center; color:#fff; font-size:0.4rem; font-weight:normal}
</style>

<template>
    <div @click="onItemClick" class="pftui-line-item" :class="[className]">
        <slot name="left" class="col"></slot>
        <slot name="right" class="col"></slot>
    </div>
</template>
<script type="es6">
    export default {
        props : {
            className : {
                type : String,
                default : ""
            },
            link : {
                type : String,
                default : ""
            }
        },
        methods : {
            onItemClick(e){
                this.$dispatch("item-click",e);
                if(this.link) window.location.href = this.link;
            }
        }
    }
</script>
<style lang="sass">
    /*@import "CSS_CORE/_variables.scss";*/
    @import "COMMON/css/base/main";
    $lineHeight: px2rem(93);
    .pftui-line-item{
        position:relative;
        height:$lineHeight;
        display:flex;
        flex-flow : row nowrap;
        align-items:center;
        justify-content : space-between;
        background:#fff;
        padding:0 12px 0 15px;
    }
    .pftui-line-item:active{ background:$gray99}
    .pftui-line-item:before,.pftui-line-item:last-child:after{
        content:"";
        position:absolute;
        height:1px;
        left:0;
        right:0;
        font-size:0;
        line-height:0;
        background:$gray85;
        transform:scaleY(0.5);
    }
    .pftui-line-item:before{ top:0;}
    .pftui-line-item:last-child:after{ bottom:0 }
    .pftui-line-item > [slot=left] .t{ font-size:0.35rem;}
    .pftui-line-item > [slot=right] .t{ font-size:0.32rem; color:$gray55}
    .pftui-line-item > [slot=right] i.uicon{ font-size:16px;}

</style>
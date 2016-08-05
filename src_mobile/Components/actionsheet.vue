<template>
    <div class="ui-actionSheetMask" :class="{'show':show}" :style="{zIndex:zIndex}"></div>
    <div class="ui-actionsheetContainer" :class="{'show':show}" :style="{zIndex:zIndex+1}">
        <div :style="{height:height}" class="slideBox">
            <slot name="content"></slot>
        </div>
    </div>
</template>
<script type="es6">
    export default{
        props : {
            zIndex : {
                type : Number,
                default : 99
            },
            height : {
                type : String,
                default : "50%"
            }
        },
        data(){
            return{
                show : false
            }
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/mixin/keyframes";
    .ui-actionsheetContainer{
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:rgba(0,0,0,0.7);
    }
    .ui-actionsheetContainer.show{ display:block}
    .ui-actionsheetContainer .slideBox{
        position:fixed;
        left:0;
        right:0;
        bottom:0;
        background:#fff;
    }
    @include keyframes(slideDown){
        from{
            -webkit-transform : translateY(0)
        }
        to{
            -webkit-transform : translateY(-100%)
        }
    }
    @include keyframes(slideUp){
        from{
            -webkit-transform : translateY(-100%)
        }
        to{
            -webkit-transform : translateY(0)
        }
    }
</style>
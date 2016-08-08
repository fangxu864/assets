<template>
    <div class="ui-actionSheetMask" :class="{'show':show}" :style="{zIndex:zIndex}"></div>
    <div class="ui-actionsheetContainer" :class="{'show':show}" :style="{zIndex:zIndex+1,height:height}">
        <slot name="content"></slot>
    </div>
</template>
<script type="es6">
    import "COMMON/modules/AnimationInOut";
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
        ready(){

        },
        data(){
            return{
                show : false
            }
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/mixin/animations/main";
    .ui-actionSheetMask{
        display:block;
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:rgba(0,0,0,0.7);
        @include animation-name(fadeOut);
        @include animation-duration(0.1s);
        @include animation-fill-mode(forwards);
        @include animation-delay(0.2s);
    }
    .ui-actionsheetContainer{
        position:fixed;
        left:0;
        right:0;
        bottom:0;
        background:#fff;
        @include animation-name(slideDown);
        @include animation-duration(0.2s);
        @include animation-fill-mode(forwards);
    }
    .ui-actionsheetContainer.show{
        @include animation-name(slideUp);
    }
    @include keyframes(slideDown){
        from{
            -webkit-transform : translateY(0)
        }
        to{
            -webkit-transform : translateY(100%)
        }
    }
    @include keyframes(slideUp){
        from{
            -webkit-transform : translateY(100%)
        }
        to{
            -webkit-transform : translateY(0)
        }
    }
    @include keyframes(fadeIn){
        from{
            display:none;
        }
        to{
            display:block;
        }
    }
    @include keyframes(fadeOut){
        from{
            display:block;
        }
        to{
            display:none
        }
    }
</style>
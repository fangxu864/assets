<template>
    <div class="ui-actionsheetContainer" :class="{'show':show}" :style="{zIndex:zIndex}">
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
    .ui-actionsheetContainer{
        display:none;
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
    @mixin slideDown{

    }
</style>
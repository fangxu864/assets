<template>
    <div class="ui-actionSheetMask" :class="{'show':show}" :style="{zIndex:zIndex,display: show ? 'block' : 'none'}" @click="show=false"></div>
    <div class="ui-actionsheetContainer" :class="{'show':show}" :style="{zIndex:zIndex+1,height:height==''?'auto':height}">
        <span class="closeBtn" v-if="closeBtn" @click="show=false"><i class="iconfont icon-close"></i></span>
        <p class="header" v-if="header!==''" v-text="header"></p>
        <div class="ui-actionshet-con" :class="{'hasHeader':header!==''}">
            <slot name="content"></slot>
        </div>
    </div>
</template>
<script type="es6">
    export default{
        props : {
            show : {
                type : Boolean,
                require : true,
                default : true,
                twoWay : true
            },
            closeBtn : {
                type : Boolean,
                default : false
            },
            header : {
                type : String,
                default : ""
            },
            zIndex : {
                type : Number,
                default : 99
            },
            height : {
                type : String,
                default : ""
            }
        }
    }
</script>
<style lang="sass">
    $closeBtnHeight : 42px;
    .ui-actionSheetMask{
        display:none;
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background: rgba(0,0,0,0);
        transition:background .5s;
        backface-visibility: hidden;
    }
    .ui-actionSheetMask.show{
        display:block;
        background: rgba(0,0,0,.6);
    }
    .ui-actionsheetContainer{
        position:fixed;
        left:0;
        right:0;
        bottom:0;
        background:#fff;
        transform:translateY(100%);
        transition:-webkit-transform .3s;
        backface-visibility: hidden;
    }
    .ui-actionshet-con{ height:100%; overflow:auto; overflow-scrolling:touch; -webkit-overflow-scrolling:touch}
    .ui-actionsheetContainer.show{
        transform:translateY(0);
    }
    .ui-actionsheetContainer .closeBtn{
        display:block;
        position:absolute;
        z-index:1;
        top:0;
        right:0;
        width:40px;
        height:$closeBtnHeight;
        line-height:$closeBtnHeight;
        text-align:center;
    }
    .ui-actionsheetContainer .closeBtn .iconfont{
        line-height:1;
    }
    .ui-actionsheetContainer .header{
        position:absolute;
        top:0;
        left:0;
        right:0;
        height:$closeBtnHeight;
        line-height:$closeBtnHeight;
        font-size:14px;
        font-weight:bold;
        overflow:hidden;
        margin:0;
        padding:0 $closeBtnHeight 0 10px;
        border-bottom:1px solid #e5e5e5;
    }
    .ui-actionsheetContainer .ui-actionshet-con.hasHeader{
        margin-top:$closeBtnHeight;
    }
</style>
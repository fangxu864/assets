<template>
    <div class="inputLine">
        <div class="lt" :style="{width:labelWidth+'%'}"><span class="t" v-text="label"></span></div>
        <div class="rt" :style="{width:(100-labelWidth)+'%'}">
            <input class="input" type="text"
                   @click="click"
                   @blur="blur"
                   @focus="focus"
                   @input="input"
                   @change="change"
                   @keydown="keydown"
                   @keyup="keyup"
                   v-model="model"
                   :placeholder="placeholder"
                   :type="type"/>
            <i class="iconfont" :class="'icon-'+icon" v-if="icon"></i>
        </div>
    </div>
</template>
<script type="es6">
    export default {
        props : {
            type : {
                type : String,
                require : true,
                default : "text"
            },
            placeholder : {
                type : String,
                default : "请输入内容"
            },
            model : {
                type : String,
                twoway : true,
                default : ""
            },
            label : {
                type : String,
                require : true,
                default : ""
            },
            labelWidth : {
                type : Number,
                default : 30
            },
            click : {
                type : Function,
                default : function(){}
            },
            blur : {
                type : Function,
                default : function(){}
            },
            focus : {
                type : Function,
                default : function(){}
            },
            input : {
                type : Function,
                default : function(){}
            },
            change : {
                type : Function,
                default : function(){}
            },
            keydown : {
                type : Function,
                default : function(){}
            },
            keyup : {
                type : Function,
                default : function(){}
            },
            icon : {
                type : String,
                default : ""
            }
        },
        methods : {
            onClick(e){ console.log("onClick")},
            onBlur(e){ console.log("onBlur")},
            onFocus(e){ console.log("onFocus")},
            onInput(e){ console.log("onInput")},
            onChange(e){ console.log("onChange")},
            onKeyup(e){ console.log("onKeyup")},
            onKeydown(e){ console.log("onKeydown")}
        }
    }
</script>
<style lang="sass">
    .inputLine{ padding:0 10px; overflow:hidden; border-bottom:1px solid rgb(240,240,240)}
    .inputLine .lt{ float:left; line-height:42px;}
    .inputLine .rt{ float:left; position:relative}
    .inputLine .rt .input{ display:block; width:100%; height:22px; line-height:22px; padding:10px 0; border:0 none;}
    .inputLine .rt .iconfont{ position:absolute; top:10px; right:0; color:#258cc9}
</style>
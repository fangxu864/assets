<template>
    <div class="inputLine" :class="[layout,validatResultCls]" :style="containerStyle">
        <div class="lt" :style="labelStyle"><span class="t" v-text="label"></span></div>
        <div class="rt" :style="rtStyle">
            <input class="input" type="text"
                   @click="onClick"
                   @blur="onBlur"
                   @focus="onFocus"
                   @input="onInput"
                   @change="onChange"
                   @keydown="onKeydown"
                   @keyup="onKeyup"
                   v-model="model"
                   :autocomplete="autocomplete"
                   :placeholder="placeholder"
                   :readonly="readonly"
                   :type="type"/>
            <i class="iconfont" :class="'icon-'+icon" v-if="icon"></i>
            <span class="errorMsg" v-text="errorMsg"></span>
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
            readonly : {
                type : Boolean,
                default : false
            },
            autocomplete : {
                type : String,
                default : "off"
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
                type : String,
                default : "30%"
            },
            validator : {
                type : String,
                default : ""
            },
            validatType : {
                type : String,
                default : "blur"
            },
            validatResult : {
                type : Number,
                twoway : true,
                default : -1
            },
            errorMsg : {
                type : String,
                default : ""
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
        data(){
            return{
                layout : "",
                containerStyle : {},
                labelStyle : {},
                rtStyle : {},
                validatResultCls : ""
            }
        },
        ready(){
            var width = this.labelWidth;
            if(width.indexOf("px")>-1){
                this.layout = "px";
                this.containerStyle = {
                    paddingLeft : width
                };
                this.labelStyle = {
                    width : width,
                    top : 0,
                    bottom : 0,
                    left : 0
                }
            }else{
                this.layout = "per";
                this.labelStyle = {
                    width : width,
                    float : "left"
                }
                this.rtStyle = {
                    width : String(100-(width.substr(0,width.length-1)*1)) + "%",
                    float : "left"
                }
            }
        },
        methods : {
            validate(val){
                var Validate = PFT.Util.Validate;
                var validator = this.validator;
                if(!validator || !Validate[validator]) return false;
                var result = Validate[validator](val);
                if(result){
                    this.validatResultCls = "";
                    this.validateResult = 1;
                }else{
                    this.validatResultCls = "error";
                    this.validateResult = 0;
                }
            },
            onClick(e){
                var val = e.target.value;
                if(this.validatType=="click") this.validate(val);
                this.click(e);
            },
            onBlur(e){
                var val = e.target.value;
                if(this.validatType=="blur") this.validate(val);
                this.blur(e);
            },
            onFocus(e){
                var val = e.target.value;
                this.validatResultCls = "";
                if(this.validatType=="focus") this.validate(val);
                this.focus(e);
            },
            onInput(e){
                var val = e.target.value;
                if(this.validatType=="input") this.validate(val);
                this.input(e);
            },
            onChange(e){
                var val = e.target.value;
                if(this.validatType=="change") this.validate(val);
                this.change(e);
            },
            onKeyup(e){
                var val = e.target.value;
                if(this.validatType=="keyup") this.validate(val);
                this.keyup(e);
            },
            onKeydown(e){
                var val = e.target.value;
                if(this.validatType=="keydown") this.validate(val);
                this.keydown(e);
            }
        }
    }
</script>
<style lang="sass">
    .inputLine{ position:relative; margin:0 15px; overflow:hidden; border-bottom:1px solid rgb(240,240,240)}
    .inputLine .lt{ line-height:48px; font-size:0.35rem;}
    .inputLine .lt .t{ padding-left:3px;}
    .inputLine .rt{ position:relative}
    .inputLine.per .lt,.inputLine.per .rt{ float:left;}
    .inputLine.px .lt{ position:absolute; top:0; bottom:0;}
    .inputLine .rt .input{ display:block; width:100%; height:22px; line-height:22px; font-size:0.35rem; padding:13px 0; border:0 none;}
    .inputLine .rt .input:focus{ color:#f37138}
    .inputLine .rt .iconfont{ position:absolute; top:13px; right:0; color:#258cc9}
    .inputLine .errorMsg{ display:none; position:absolute; top:0; bottom:0; right:0; color:red; line-height:48px;}
    .inputLine.error .errorMsg{ display:block;}
</style>
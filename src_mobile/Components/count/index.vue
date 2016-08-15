<template>
    <div class="ui-count-container">
        <input type="text" name="" class="countInp" v-model="value" number debounce="50"/>
        <span @click="onPlus" class="countBtn plus" :class="plus_cls">+</span>
        <span @click="onMinu" class="countBtn minu" :class="minu_cls">-</span>
    </div>
</template>
<script type="es6">
    export default {
        props : {
            value : {
                type : Number,
                default : ""
            },
            max : {
                type : Number,
                default : -1
            },
            min : {
                type : Number,
                default : -1
            },
            can_0 : {
                type : Boolean,
                default : true
            }
        },
        data(){
            return{
                plus_cls : "",
                minu_cls : ""
            }
        },
        ready(){
            var max = this.max;
            var min = this.min;
            var can_0 = this.can_0;
            var val = this.value;
            if(val>=max && max!=-1){
                this.value = max;
                this.plus_cls = "disable";
            }
            if(val<=min && min!=-1){
                this.value = can_0 ? 0 : min;
                this.minu_cls = "disable";
            }
            if(val==0 && !can_0) this.value = 1;
        },
        methods : {
            onPlus(e){
                if(e.target.classList.contains("disable")) return false;
                this.value += 1;
            },
            onMinu(e){
                if(e.target.classList.contains("disable")) return false;
                this.value -= 1;
            }
        },
        watch : {
            value(val,oldVal){
                var max = this.max;
                var min = this.min;
                var can_0 = this.can_0;
                var reg = can_0 ? /^\d+$/ : /^[0-9]*[1-9][0-9]*$/;
                if(isNaN(val) || !reg.test(val)) return this.value = oldVal;
                this.plus_cls = "";
                this.minu_cls = "";
                if(val>=max && max!=-1){
                    this.value = max;
                    this.plus_cls = "disable";
                }
                if(val<min && min!=-1){
                    if(Math.abs(val)>Math.abs(oldVal)){ //加
                        this.value = min;
                    }else{ //减
                        this.value = can_0 ? 0 : min;
                    }
                    this.minu_cls = "disable"
                }
                if(val==0 && !can_0){
                    this.value = oldVal;
                    this.minu_cls = "disable";
                }
                this.$dispatch("count-change",{
                    val : this.value,
                    oldVal : oldVal
                })
            }
        }
    }
</script>
<style lang="sass">
    .ui-count-container{ position:relative; margin:0 41px;  border:1px solid #258cc9;}
    .ui-count-container .countInp{ display:block; width:100%; height:22px; line-height:22px; padding:8px 0; text-align:center; border:0 none}
    .ui-count-container .countBtn{ display:block; position:absolute; top:-1px; bottom:-1px; width:41px; line-height:38px; text-align:center; font-size:18px; font-weight:bold; background:#258cc9; color:#fff}
    .ui-count-container .countBtn.plus{ right:-40px}
    .ui-count-container .countBtn.minu{ left:-40px;}
    .ui-count-container .countBtn.disable{ background:rgb(180,180,180)}
</style>
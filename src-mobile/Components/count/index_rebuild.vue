<template>
    <div class="ui-count-container">
        <div class="ui-count-container-con">
            <input type="number" name="" class="countInp" @change="onValueChange" v-model="value" number debounce="50"/>
        </div>
        <span @click="onPlus" class="countBtn plus" :class="plus_cls">+</span>
        <span @click="onMinu" class="countBtn minu" :class="minu_cls">-</span>
    </div>
</template>
<script type="es6">
    export default {
        props : {
            value : {
                type : Number,
                default : 0
            },
            id : {},
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
            var can_0 = this.can_0;
            var value = this.value * 1;
            var max = this.max * 1;
            var min = this.min * 1;
            var val = 0;
            if(value>=max && max!=-1){
                val = max;
                this.plus_cls = "disable";
            }
            if(value<=min){
                if(can_0){
                    val = 0;
                }else{
                    val = min;
                }
                this.minu_cls = "disable";
            }
            this.value = val;
        },
        methods : {
            onPlus(e){
                var tarBtn = e.target;
                if(tarBtn.classList.contains("disable")) return false;
                var val = this.value*1 + 1;
                var max = this.max;
                var can_0 = this.can_0;
                this.minu_cls = "";
                if(max==-1) return this.value = val;
                if(val>=max){
                    val = max;
                    this.plus_cls = "disable";
                }
                if(can_0 && val>0 && val<max) val = min;
                this.value = val;
            },
            onMinu(e){
                var tarBtn = e.target;
                if(tarBtn.classList.contains("disable")) return false;
                var can_0 = this.can_0;
                var min = this.min;
                var val = this.value*1 - 1;

                if(val==min && !can_0) this.minu_cls = "disable";

                if(val<min){
                    if(can_0){
                        val = 0;
                    }else{
                        val = min;
                    }
                    this.minu_cls = "disable";
                }

                this.plus_cls = "";
                this.value = val;

            },
            onValueChange(e){
                var val = e.target.value * 1;
                var max = this.max * 1;
                var min = this.min * 1;
                var can_0 = this.can_0;

                if(val)

            }
        },
        watch : {

            //value(val,oldVal){
            //    var max = this.max;
            //    var min = this.min;
            //    var can_0 = this.can_0;
            //    var reg = can_0 ? /^\d+$/ : /^[0-9]*[1-9][0-9]*$/;
            //    if(isNaN(val) || !reg.test(val)) return this.value = oldVal;
            //    this.plus_cls = "";
            //    this.minu_cls = "";
            //    if(val>=max && max!=-1){
            //        this.value = max;
            //        this.plus_cls = "disable";
            //    }
            //    if(val<=min && min!=-1){
            //        if(Math.abs(val)>Math.abs(oldVal)){ //加
            //            this.value = min;
            //        }else{ //减
            //            this.value = can_0 ? 0 : min;
            //        }
            //        this.minu_cls = "disable"
            //    }
            //    if(val==0 && !can_0){
            //        this.value = oldVal;
            //        this.minu_cls = "disable";
            //    }
            //    this.$dispatch("count-change",this.id,this.value,oldVal)
            //}
        }
    }
</script>
<style lang="sass">
    $btnWidth : 36px;
    .ui-count-container{ position:relative; padding:0 $btnWidth; border:1px solid #258cc9;}
    .ui-count-container-con{ border-left:1px solid #258cc9; border-right:1px solid #258cc9}
    .ui-count-container .countInp{ display:block; width:100%; height:22px; line-height:22px; padding:1px 0; color:#f37138; text-align:center; border:0 none}
    .ui-count-container .countInp:focus{ color:#f37138}
    .ui-count-container .countBtn{ display:block; position:absolute; top:0; bottom:0; width:$btnWidth; line-height:22px; text-align:center; font-size:18px; font-weight:bold; background:#fff; color:#258cc9}
    .ui-count-container .countBtn.plus{ right:0}
    .ui-count-container .countBtn.minu{ left:0;}
    /*.ui-count-container .countBtn.disable{ background:rgb(180,180,180)}*/
</style>
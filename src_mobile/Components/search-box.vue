<template>
    <div class="searchBox">
        <input :autofocus="isFocus" autocomplete="off" class="searchInp" type="text" v-model="value" :placeholder="placeholder">
        <i class="iconfont search icon-search"></i>
        <i class="iconfont loading"></i>
        <div @click="onClearBtnClick" class="clearBtn" :class="{'show':clearBtnShow}"><i class="iconfont clear icon-shanchu2"></i></div>
    </div>
</template>
<script type="es6">
    export default {
        props : {
            placeholder : {
                type : String,
                default : "请输入搜索关键字"
            }
        },
        data(){
            return{
                value : ""
            }
        },
        methods : {
            onClearBtnClick(e){
                this.value = "";
            }
        },
        computed : {
            clearBtnShow(){
                return this.value!=="";
            },
            isFocus(){
                return this.value=="" ? "autofocus" : "false";
            }
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/core/variables";
    @import "COMMON/css/base/mixin/searchBox_flex";
    .searchBox{
        @include searchBox_flex((top:10,bottom:10,left:30,right:30),false,false);
    }
</style>
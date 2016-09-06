<template>
    <div class="bodyContainer">
        <div id="fixTabHead" class="fixTabHead">
            <span class="tabItem unuse active">未使用</span>
            <span class="tabItem history">历史订单</span>
        </div>
        <scroller
            :lock-x="true"
            :use-pullup="true"
            :lock-y="false"
            v-on:pullup:loading="onPullupLoading"
            :scrollbar-x="false">
            <div class="scrollCon">
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
                <div style="height:100px; background-color:#ccc; margin-bottom:10px;"></div>
            </div>
        </scroller>
    </div>
</template>
<script type="es6">
    export default{
        ready(){

        },
        methods : {
            onPullupLoading(uuid){
                var that = this;
                setTimeout(function(){
                    that.$broadcast('pullup:reset', uuid)
                },1000)
            }
        },
        components : {
            scroller : require("vux/src/components/scroller/index.vue")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/main";
    body{ background:$bgColor}
    $tabHeight : 42px;
    .scrollCon{ margin-top:$tabHeight}
    #fixTabHead{
        position:fixed;
        top:0;
        left:0;
        right:0;
        z-index:10;
        height:$tabHeight;
        line-height:$tabHeight;
        overflow:hidden;
        background:#e5f5fc;
        box-shadow:0 1px 1px rgba(0,0,0,0.1);
    }
    #fixTabHead .tabItem{
        position:relative;
        float:left;
        width:50%;
        height:100%;
        line-height:$tabHeight;
        text-align:center;
    }
    #fixTabHead .tabItem.active{
        color:$orange;
    }
    #fixTabHead .tabItem.active:before{
        content : "";
        position:absolute;
        left:20%;
        right:20%;
        bottom:0;
        height:2px;
        background:$orange;
        font-size:0;
    }
</style>
<template>
    <div id="citySwitchPage" class="citySwitchPage" :class="{'show':show}"  :style="{zIndex:zIndex}">
        <fix-header>
            <a class="leftBtn" href="javascript:void(0)" slot="left"><i class="iconfont icon-back"></i></a>
            <h3 class="fixHeaderTitle" slot="center">选择城市</h3>
            <a class="rightBtn" href="javascript:void(0)" slot="right"><i class="iconfont icon-yonghu"></i></a>
        </fix-header>
        <div class="searchContainer">
            <search-box placeholder="福州 / fuzhou / fz"></search-box>
        </div>
    </div>
</template>
<script type="es6">
    let GeoLocation = require("COMMON/modules/geo-location");
    export default {
        props : {
            show : {
                type : Boolean,
                default : false
            },
            zIndex : {
                type : Number,
                default : 99
            }
        },
        data(){
            return{

            }
        },
        ready(){
            GeoLocation.on("loading",function(){
                console.log("loading")
            })
            GeoLocation.on("complete",function(res){
                console.log("定位完成")
            })
            GeoLocation.on("success",function(city){
                console.log("success");
                console.log(city);
            })
            GeoLocation.on("fail",function(res){
                console.log("fail");
                console.log(res);
            })
            //GeoLocation.locate();
        },
        components : {
            fixHeader : require("COMMON_VUE_COMPONENTS/fix-header.vue"),
            searchBox : require("COMMON_VUE_COMPONENTS/search-box.vue")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/core/_px2rem.scss";
    #citySwitchPage{ position:absolute; top:0; left:0; right:0; bottom:0; background:#dae1e4; overflow:auto; -webkit-overflow-scrolling:touch}
    #citySwitchPage.current{ display:block; z-index:100;}
    #citySwitchPage .fixHead{ position:fixed; left:0; right:0; top:0; z-index:5; height:45px; overflow:hidden; background:#2a98da; color:#fff}
    #citySwitchPage .fixHead > .con{ display:block; height:100%; line-height:45px; padding:0 70px 0 50px; text-align:center; color:#fff;}
    #citySwitchPage .fixHead .fixHeadTxt{ position:relative; right:-10px; font-size:1.2rem;}
    #citySwitchPage .fixHead > .con .iconfont{ right:-10px;}
    #citySwitchPage .fixHead .topBtn{ display:block; position:absolute; top:0; bottom:0; width:50px; line-height:45px; text-align:center;}
    #citySwitchPage .fixHead .topBtn:active{ background:#1d7ab2}
    #citySwitchPage .fixHead .topBtn.goBack{ left:0;}
    #citySwitchPage .fixHead .topBtn.user{ width:60px; right:0;}
    #citySwitchPage .fixHead .topBtn.user .iconfont{ font-size:18px;}
    #citySwitchPage .fixHead .topBtn.search{ width:35px; right:35px;}
    #citySwitchPage .fixHead .topBtn.goBack .iconfont{ left:-3px;}
    #citySwitchPage .fixHead .topBtn.search .iconfont{ top:1px}
    #allcityUl{ margin-top:0px;}
    #allcityUl .group{ margin-bottom:8px;}
    #allcityUl .group .letter{ height:30px; line-height:30px; font-size:1.2rem; padding-left:1rem; color:#333;}
    #allcityUl .group .letter.none{ display:none}
    #allcityUl .group .cityItem{ height:50px; line-height:50px; font-size:1rem; padding:0 1rem; background:#fff; border-bottom:1px solid #dbdbdb}
    #allcityUl .group .cityItem .checkbox{ float:right; font-size:22px; color:#2a98da;}
    #allcityUl .group .cityItem .checkbox.selected{ display:none; color:#0797d9}
    #allcityUl .group .cityItem .checkbox.unselect{ color:#8a8a8a;}
    #allcityUl .group .cityItem.selected{ color:#2a98da}
    #allcityUl .group .cityItem.selected .selected{ display:inline-block}
    #allcityUl .group .cityItem.selected .unselect{ display:none}
    #allcityUl .state{ height:150px; line-height:150px; text-align:center; background:#fff; font-size:0.9rem}
    #allcityUl .state .iconfont{ margin-right:2px; vertical-align:middle}
    #allcityUl .state .t{ vertical-align:middle}
    #locateCurrentCity,.allCityBar{ height:50px; line-height:50px; overflow:hidden; margin-top:0; padding:0 1rem; background:#fff;}
    #locateCurrentCity .t,#locateCurrentCity .city{ font-size:1rem}
    .citySwitchPage .cityItem.topBar .iconfont{ margin-right:2px; }
    .citySwitchPage .cityItem.topBar .checkbox{ display:none; float:right; font-size:22px; color:#2a98da;}
    .citySwitchPage .cityItem.topBar .checkbox.selected{ color:#0797d9}
    .citySwitchPage .cityItem.topBar .checkbox.unselect{ color:#8a8a8a;}
    .citySwitchPage .cityItem.topBar.success .checkbox.selected{ display:none}
    .citySwitchPage .cityItem.topBar.success .checkbox.unselect{ display:inline-block}
    .citySwitchPage .cityItem.topBar.selected{ color:#2a98da}
    .citySwitchPage .cityItem.topBar.success.selected .checkbox.selected{ display:inline-block}
    .citySwitchPage .cityItem.topBar.success.selected .checkbox.unselect{ display:none}
    .citySwitchPage .allCityBtn{ height:50px; line-height:50px; overflow:hidden; margin-top:10px; font-size:1rem; padding:0 1rem; background:#fff;}
    #mainPageCon_city{ margin-top:104px;}
    .citySwitchPage .allCityBar{ margin-top:5px;}
    .citySwitchPage .allCityBar .t{ font-size:1rem; margin-left:3px;}
</style>
<template>
    <div id="bodyContainer" class="bodyContainer">
        <div id="indexPageFixHeader">
            <fix-header>
                <a class="leftBtn" href="javascript:void(0)" @click="citySwitchor.show=true" slot="left">
                    <i class="uicon uicon-dizhi"></i>
                    <span class="t" v-text="city"></span>
                </a>
                <div class="centerBox" slot="center">
                    <a href="javascript:void(0)" class="searchBox"><i class="iconfont icon-search"></i><span class="t">产品名称</span></a>
                </div>
                <a class="rightBtn" href="javascript:void(0)" slot="right"><i class="uicon uicon-yonghu"></i></a>
            </fix-header>
        </div>
        <div id="bodyMainCon" class="bodyMainCon">
            <div class="sliderModule">
                <slider :init-height="slideInitHeight"></slider>
            </div>
            <ptype-list></ptype-list>
            <product-list :area="city"></product-list>
            <page-footer></page-footer>
        </div>
        <city-switchor
                :geo-location="citySwitchor.GeoLocation"
                :show="citySwitchor.show"
                v-on:switch="onCitySwitch"
                v-on:close="citySwitchor.show=false">
        </city-switchor>
    </div>
</template>

<script type="es6">
    import "./index.scss";
    let GeoLocation = require("COMMON/modules/geo-location");
    export default {
        data(){
            return {
                city : GeoLocation.getLastSwitchCity().city,
                city_id : "",
                citySwitchor : {
                    GeoLocation : GeoLocation,
                    show : false
                },
                slideInitHeight : 150
            }
        },
        ready(){

        },
        methods : {
            openCitySwitchor(){
                  console.log("openCitySwitchor")
            },
            onCitySwitch(data){
                this.city = data.cityname;
                this.city_id = data.id;
                this.citySwitchor.show = false;
            }
        },
        components : {
            slider : require("COMMON_VUE_COMPONENTS/slider"),
            fixHeader : require("COMMON_VUE_COMPONENTS/fix-header"),
            productList : require("./components/product-list"),
            citySwitchor : require("COMMON_VUE_COMPONENTS/city-switchor"),
            ptypeList : require("COMMON_VUE_COMPONENTS/ptype-list"),
            pageFooter : require("COMMON_VUE_COMPONENTS/page-footer")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/core/px2rem";
    #indexPageFixHeader .gFixHeader .leftBtn{ width:90px; padding-left:10px; text-align:left; overflow:hidden}
    #indexPageFixHeader .gFixHeader .leftBtn .t{ font-size:0.35rem}
    #indexPageFixHeader .gFixHeader .rightBtn .uicon{ font-size:22px}
    $height : 65;
    $marginTop : 12.25;
    #indexPageFixHeader .gFixHeader .searchBox{ display:block; width:70%; height:px2rem($height); line-height:px2rem($height); margin:px2rem($marginTop) auto 0; background:#e5f5fc; color:#92a0ab; border-radius:3px}
    #indexPageFixHeader .gFixHeader .searchBox .iconfont{ font-size:0.48rem; margin-right:3px; top:1px;}
</style>

<template>
    <div id="bodyContainer" class="bodyContainer">
        <div id="indexPageFixHeader">
            <fix-header></fix-header>
        </div>
        <div id="bodyMainCon" class="bodyMainCon">
            <div class="sliderModule">
                <slider :init-height="slideInitHeight"></slider>
            </div>
            <ptype-list></ptype-list>
            <!--<product-list :area="area"></product-list>-->
            <!--<page-footer></page-footer>-->
        </div>
        <!--<login :z-index="loginZIndex" :show="loginShow"></login>-->
        <!--<city-switchor-->
                <!--:geo-location="GeoLocation"-->
                <!--:show="citySwitchorShow"-->
                <!--v-on:switch="onCitySwitch"-->
                <!--v-on:close="citySwitchorShow=false">-->
        <!--</city-switchor>-->
        <!--<actionsheet-->
                <!--:menus="actions"-->
                <!--:show.sync="sheetVisible"-->
                <!--:cancel-text="cancelText"-->
                <!--v-on:click="onActionsheetClick">-->
        <!--</actionsheet>-->
    </div>
</template>

<script type="es6">
    import "./index.scss";
    let GeoLocation = require("COMMON/modules/geo-location");
    export default {
        data(){
            return {
                slideInitHeight : 150
            }
        },
        ready(){

        },
        methods : {

        },
        components : {
            fixHeader : require("./components/fix-header.vue"),
            slider : require("COMMON_VUE_COMPONENTS/slider.vue"),
            productList : require("./components/product-list.vue"),
            ptypeList : require("COMMON_VUE_COMPONENTS/ptype-list.vue"),
            pageFooter : require("COMMON_VUE_COMPONENTS/page-footer.vue")
        }
    }
</script>


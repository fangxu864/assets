<template>
    <div id="bodyContainer" class="bodyContainer">
        <div id="indexPageFixHeader">
            <fix-header>
                <a class="leftBtn" href="javascript:void(0)" @click="citySwitchorShow=true" slot="left">
                    <i class="iconfont icon-sevenbabicon31"></i>
                    <span class="t" v-text="city"></span>
                </a>
                <h3 class="fixHeaderTitle" slot="center">微商城首页</h3>
                <a class="rightBtn" href="javascript:void(0)" slot="right"><i class="iconfont icon-yonghu"></i></a>
            </fix-header>
        </div>
        <div id="bodyMainCon" class="bodyMainCon">
            <!--<slider :init-height="slideInitHeight"></slider>-->
            <!--<ptype-list></ptype-list>-->
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
        <actionsheet></actionsheet>
    </div>
</template>

<script type="es6">
    let GeoLocation = require("COMMON/modules/geo-location");
    export default {
        data(){
            return {
                area : "全国",
                slideInitHeight : 150,
                GeoLocation : GeoLocation,
                city : GeoLocation.getLastSwitchCity().city,
                city_id : "",
                loginShow : false,
                loginZIndex : 100,
                citySwitchorShow : false
            }
        },
        methods : {
            onCitySwitch(data){
                var city_id = data.id;
                var city_name = data.cityname;
                this.city = city_name;
                this.city_id = city_id;
                this.citySwitchorShow = false;
            }
        },
        components : {
            productList : require("./components/product-list.vue"),
            fixHeader : require("COMMON_VUE_COMPONENTS/fix-header.vue"),
            pageFooter : require("COMMON_VUE_COMPONENTS/page-footer.vue"),
            login : require("COMMON_VUE_COMPONENTS_B/login.vue"),
            citySwitchor : require("COMMON_VUE_COMPONENTS/city-switchor.vue"),
            actionsheet : require("COMMON_VUE_COMPONENTS/actionsheet.vue"),
            slider : require("COMMON_VUE_COMPONENTS/slider.vue"),
            ptypeList : require("COMMON_VUE_COMPONENTS/ptype-list.vue")
        }
    }
</script>


<template>
    <div id="bodyContainer" class="bodyContainer">
        <div id="indexPageFixHeader">
            <div class="con">
                <div class="searchBox">
                    <input @click="onSearchInpFocus" type="text" name="" placeholder="输入关键词搜索" id="searchInp" class="searchInp"/>
                </div>
                <a id="userBtn" class="rightBtn" href="usercenter.html" slot="right"><i class="uicon uicon-yonghu"></i></a>
                <div id="searchBtn" class="searchBtn hide"><i class="text">搜索</i></div>
            </div>
        </div>
        <div id="bodyMainCon" class="bodyMainCon">
            <div class="sliderModule">
                <slider :init-height="slideInitHeight"></slider>
            </div>
            <ptype-list></ptype-list>
            <product-list :area="city"></product-list>
        </div>
    </div>
</template>

<script type="es6">
    import "./index.scss";
    let Search = require("./search");
    export default {
        data(){
            return {
                //city : GeoLocation.getLastSwitchCity().city,
                //city_id : "",
                //citySwitchor : {
                //    GeoLocation : GeoLocation,
                //    show : false
                //},
                slideInitHeight : 150
            }
        },
        ready(){
            this.Search = new Search();
        },
        methods : {
            openCitySwitchor(){
                  console.log("openCitySwitchor")
            },
            onCitySwitch(data){
                this.city = data.cityname;
                this.city_id = data.id;
                this.citySwitchor.show = false;
            },
            onSearchInpFocus(e){
                this.Search.router.navigate("result",{trigger: true});
            }
        },
        components : {
            slider : require("COMMON_VUE_COMPONENTS/slider"),
            //fixHeader : require("COMMON_VUE_COMPONENTS/fix-header"),
            productList : require("./components/product-list"),
            //citySwitchor : require("COMMON_VUE_COMPONENTS/city-switchor"),
            ptypeList : require("COMMON_VUE_COMPONENTS/ptype-list")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/main";
    #bodyMainCon{ margin-top:px2rem(90); background:#fff;}
    $containerHeight:90;
    #indexPageFixHeader{
        position:fixed;
        left:0;
        right:0;
        top:0;
        height:px2rem($containerHeight);
        background:#fff;
        padding:8px 0 8px 10px;
        box-sizing:border-box;
        box-shadow:0 1px 1px rgba(0,0,0,0.1);
        z-index:10;
        .con{
            height:100%;
        }
        .searchBox{
            display:block;
            position:relative;
            height:100%;
            background:#e5f5fc;
            margin-right:60px;
            padding-left:7px;
            .searchInp{
                width:100%;
                height:100%;
                line-height:22px;
                background:none;
                border:0 none;
                padding:0;
                &:focus{
                    color:$orange;
                }
            }
        }
        .rightBtn{
            display:block;
            position:absolute;
            top:0;
            right:0;
            height:px2rem($containerHeight);
            width:60px;
            text-align:center;
            line-height:px2rem($containerHeight);
            .uicon{
                font-size:22px;
            }
            &.hide{ display:none}
        }
        .searchBtn{
            display:block;
            position:absolute;
            top:0;
            right:5px;
            height:px2rem($containerHeight);
            box-sizing:border-box;
            padding:8px 0;
            width:50px;
            text-align:center;
            .text{
                display:block;
                height:100%;
                line-height:29px;
                background:$orange;
                color:#fff;
            }
            &.hide{ display:none}
        }
    }
    #indexPageFixHeader .searchBox .iconfont{ font-size:0.48rem; margin-right:3px; top:1px;}

</style>

<template>
    <div id="citySwitchPage" class="citySwitchPage" :class="{'show':show}"  :style="{zIndex:zIndex}">
        <fix-header>
            <a class="leftBtn" href="javascript:void(0)" slot="left"><i class="iconfont icon-back"></i></a>
            <h3 class="fixHeaderTitle" slot="center">选择城市</h3>
            <a class="rightBtn" href="javascript:void(0)" slot="right"><i class="iconfont icon-yonghu"></i></a>
        </fix-header>
        <div class="searchContainer">
            <search-box
                v-on:keyword-change="onKeyValueChange"
                :debounce="200"
                placeholder="福州 / fuzhou / fz">
            </search-box>
        </div>
        <div class="citySwitchMain">
            <div class="lineItem locationCity">
                <div class="con">
                    <i class="iconfont">&#xe603;</i>
                    <span class="t">定位城市：</span><span class="city t"></span>
                </div>
                <div class="attr">
                    <i class="iconfont checkbox selected">&#xe664;</i><i class="iconfont checkbox unselect">&#xe665;</i>
                </div>
            </div>
            <div class="lineItem allCity">
                <div class="con">
                    <i class="iconfont">&#xe6a7;</i>
                    <span class="t">所有城市</span>
                </div>
                <div class="attr">
                    <i class="iconfont checkbox selected">&#xe664;</i><i class="iconfont checkbox unselect">&#xe665;</i>
                </div>
            </div>
            <template v-if="cityStatus=='success'">
                <ul class="allcityUl"></ul>
            </template>
            <template v-if="cityStatus!=='success'">
                <div class="cityStatus" v-text="cityStatusText"></div>
            </template>
        </div>
    </div>
</template>
<script type="es6">
    let GeoLocation = require("COMMON/modules/geo-location");
    let FetchCityList = require("SERVICE_M/getcity-from-product.js");
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
                locationCity : "",
                loationState : "",
                keyword : "",
                cityStatus : "",
                cityStatusText : {
                    loading : "努力加载中...",
                    complete : "请求完成...",
                    empty : "暂无城市...",
                    fail : "请求出错，请稍后重试..."
                },
                cityList : null
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
            this.getCityList();
        },
        methods : {
            onKeyValueChange(value){
                this.keyword = value;
            },
            getCityList(){
                let that = this;
                FetchCityList({
                    loading : function(){
                        that.cityStatus = "loading";
                        that.cityStatusText = "努力加载中...";
                    },
                    complete : function(){
                        that.cityStatus = "complete";
                        that.cityStatusText = "请求完成...";
                    },
                    success : function(res){
                        that.cityStatus = "success";
                        that.cityStatusText = "请求成功...";
                    },
                    empty : function(res){
                        that.cityStatus = "empty";
                        that.cityStatusText = "暂无城市...";
                    },
                    fail : function(res){
                        that.cityStatus = "fail";
                        that.cityStatusText = res.msg || "请求出错，请稍后重试...";
                    }
                })
            }
        },
        components : {
            fixHeader : require("COMMON_VUE_COMPONENTS/fix-header.vue"),
            searchBox : require("COMMON_VUE_COMPONENTS/search-box.vue")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/core/_px2rem.scss";
    $lineItemHeight : 1.2rem;
    #citySwitchPage{ position:absolute; top:0; left:0; right:0; bottom:0; background:#dae1e4; overflow:auto; -webkit-overflow-scrolling:touch}
    #citySwitchPage.show{ display:block; z-index:100;}
    #citySwitchPage .citySwitchMain{ margin-top:90px;}
    #citySwitchPage .lineItem{
        position:relative;
        padding:0 10px;
        background:#fff;
        margin-bottom:1px;
        color:#555;
    }
    #citySwitchPage .lineItem:active{
        background:#f7f7f7;
    }
    #citySwitchPage .lineItem > .con{
        height:$lineItemHeight;
        line-height:$lineItemHeight;
        margin-right:20px;
        overflow:hidden;
    }
    #citySwitchPage .lineItem > .attr{
        position:absolute;
        top:0;
        right:10px;
        bottom:0;
        line-height:$lineItemHeight;
        text-align:right;
    }
    #citySwitchPage .lineItem > .attr .iconfont{ display:none; font-size:0.5rem;}
    #citySwitchPage .lineItem > .attr .iconfont.unselect{ display:inline-block;}
    #citySwitchPage .lineItem.selected > .attr .iconfont.unselect{ display:none}
    #citySwitchPage .lineItem.selected > .attr .iconfont.selected{ display:inline-block}
    #citySwitchPage .lineItem .t{ font-size:0.4rem}
</style>
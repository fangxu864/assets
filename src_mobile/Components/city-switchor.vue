<template>
    <div id="citySwitchPage" class="citySwitchPage" :class="{'show':show}"  :style="{zIndex:zIndex}">
        <fix-header>
            <a class="leftBtn" @click="onGoBackBtnClick" href="javascript:void(0)" slot="left"><i class="iconfont icon-back"></i></a>
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
            <div class="lineItem locationCity" @click="onLocationCityClick" :class="{'selected':selectedId=='location'}">
                <div class="con">
                    <i class="iconfont">&#xe603;</i>
                    <span class="city t" v-text="locationCity"></span>
                </div>
                <div class="attr">
                    <i class="iconfont checkbox selected">&#xe664;</i><i class="iconfont checkbox unselect">&#xe665;</i>
                </div>
            </div>
            <div class="lineItem allCity" @click="onAllCityClick" :class="{'selected':selectedId=='all'}">
                <div class="con">
                    <i class="iconfont">&#xe6a7;</i>
                    <span class="t">所有城市</span>
                </div>
                <div class="attr">
                    <i class="iconfont checkbox selected">&#xe664;</i><i class="iconfont checkbox unselect">&#xe665;</i>
                </div>
            </div>
            <template v-if="cityStatus=='success'">
                <ul class="allcityUl">
                    <li class="cityGroup" v-for="(index,group) in cityList">
                        <p class="cityLetter" v-text="index"></p>
                        <ul class="group">
                            <li class="lineItem cityItem"
                                v-for="item in group"
                                @click="onCityItemClick"
                                :class="{'selected':(item.id && item.id==selectedId)}"
                                :data-id="item.id"
                                :data-pinyin="item.pinyin"
                                :data-shouzimu="item.shouzimu"
                                :data-letter="item.a"
                                :data-hanzi="item.hanzi">
                                <div class="con">
                                    <span class="t" v-text="item.hanzi"></span>
                                </div>
                                <div class="attr"><i class="iconfont checkbox selected">&#xe664;</i><i class="iconfont checkbox unselect">&#xe665;</i></div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </template>
            <template v-if="cityStatus!=='success'">
                <div class="cityStatus" v-text="cityStatusText"></div>
            </template>
        </div>
    </div>
</template>
<script type="es6">
    //let GeoLocation = require("COMMON/modules/geo-location");
    let FetchCityList = require("SERVICE_M/getcity-from-product.js");
    export default {
        props : {
            geoLocation : {
                type : Object,
                default : {},
                require : true
            },
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
                locationState : "",
                cityStatus : "",
                selectedId : "",
                cityStatusText : {
                    loading : "努力加载中...",
                    complete : "请求完成...",
                    empty : "暂无城市...",
                    fail : "请求出错，请稍后重试..."
                },
                __cityList_cache : null,
                cityList : null
            }
        },
        ready(){
            let GeoLocation = this.geoLocation;
            GeoLocation.on("loading",() => {
                this.locationCity = "正在定位...";
                this.locationState = "loading";
            })
            GeoLocation.on("complete",() => {
                this.locationCity = "定位完成";
                this.locationState = "complete";
            })
            GeoLocation.on("success",city => {
                this.locationCity = city;
                this.locationState = "success";
            })
            GeoLocation.on("fail",() => {
                this.locationCity = "系统无法定位到您所在位置";
                this.locationState = "fail";
            })

            GeoLocation.locate();

            this.getCityList();

        },
        methods : {
            filter : function(val){
                var all = this.__cityList_cache;
                if(!val) return all;
                val = val.toLowerCase();
                var result = {};
                var first_letter = val.substring(0,1);
                if(PFT.Util.Validate.typee(first_letter)){ //首字符是英文
                    var citys = all[first_letter];
                    if(citys){
                        var arr = [];
                        for(var i in citys){
                            var city = citys[i];
                            var pin = city["pinyin"];
                            var abb = city["shouzimu"];
                            var hanzi = city["hanzi"];
                            if(pin.indexOf(val)>-1 || abb.indexOf(val)>-1 || hanzi.indexOf(val)>-1){
                                arr.push({
                                    a: city["a"],
                                    hanzi : hanzi,
                                    id : city["id"],
                                    pinyin : pin,
                                    shouzimu : abb
                                })
                            }
                        }
                        if(arr.length) result[first_letter] = arr;
                    }
                }else if(PFT.Util.Validate.typeChina(first_letter)){ //首字符是中文
                    for(var i in all){
                        var group = all[i];
                        var _arr = [];
                        for(var g in group){
                            var city = group[g];
                            var hanzi = city["hanzi"];
                            if(hanzi.indexOf(val)>-1){
                                _arr.push({
                                    a: city["a"],
                                    hanzi : city["hanzi"],
                                    id : city["id"],
                                    pinyin : city["pinyin"],
                                    shouzimu : city["shouzimu"]
                                })
                            }
                        }
                        if(_arr.length) result[i] = _arr;
                    }
                }
                return result;
            },
            onKeyValueChange(value){
                if(this.cityStatus!=="success") return false;
                this.cityList = this.filter(value);
            },
            onCityItemClick(e){
                var GeoLocation = this.geoLocation;
                var tarItem = $(e.target).parents(".cityItem");
                if(tarItem.hasClass("selected")) return false;
                this.selectedId = tarItem.attr("data-id");
                var id = tarItem.attr("data-id");
                var cityname = tarItem.attr("data-hanzi");
                GeoLocation.setLastSwitchCity(cityname,id);
                this.$dispatch("switch",{
                    type : "city",
                    id : id,
                    cityname : cityname,
                    pinyin : tarItem.attr("data-pinyin"),
                    shouzimu : tarItem.attr("data-shouzimu"),
                    letter : tarItem.attr("data-letter")
                })
            },
            onLocationCityClick(e){
                var GeoLocation = this.geoLocation;
                var tarItem = $(e.target).parents(".locationCity");
                if(tarItem.hasClass("selected") || this.locationState!=="success") return false;
                this.selectedId = "location";
                GeoLocation.setLastSwitchCity(this.locationCity,"");
                this.$dispatch("switch",{
                    type : "location",
                    id : "",
                    cityname : this.locationCity,
                    pinyin : "",
                    shouzimu : "",
                    letter : ""
                })
            },
            onAllCityClick(e){
                var GeoLocation = this.geoLocation;
                var tarItem = $(e.target).parents(".allCity");
                if(tarItem.hasClass("selected")) return false;
                this.selectedId = "all";
                var cityname = "全国";
                GeoLocation.setLastSwitchCity(cityname,"");
                this.$dispatch("switch",{
                    type : "all",
                    id : "",
                    cityname : cityname,
                    pinyin : "",
                    shouzimu : "",
                    letter : ""
                })
            },
            onGoBackBtnClick(e){
                this.$dispatch("close")
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
                        that.cityList = res.areas;
                        that.__cityList_cache = res.areas;
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
    $lineItemHeight : 1.25rem;
    #citySwitchPage .gFixHeader{ position:absolute;}

    #citySwitchPage{
        position:fixed; top:0; bottom:0; left:0; right:0; background:#dae1e4; overflow:auto;
        -webkit-overflow-scrolling:touch;
        transform:translateX(100%);
        transition:transform 0.2s;
    }
    #citySwitchPage .fixHeaderTitle{ text-align:center}
    #citySwitchPage.show{ display:block; z-index:100; transform:translateX(0)}
    #citySwitchPage .searchContainer{ position:absolute; top:px2rem(85); right:0; left:0; z-index:2; border-bottom:1px solid #dbdbdb}
    #citySwitchPage .citySwitchMain{ position:absolute; top:90px; left:0; right:0; bottom:0; overflow:auto; -webkit-overflow-scrolling:touch}
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
    #citySwitchPage .lineItem.selected > .attr .iconfont.selected{ display:inline-block; color:#008fc2}
    #citySwitchPage .lineItem .t{ font-size:0.4rem}
    #citySwitchPage .lineItem.selected .t{ color:#008fc2}
    #citySwitchPage .cityStatus{ height:3rem; line-height:3rem; text-align:center; background:#fff}
    #citySwitchPage .allcityUl{ margin-top:5px;}
    #citySwitchPage .allcityUl .cityLetter{ font-size:0.6rem; padding:10px 0 5px 10px}
</style>
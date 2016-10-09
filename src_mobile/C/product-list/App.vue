<template>
    <div class="bodyContainer">
        <div id="scrollWrap" class="scrollWrap">
            <scroller
                    v-if="ready"
                    v-ref:scroller
                    :height="scrollerHeight"
                    :lock-x="true"
                    :use-pulldown="false"
                    :use-pullup="true"
                    :lock-y="false"
                    :pullup-config="pullupConfig"
                    v-on:pullup:loading="onPullupLoading"
                    :scrollbar-x="false">
                <div class="scrollCon">
                    <ul class="scrollInerCon">
                        <li class="item" v-for="item in list" v-text="item"></li>
                    </ul>
                </div>
            </scroller>
        </div>
        <div id="filterBar" class="filterBar ui-filterBar" :class="{hide:filterBarHide}">
            <div class="con ui-flex">
                <a id="switchTopicBtn" @click="onSwitchTopicBtnClick" href="javascript:void(0)" style="display:block; color:#fff" class="ui-filterItem ui-filterItem-tap ui-filterItem-topic ui-flex-box topic">
                    <span class="t" v-text="topicName"></span>
                </a>
                <a id="switchPtypeBtn" @click="onSwitchPtypeBtnClick" href="javascript:void(0)" class="ui-filterItem ui-flex-box ui-filterItem-ptype ptype" data-param="type" data-val="<?=$ptype?>" data-show="<?=$ptype_text?>" style="color:#fff">
                    <span class="t" v-text="ptypeName"></span>
                </a>
                <a id="switchCityBtn" @click="onSwitchCityBtnClick" href="javascript:void(0)" class="ui-filterItem ui-flex-box ui-filterItem-city city" data-param="area" data-val="<?=$city_id?>" data-show="<?=$city?>" style="color:#fff">
                    <span class="t" v-text="cityName"></span>
                </a>
            </div>
        </div>
        <sheet-action
                v-on:click="onPtypeItemClick"
                v-on:cannel="filterBarHide=false"
                :menus="ptypeList"
                :cancel-text="'取消'"
                :show.sync="ptypeShow">
        </sheet-action>
        <sheet-action
                v-on:click="onTopicItemClick"
                v-on:cannel="filterBarHide=false"
                :height="winHeight+'px'"
                :menus="topicList"
                :cancel-text="'取消'"
                :show.sync="topicShow">
        </sheet-action>
        <sheet-core :height="winHeight+'px'" :show.sync="cityShow">
            <div class="citySwitchContainer" slot="content">
                <fix-header>
                    <a class="leftBtn" @click="onCitySwitchClose('cannel')" href="javascript:void(0)" slot="left"><i class="uicon uicon-jiantou-sin-left"></i></a>
                    <h3 class="fixHeaderTitle" style="text-align:center" slot="center">选择城市</h3>
                </fix-header>
                <ul class="cityList">
                    <li v-for="(pin,city) in cityList" class="group">
                        <p class="pin">{{ pin | uppercase }}</p>
                        <p class="cityItem" @click="onCitySwitchClose" v-for="item in city" data-code="{{item.code}}" v-text="item.name"></p>
                    </li>
                </ul>
                <div class="fixBtnGroup">
                    <div class="con ui-flex">
                        <a href="javascript:void(0)" @click="onCitySwitchClose('cannel')" class="btn cannel ui-flex-box">取消</a>
                        <a href="javascript:void(0)" @click="onCitySwitchClose('all')" class="btn all ui-flex-box">全部</a>
                    </div>
                </div>
            </div>
        </sheet-core>
    </div>
</template>
<script type="es6">
    const FetchList = require("SERVICE_M/product-list");
    let Toast = new PFT.Mobile.Toast();
    let Alert = PFT.Mobile.Alert;
    let CityData = require("COMMON/js/config.province.city.data2");
    export default{
        data(){
            return{
                ready : false,
                filterBarHide : true,
                winHeight : 0,
                scrollerHeight : "",
                currentPage : 0,
                totalPage : 0,
                //搜索条件
                filterParams : {
                    keyword : "",
                    topic : "",
                    ptype : "",
                    city : "",
                    lastPos : ""
                },
                topicList : (function(){
                    var res = {};
                    for(var i=0; i<50; i++){
                        res[i] = "第"+i+"项";
                    }
                    return res;
                })(),
                topicShow : false,
                ptypeList : PFT.Config.ptype,
                ptypeShow : false,
                cityList : {},
                cityName : "全部",
                cityShow : false,
                list : [],
                pullupConfig : {
                    content: '查看更多订单..',
                    pullUpHeight: 60,
                    height: 40,
                    autoRefresh: false,
                    downContent: '释放以加载更多..',
                    upContent: '查看更多订单..',
                    loadingContent: '努力加载中..',
                    clsPrefix: 'xs-plugin-pullup-'
                }
            }
        },
        ready(){
            //this.initRouter();
            this.winHeight = $(window).height();
            this.scrollWrap = $("#scrollWrap");
            this.fetchData();
        },
        watch : {
            "filterParams.ptype" : function(val,oldVal){
                console.log(val,oldVal)
            }
        },
        computed : {
            ptypeName(){
                return this.ptypeList[this.filterParams.ptype] || "景区门票";
            },

            topicName(){
                return this.filterParams.topic ? this.filterParams.topic : "不限"
            }
        },
        methods : {
            initRouter(){
                var that = this;
                var Router = Backbone.Router.extend({
                    routes : {
                        "" : "index",
                        "city" : "city",
                        "topic/:topic" : "topic",
                        "ptype" : "ptype"
                    },
                    initialize : function(){

                    },
                    index : function(){

                    },
                    city : function(){
                        console.log("city");

                    }
                })
                new Router;
                Backbone.history.start();
            },
            onPtypeItemClick(ptype){
                this.filterParams.ptype = ptype;
                this.filterBarHide = false;
            },
            onSwitchPtypeBtnClick(e){
                this.ptypeShow = true;
                this.filterBarHide = true;
            },
            onTopicItemClick(topic,topicText){
                this.filterParams.topic = topicText;
                this.filterBarHide = false;
            },
            onSwitchTopicBtnClick(e){
                this.topicShow = true;
                this.filterBarHide = true;
            },
            onSwitchCityBtnClick(e){
                this.cityShow = true;
                this.filterBarHide = true;
            },
            onCitySwitchClose(type){
                if(typeof type=="string"){
                    if(type=="all"){
                        this.filterParams.city = "";
                        this.cityName = "全部";
                    }
                }else{
                    var tarItem = $(type.target);
                    var cityName = tarItem.text();
                    var code = tarItem.attr("data-code");
                    tarItem.parents(".cityList").find(".cityItem").removeClass("active");
                    tarItem.addClass("active");
                    this.filterParams.city = code;
                    this.cityName = cityName;
                }
                this.cityShow = false;
                this.filterBarHide = false;
            },
            fetchData(){
                var params = this.filterParams;
                FetchList(params,{
                    loading : () => {
                        if(params.lastPos===""){
                            Toast.show("loading","努力加载中..");
                        }
                    },
                    complete : () => {
                        Toast.hide();
                    },
                    empty : () => {
                        this.disableScroll();
                        Alert("提示","没有更多匹配条件的产品了..");
                    },
                    success : (data) => {
                        this.cityList = data.citys;
                        this.list = this.list.concat(data.list);
                        this.filterParams.lastPos = data.lastPos;
                        if(!this.ready){
                            this.scrollerHeight = String(this.scrollWrap.height())+"px";
                            this.ready = true;
                        }
                        this.$nextTick(()=>{
                            this.enableScroll();
                            this.resetScroll();
                        })
                    },
                    fail : () => {}
                })
            },
            onPullupLoading(uuid){
                this.fetchData();
                setTimeout(()=>{
                    //this.$broadcast('pullup:reset',uuid);
                    //this.$broadcast('pullup:disable',uuid);
                    //this.$broadcast('pullup:enable',uuid);
                    //this.$nextTick(() => {
                    //    this.$refs.scroller.reset()
                    //})
                },1000)
            },
            disableScroll(){
                this.$broadcast('pullup:disable', this.$refs.scroller.uuid);
            },
            enableScroll(){
                this.$broadcast('pullup:enable', this.$refs.scroller.uuid);
            },
            resetScroll(){
                this.$refs.scroller.reset();
            }
        },
        components : {
            scroller : require("vux/src/components/scroller/index.vue"),
            sheetAction : require("COMMON_VUE_COMPONENTS/sheet-action"),
            sheetCore : require("COMMON_VUE_COMPONENTS/sheet-core"),
            fixHeader : require("COMMON_VUE_COMPONENTS/fix-header")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/main";
    body{ background:$bgColor}
    $tabHeight : 42px;
    .scrollWrap{ position:absolute; top:$tabHeight; left:0; right:0; bottom:47px; overflow:hidden}

    .item{ height:150px; line-height:150px; text-align:center; background:#fff; margin-bottom:10px;}
    .item:last-child{ margin-bottom:0}

    .ui-filterBar{ position:fixed; left:0; right:0; bottom:0; height:40px; z-index:10003; transition:all 0.4s; background:rgba(40,56,71,.90)}
    .ui-filterBar.hide{ bottom:-100px;}
    .ui-filterBar > .con{ width:100%; height:100%; position:relative; overflow:hidden; color:#fff}
    .ui-filterBar .ui-filterItem{ height:100%; line-height:50px; text-align:center; font-size:14px;}
    .ui-filterBar .ui-filterItem.today .iconfont.checked{ display:none}
    .ui-filterBar .ui-filterItem.today.active .iconfont{ display:none}
    .ui-filterBar .ui-filterItem.today.active .iconfont.checked{ display:inline-block}
    .ui-filterBar .ui-filterItem .iconfont{ vertical-align:middle; margin-right:2px}
    .ui-filterBar .ui-filterItem .t{ position:relative; top:1px; vertical-align:middle;}
    .ui-filterBar .ui-filterItem.today .iconfont{ margin-right:0; top:1px}
    .ui-filterBar .ui-filterItem.topic .iconfont{ margin-right:3px}
    .ui-filterBar .ui-filterItem{ line-height:40px;}
    .ui-flex{ width:100%;
        display:-webkit-box;
        display:-webkit-flex;
        display:flex;
        -webkit-flex-flow:row;
        flex-flow:row;
    }
    .ui-flex .ui-flex-box{
        display:block;
        -webkit-box-flex:1;
        -webkit-flex:1;
        flex:1
    }


    .citySwitchContainer{
        height:100%; overflow:auto; background:#fafafa;
        .gFixHeader{
            position:absolute;
            top:0;
            left:0;
            right:0;
        }
        .fixBtnGroup{
            position:absolute;
            left:0;
            right:0;
            bottom:0;
            height:40px;
            background:#fff;
            border-top:1px solid #e5e5e5;
            .btn{
                position:relative;
                display:block;
                height:100%;
                line-height:40px;
                text-align:center;
            }
            .btn.cannel:after{
                content:"";
                position:absolute;
                width:1px;
                top:0;
                bottom:0;
                right:0;
                font-size:0;
                background:#e5e5e5;
            }
        }
        .cityList{
            margin-top:55px;
            margin-bottom:45px;
            .group{
                margin-bottom:15px;

                .pin{ padding-left:20px; font-size:16px; margin-bottom:5px; font-weight:bold}

                .cityItem{
                    padding-left:20px;
                    height:44px;
                    line-height:44px;
                    border-top:1px solid #e5e5e5;
                    background:#fff;
                    &:last-child{ border-bottom:1px solid #e5e5e5;}
                    &.active{ color:#2A98DA}
                }

                &:last-child{ margin-bottom:0}
            }

        }
    }

    .xs-plugin-pullup-container{ line-height:40px}

</style>
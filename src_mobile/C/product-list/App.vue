<template>
    <div class="bodyContainer">
        <div class="fixHeader">
            <div class="searchBoxWrap">
                <search-box :debounce="400" v-on:keyword-change="onKeywordChange" v-on:focus="onSearchInpFocus" v-on:blur="onSearchInpBlur"></search-box>
            </div>
            <a id="userBtn" href="usercenter.html" class="userBtn"><i class="uicon uicon-yonghu"></i></a>
            <a id="searchBtn" href="javascript:void(0)" class="searchBtn hide">搜索</a>
        </div>
        <div id="scrollWrap" class="scrollWrap">
            <scroller
                    v-if="isReady"
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
                        <li v-for="item in list" :class="{item:!item.type,itemBox:!item.type,emptyTip:item.type=='empty'}">
                            <template v-if="!item.type">
                                <a href="pdetail.html?lid={{item.lid}}&ptype={{filterParams.type}}&topic={{filterParams.topic}}" class="con">
                                    <div class="photoBox">
                                        <image-loador :src="item.imgpath" :height="imgHeight" :fixed="true"></image-loador>
                                        <p class="title gtextoverflow">{{item.title}}</p>
                                    </div>
                                    <div class="bCon">
                                        <span class="price"><i class="yen">&yen;</i><span class="num">{{item.jsprice}}</span><i class="qi">起</i></span>
                                        <span class="price tprice"><i class="yen">&yen;</i><span class="num">{{item.tprice}}</span></span>
                                    </div>
                                </a>
                            </template>
                            <template v-if="item.type=='empty'">
                                <div>没有更多了...</div>
                            </template>
                            <template v-if="item.type=='no-search-result'">
                                <div class="noSearchResult">暂无匹配产品...</div>
                            </template>
                        </li>
                    </ul>
                </div>
            </scroller>
        </div>
        <div id="filterBar" class="filterBar ui-filterBar" :class="{hide:filterBarHide}">
            <div class="con ui-flex">
                <a id="switchTopicBtn" @click="onSwitchTopicBtnClick" href="javascript:void(0)" style="display:block;" class="ui-filterItem ui-filterItem-tap ui-filterItem-topic ui-flex-box topic">
                    <i class="filterIcon icon-ecshop-application icon-zhuti"></i>
                    <span class="t" v-text="topicName"></span>
                </a>
                <a id="switchPtypeBtn" @click="onSwitchPtypeBtnClick" href="javascript:void(0)" class="ui-filterItem ui-flex-box ui-filterItem-ptype ptype">
                    <i class="filterIcon icon-u-regular icon-dizhi"></i>
                    <span class="t" v-text="ptypeName"></span>
                </a>
                <a id="switchCityBtn" @click="onSwitchCityBtnClick" href="javascript:void(0)" class="ui-filterItem ui-flex-box ui-filterItem-city city">
                    <i class="filterIcon icon-ecshop-application icon-suoyouchengshi"></i>
                    <span class="t" v-text="cityName"></span>
                </a>
            </div>
        </div>
        <sheet-action
                v-on:click="onPtypeItemClick"
                v-on:cannel="filterBarHide=false"
                :init-trigger="false"
                :menus="ptypeList"
                :cancel-text="'取消'"
                :show.sync="ptypeShow">
        </sheet-action>
        <sheet-action
                v-on:click="onTopicItemClick"
                v-on:cannel="onTopicNoLimitBtnClick"
                :init-trigger="false"
                :menus="topicList"
                :cancel-text="'不限'"
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
                        <a href="javascript:void(0)" @click="onCitySwitchClose('all')" class="btn all ui-flex-box">所有城市</a>
                    </div>
                </div>
            </div>
        </sheet-core>
    </div>
</template>
<script type="es6">

    //返回首页按钮
    let ReturnHome = require("./returnHomeBtn");   
    const FetchList = require("SERVICE_M/product-list");
    let Toast = new PFT.Mobile.Toast();
    let Alert = PFT.Mobile.Alert;
    let CityData = require("COMMON/js/config.province.city.data2");
    let Ptype = PFT.Util.UrlParse()["ptype"];
    let theme = PFT.Util.UrlParse()["theme"];
    if(Ptype){
        Ptype = decodeURIComponent(Ptype);
    }else{
        Ptype = "all";
    }
    if(theme){
        theme = decodeURIComponent(theme);
    }else{
        theme = "";
    }
    export default{
        data(){
            return{
                isReady : false,
                filterBarHide : false,
                winHeight : 0,
                scrollerHeight : "",
                currentPage : 0,
                totalPage : 0,
                imgHeight : 115,
                //搜索条件
                filterParams : {
                    keyword : "",
                    topic : theme,
                    type : Ptype,
                    city : "",
                    lastPos : ""
                },
                topicList : [],
                topicShow : false,
                ptypeList : {},
                ptypeShow : false,
                cityList : {},
                cityName : "所有城市",
                cityShow : false,
                list : [],
                pullupConfig : {
                    content: '查看更多..',
                    pullUpHeight: 60,
                    height: 40,
                    autoRefresh: false,
                    downContent: '释放以加载更多..',
                    upContent: '查看更多..',
                    loadingContent: '努力加载中..',
                    clsPrefix: 'xs-plugin-pullup-'
                },
                scrollStatus : "enable"
            }
        },
        ready(){
            var that = this;
            this.winHeight = $(window).height();
            this.scrollWrap = $("#scrollWrap");
            this.fetchData();
            document.getElementById("searchBtn").addEventListener("touchstart",function(e){
                that.onSearchBtnClick(e);
            },false)

            new ReturnHome();  
        },
        watch : {
            "filterParams.type" : function(val,oldVal){
                this.onFilterParamsChange();
            },
            "filterParams.city" : function(val,oldVal){
                this.onFilterParamsChange();
            },
            "filterParams.topic" : function(val,oldVal){
                this.onFilterParamsChange();
            },
            "filterParams.keyword" : function(val,oldVal){
                this.onFilterParamsChange();
            }
            //"filterParams" : { //有bug
            //    handler : function(val,oldVal){
            //        console.log(val.lastPos,oldVal.lastPos)
            //        if(val.ptype==oldVal.ptype && val.topic==oldVal.topic && val.city==oldVal.city && val.keyword==oldVal.keyword) return false;
            //        console.log(val);
            //    },
            //    deep : true
            //}
        },
        computed : {
            ptypeName(){
                return this.ptypeList[this.filterParams.type];
            },
            topicName(){
                return this.filterParams.topic ? this.filterParams.topic : "主题"
            }
        },
        methods : {
            onPtypeItemClick(ptype){
                this.filterParams.type = ptype;
                this.filterBarHide = false;
            },
            onSwitchPtypeBtnClick(e){
                this.ptypeShow = true;
                this.filterBarHide = true;
            },
            onTopicItemClick(topic,topicText){
                if(!topic && !topicText) return false;
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
                        this.cityName = "所有城市";
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
            onKeywordChange(keyword){
                this.$set("filterParams.keyword",keyword);
            },
            onFilterParamsChange(){
                this.$set("filterParams.lastPos","");
                this.$set("list",[]);
                this.fetchData();
            },
            onTopicNoLimitBtnClick(e){
                this.filterBarHide = false;
                this.$set("filterParams.topic","");
                this.topicShow = false;
                $(e.target).prev().children().removeClass("selected");
            },
            onSearchInpFocus(e){
                //document.getElementById("searchBtn").classList.remove("hide");
                //document.getElementById("userBtn").classList.add("hide");
            },
            onSearchInpBlur(e){
                //document.getElementById("searchBtn").classList.add("hide");
                //document.getElementById("userBtn").classList.remove("hide");
            },
            onSearchBtnClick(e){
                var tarBtn = $(e.target);
                if(tarBtn.hasClass("disable")) return false;
                var keyword = this.filterParams.keyword;
                keyword = $.trim(keyword);
                if(!keyword) return false;
                this.onFilterParamsChange();
            },
            fetchData(){
                var params = this.filterParams;
                FetchList(params,{
                    loading : () => {
                        if(params.lastPos===""){
                            Toast.show("loading","努力加载中..");
                            //if(this.ready) this.disableScroll();
                        }
                    },
                    complete : () => {
                        Toast.hide();
                    },
                    empty : (data) => {
                        this.disableScroll();
                        if(!this.isReady) this.isReady = true;
                        if(this.filterParams.lastPos==""){
                            if(data.citys) this.$set("cityList",data.citys);
                            var themes = data.themes;
                            var type = data.type;
                            if(type){
                                var adaptType = {};
                                for(var i=0; i<type.length; i++){
                                    var ptype = type[i]["identify"];
                                    var ptypeName = type[i]["name"];
                                    adaptType[ptype] = ptypeName;
                                }
                                this.ptypeList = adaptType;
                            }
                            if(themes){
                                var __themes = {};
                                for(var i in themes) __themes[i] = themes[i];
                                this.$set("topicList",__themes);
                            }
                            //Alert("提示","查无匹配条件的产品..");

                            this.list = [{type:"no-search-result"}];
                        }else{
                            Alert("没有更多匹配条件的产品了..");
                            this.list.push({type:"empty"});
                            this.$nextTick(()=>{
                                this.resetScroll();
                            })
                        }
                    },
                    success : (data) => {
                        var that = this;
                        if(data.citys) this.$set("cityList",data.citys);
                        var themes = data.themes;
                        var type = data.type;
                        if(type){
                            var adaptType = {};
                            for(var i=0; i<type.length; i++){
                                var ptype = type[i]["identify"];
                                var ptypeName = type[i]["name"];
                                adaptType[ptype] = ptypeName;
                            }
                            this.ptypeList = adaptType;
                        }
                        if(themes){
                            var __themes = {};
                            for(var i in themes) __themes[i] = themes[i];
                            this.$set("topicList",__themes);
                        }
                        this.$set("list",this.list.concat(data.list));
                        if(!this.isReady){
                            this.scrollerHeight = String(this.scrollWrap.height())+"px";
                            this.isReady = true;
                        }
                        this.$nextTick(()=>{
                            if(this.filterParams.lastPos==""){
                                var container = document.querySelector("#scrollWrap .xs-container");
                                container.style["transform"] = "translate(0px,0px) translateZ(0px)";
                            }
                            this.enableScroll();
                            this.resetPullup();
                            this.resetScroll();
                            this.$set("filterParams.lastPos",data.lastPos);
                        })
                    },
                    fail : (msg) => {
                        Alert(msg);
                    }
                })
            },
            onPullupLoading(uuid){
                this.fetchData();
            },
            disableScroll(){
                if(this.scrollStatus=="disable") return false;
                if(this.$refs.scroller && this.$refs.scroller.uuid){
                    this.$broadcast('pullup:disable', this.$refs.scroller.uuid);
                }
                this.scrollStatus = "disable";
            },
            enableScroll(){
                if(this.scrollStatus=="enable") return false;
                if(this.$refs.scroller && this.$refs.scroller.uuid){
                    this.$broadcast('pullup:enable', this.$refs.scroller.uuid);
                }
                this.scrollStatus = "enable";
            },
            resetPullup(){
                if(this.$refs.scroller && this.$refs.scroller.uuid){
                    this.$broadcast('pullup:reset', this.$refs.scroller.uuid)
                }
            },
            resetScroll(){
                this.$refs.scroller && this.$refs.scroller.reset();
            }
        },
        components : {
            scroller : require("vux/src/components/scroller/index.vue"),
            sheetAction : require("COMMON_VUE_COMPONENTS/sheet-action"),
            sheetCore : require("COMMON_VUE_COMPONENTS/sheet-core"),
            searchBox : require("COMMON_VUE_COMPONENTS/search-box"),
            fixHeader : require("COMMON_VUE_COMPONENTS/fix-header"),
            imageLoador : require("COMMON_VUE_COMPONENTS/image-loador")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/main";
    body{ background:$bgColor}
    .scrollWrap{ position:absolute; top:52px; left:0; right:0; bottom:50px; overflow:hidden}

    .item{ text-align:center; background:#fff; margin-bottom:10px;}
    .item:last-child{ margin-bottom:0}

    .ui-filterBar{
        position:fixed;
        left:0; right:0; bottom:0; height:44px;
        z-index:10003;
        transition:all 0.4s;
        /*background:rgba(40,56,71,.90)*/
        background:#f0f4f5;
        box-shadow:0 -1px 3px rgba(0,0,0,0.2);
    }
    .ui-filterBar.hide{ bottom:-100px;}
    .ui-filterBar > .con{ width:100%; height:100%; position:relative; overflow:hidden;}
    .ui-filterBar .ui-filterItem{ height:100%; padding-top:6px; text-align:center; font-size:14px; color:#777}
    .ui-filterBar .ui-filterItem.today .iconfont.checked{ display:none}
    .ui-filterBar .ui-filterItem.today.active .iconfont{ display:none}
    .ui-filterBar .ui-filterItem.today.active .iconfont.checked{ display:inline-block}
    .ui-filterBar .ui-filterItem .filterIcon{ }
    .ui-filterBar .ui-filterItem .t{ position:relative; display:block; margin-top:3px}
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
        position:relative;
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
            position:absolute;
            top:46px;
            left:0;
            right:0;
            bottom:42px;
            width:100%;
            overflow:auto;
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
                &:first-child{ margin-top:10px}
            }

        }
    }

    .fixHeader{
        position:fixed;
        top:0;
        left:0;
        right:0;
        height:45px;
        box-shadow:0 1px 1px rgba(0,0,0,0.1);
        background:#fff;
        overflow:hidden;

        .searchBoxWrap{
            position:absolute;
            left:0;
            top:0;
            bottom:0;
            right:60px;
        }

        .userBtn{
            display:block;
            float:right;
            width:60px;
            height:100%;
            line-height:45px;
            text-align:center;
            .uicon{
                font-size:18px;
            }
            &.hide{ display:none}
        }
        .searchBtn{
            display:block;
            position:absolute;
            top:8px;
            bottom:8px;
            right:8px;
            width:50px;
            text-align:center;
            background:$orange;
            color:#fff;
            line-height:29px;
            &.hide{ display:none}
        }

    }

    .scrollInerCon{
        overflow:hidden; padding:0 10px;
        .gtextoverflow{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
        .itemBox{
            width:48.5%; float:left; overflow:hidden; background:#fff; margin-bottom:10px;
            /*display:-webkit-box; display:-webkit-flex; display:-ms-flex; display:flex;*/
            /*-webkit-box-orign:vertical; -webkit-box-direction:normal; -webkit-flex-direction:column; -ms-flex-direction:column; flex-direction:column;*/
        }
        .itemBox:nth-child(2n+1){ margin-right:3%;}
        .itemBox > .con{ display:block; width:100%;}
        .itemBox .photoBox{ position:relative; width:100%; overflow:hidden; background-position: center; background-size: cover;
            font-size:0; background-position: center; background-repeat: no-repeat;}
        .itemBox .photoBox table{ width:100%; height:100%; text-align:center}
        .itemBox .photoBox table,.itemBox .photoBox table tr,.itemBox .photoBox table td{ width:100%; height:100%; font-size:0}
        .itemBox .photoBox img{width: 100%;}
        .itemBox .title{
            position:absolute;
            left:0;
            right:0;
            bottom:0;
            height:26px;
            line-height:26px;
            text-align:left;
            font-size:12px;
            color:#fff;
            padding-left:5px;
            background:rgba(0,0,0,0.5);
        }
        .itemBox .bCon{padding:0 5px; height:30px; line-height:30px; overflow:hidden; background:#f0f4f5}
        .itemBox .price{ float:left;}
        .itemBox .price.tprice{ float:right; text-decoration:line-through; color:#999}
        .itemBox .price.tprice .yen{ color:#999}
        .itemBox .ui-recFlag{width: 14px; height: 14px; font-size: 12px; float:right; margin-left:3px;  -webkit-transform: scale(0.95);}
        .itemBox .price{ font-size:16px; color:#F07845; padding-left:1px}
        .itemBox .price .yen{ font-size:12px; color: #F07845; margin-right: 2px;}
        .itemBox .price .qi{ font-size:14px; color: #8a8a8a; margin-left: 2px;}

        .emptyTip{
            clear:both;
            margin-top:5px;
            height:40px;
            line-height:40px;
            text-align:center;
        }

        .noSearchResult{
            clear:both;
            margin-top:5px;
            height:200px;
            line-height:200px;
            text-align:center;
            background:#fff;
        }

    }



    .xs-plugin-pullup-container{ line-height:40px}

</style>
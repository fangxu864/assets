<template>
    <div v-if="state=='success'" id="bodyContainer" class="bodyContainer">
        <photo :state="state" :src="info.imgpath" :title="info.title" :address="info.address"></photo>
        <ul id="pdetailTabHeader" class="tabHeader" :class="{fix:tabFix}" @click="onTabHeaderClick">
            <li data-type="buy" class="tabHeadItem buy" :class="{active:tabActiveClass=='buy'}"><span class="text">购票</span></li>
            <li data-type="zhi" class="tabHeadItem zhi" :class="{active:tabActiveClass=='zhi'}"><span class="text">预订须知</span></li>
            <li data-type="info" class="tabHeadItem info" :class="{active:tabActiveClass=='info'}"><span class="text" v-text="ptype_text"></span></li>
        </ul>
        <div class="scrollMainContainer" :class="{isTabHeadFix:tabFix}">
            <div id="buy-boxMod" data-type="buy" class="buy boxMod">
                <ticket-list :lid="lid"></ticket-list>
                <div v-if="p_type!=='F'" style="margin-top:10px">
                    <taopiao-list :lid="lid"></taopiao-list>
                </div>
            </div>
            <div id="zhi-boxMod" data-type="zhi" class="zhi boxMod">
                <div class="boxModTit"><span class="t">预订须知</span></div>
                <div class="boxModCon" v-html="info.jqts"></div>
            </div>
            <div id="info-boxMod" data-type="info" class="info boxMod">
                <div class="ptypeBox">
                    <div class="boxModTit"><span class="t">景点简介</span></div>
                    <div class="boxModCon" v-html="info.bhjq"></div>
                </div>
                <div class="ptypeBox">
                    <div class="boxModTit"><span class="t">交通指南</span></div>
                    <div class="boxModCon" v-html="info.bhjq"></div>
                </div>
            </div>
        </div>
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
    let Toast = require("COMMON/modules/Toast");
    let toast = new Toast();
    let LandInfo = require("SERVICE_M/land-info");
    let __timer__ = null;
    let __time__ = 10;
    let ScrollTopAnimation = require("COMMON/modules/scrolltop-animation");
    export default {
        data(){
            return {
                lid : "1111",
                state : "",
                errorMsg : "",
                tabActiveClass : "buy",
                tabFix : false,
                photoHeight : 0,
                tabHeadHeight : 0,
                info : {
                    p_type : "A",
                    id: "",
                    title: "",
                    area: "",
                    address: "",
                    jtzn: "",
                    jqts: "",
                    bhjq : "",
                    imgpath: "",
                    apply_did: ""
                }
            }
        },
        ready(){
            $(window).scroll((e) => {
                if(this.state!=="success" || this.photoHeight==0) return false;
                clearTimeout(__timer__);
                __timer__ = setTimeout(()=>{
                    var scrollTop = document.body.scrollTop;
                    this.onScroll(scrollTop);
                },__time__)
            })
            this.fetchInfo(this.lid);
        },

        methods : {
            onScroll(scrollTop){
                var photoHeight = this.photoHeight;
                if(scrollTop>=photoHeight){
                    this.tabFix = true;
                }else{
                    this.tabFix = false;
                }
            },
            fetchInfo(lid){
                LandInfo(lid,{
                    loading : ()=> {
                        this.state = "loading";
                    },
                    complete : ()=> {
                        this.state = "complete";
                    },
                    success : (data)=> {
                        this.state = "success";
                        for(var i in data) this.info[i] = data[i];
                    },
                    fail : (msg)=> {
                        this.state = "fail";
                        this.errorMsg = msg;
                    }
                })
            },
            onTabHeaderClick(e){
                var tarBtn = $(e.target);
                var tarTab = tarBtn.hasClass("tabHeadItem") ? tarBtn : tarBtn.parents(".tabHeadItem");
                var type = this.tabActiveClass = tarTab.attr("data-type");
                var body = document.body;
                var tarBoxMod = $("#"+type+"-boxMod");
                var offsetTop = tarBoxMod.offset().top - this.tabHeadHeight+1;
                ScrollTopAnimation({
                    elem : body,
                    top : offsetTop,
                    duration : 300,
                    delay : 20,
                    callback : function(){}
                })
            },
            getPhotoHeight(){
                return document.querySelector(".pdetailPhotoContainer").offsetHeight;
            }
        },
        computed : {
            ptype_text(){
                return{
                    A : "景区介绍",
                    F : "景区介绍",
                    C : "酒店介绍",
                    H : "演出介绍",
                    B : "行程按排"
                }[this.info.p_type];
            }
        },
        watch : {
            state : function(val){
                if(val=="loading"){
                    toast.show("loading","努力加载中...");
                }else if(val!="loading" && val!==""){
                    toast.hide();
                }
                if(val=="success"){
                    setTimeout(()=>{
                        this.photoHeight = this.getPhotoHeight();
                        this.tabHeadHeight = $("#pdetailTabHeader").height();
                    },500)
                }
            }
        },
        components : {
            photo : require("COMMON_VUE_COMPONENTS/pdetail-photo"),
            ticketList : require("COMMON_VUE_COMPONENTS/ticket-list"),
            taopiaoList : require("COMMON_VUE_COMPONENTS/taopiao-list")
        }
    }
</script>
<style lang="sass">
    .tabHeader{ width:100%; overflow:hidden; background:#fff; border-bottom:1px solid #e5e5e5}
    .tabHeader.fix{ position:fixed; top:0; left:0; right:0; z-index:10; box-shadow:0 1px 1px rgba(0,0,0,0.1)}
    .tabHeader .tabHeadItem{ width:33.33%; float:left; text-align:center; font-size:0}
    .tabHeader .tabHeadItem .text{ display:inline-block; height:43px; font-size:0.35rem; line-height:46px; padding:0 25px; border-bottom:3px solid #fff}
    .tabHeader .tabHeadItem.active .text{ font-weight:bold; border-bottom-color:#0797D9; color:#0797D9}
    .scrollMainContainer.isTabHeadFix{ margin-top:46px;}
    .scrollMainContainer .boxMod .boxModTit{ height:45px; line-height:45px; padding:0 10px; font-size:0.4rem; font-weight:bold; border-bottom:1px solid #e5e5e5}
    .scrollMainContainer .boxMod.zhi,.scrollMainContainer .boxMod.info{ height:800px; background:#fff; margin-top:10px}
</style>

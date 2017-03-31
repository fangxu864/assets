<template>
    <div :style="{height:height+'px'}" id="slideContainer" class="slideContainer">
        <template v-if="state=='loading'">
            <div class="loading state">
                <img class="loadingIconImg" :src="loading_img_src" alt=""/>
                <span class="t">努力加载中，请稍后...</span>
            </div>
        </template>
        <template v-if="state=='fail'">
            <div class="fail state" v-text="failMsg"></div>
        </template>
        <template v-if="state=='success' && bannerCount==1">
            <div class="bannerCon">
                <a class="onlyOneBanner" :href="banner[0]['link']"><img :src="banner[0]['src']" alt=""/></a>
            </div>
        </template>
        <template v-if="state=='success' && bannerCount>1">
            <div id="bannerCon" class="bannerCon">
            </div>
        </template>
    </div>
</template>
<script type="es6">
    let ImageLoader = require("COMMON/js/util.imageLoader");
    export default {
        props : {
            initHeight : {
                type : Number,
                default : 150
            }
        },
        data(){
            return{
                loading_img_src : PFT.LOADING_IMG_GIF,
                height : this.initHeight,
                state : "loading",
                banner : [],
                failMsg : "请求用户配置的banner信息出错"
            }
        },
        ready(){
            //获取到用户自定义的店铺配置后
            PFT.CustomShopConfig.on("success",(res) => {
                this.loadFirstBannerImg(res.data.banner);
            })
            PFT.CustomShopConfig.on("fail",(msg) => {
                this.state = "fail";
                this.failMsg = msg;
            })
        },
        computed : {
            bannerCount(){
                return this.banner.length;
            }
        },
        methods : {
            //加载第一张banner
            loadFirstBannerImg(banner){
                var src = banner[0]["src"];
                if(!src) src = PFT.DEFAULT_IMG;
                ImageLoader(src,{
                    loading : () => {},
                    complete : () => {},
                    success : (src,img) => {
                        var iW = img.width;
                        var iH = img.height;
                        //var sW = $(window).width();
                        var sW = document.getElementById("slideContainer").offsetWidth;
                        var sH = parseInt((sW*iH)/iW);
                        $("#bannerWrap").height(sH);
                        this.state = "success";
                        this.banner = banner;
                        this.height = sH;
                        setTimeout(()=>{
                            if(banner.length>1) this.setupSlider(banner);
                        },50)
                    },
                    error : (src,img) => {
                        this.state = "fail";
                    }
                })
            },
            setupSlider : function(source){
                var list = [];
                for(var i in source){
                    var link = source[i]["link"] || "javascript:void(0)";
                    var src = source[i]["src"];
                    var item = '<div class="slideItem"><a href="'+link+'"><img src="'+src+'" alt=""/></a></div>';
                    list.push({content:item,type:"html"});
                }
                var slide = new iSlider({
                    data: list,
                    dom: document.getElementById("bannerCon"),
                    isAutoplay : false,
                    isVertical : false,
                    isLooping: true,
                    animateType: 'default',
                    plugins : ["dot"]
                });
                slide.on("slideChanged",function(index,item,r){})
            }
        }
    }
</script>
<style lang="sass">
    #slideContainer{ position:relative; transition:height 0.2s; background:#fff;}
    #slideContainer .state{ height:150px; line-height:150px; text-align:center; background:#fff}
    #slideContainer .state.loading .loadingIconImg{ width:0.6rem; vertical-align:middle; position:relative; top:-2px}
    #slideContainer .bannerCon img{ width:100%}
    #bannerCon{ width:100%; height:100%; position:relative; overflow:hidden}
    #bannerCon .islider-outer{ height:100%; overflow:hidden}
    #bannerCon .islider-html{ position: absolute; top:0; width:100%;height: 100%;overflow: hidden;display: -webkit-box;-webkit-box-pack: center;-webkit-box-align: center;list-style: none;margin: 0;padding: 0; }
    #bannerCon .slideItem{ display:block; width:100%; height:100%; font-size:0; overflow:hidden;}
    #bannerCon .slideItem a{ display:block; vertical-align:middle; width:100%; height:100%; overflow:hidden; font-size:0;}
    #bannerCon .slideItem img{ width:100%;}
    #bannerCon .slideItem.loading img{ width:auto}
    #slideContainer .islider-dot-wrap{ bottom:12px; z-index:2}
    #slideContainer .islider-dot-wrap .islider-dot{ width:8px; height:8px}
</style>
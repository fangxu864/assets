<template>
    <div :style="{height:height+'px'}" id="slideContainer" class="slideContainer">
        <div id="bannerCon" style="width:100%; height:100%; overflow:hidden;">
            <template v-if="state==loading">
                <div class="loading state">
                    <img :src="loading_img_src" alt=""/>
                    <span class="t">努力加载中，请稍后...</span>
                </div>
            </template>
            <template v-if="state==fail">
                <div class="fail state">请求用户配置的banner信息出错</div>
            </template>
            <ul class="islider-outer">
                <li class="islider-html islider-prev">
                    <div class="slideItem">
                        <a href="javascript:void(0)"><img src="http://images.12301.cc/123624/1451528585921.jpg" alt=""></a>
                    </div>
                </li>
            </ul>
        </div>
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
                banner : []
            }
        },
        ready(){
            //获取到用户自定义的店铺配置后
            PFT.CustomShopConfig.on("success",(res) => {
                this.state = "success";
                this.banner = res.data.banner;
            })
            PFT.CustomShopConfig.on("fail",(res) => {
                this.state = "fail";
            })
        },
        methods : {

            initBanner : function(){
                var that = this;
                var container = $("#bannerCon");
                $("#bannerCon").html('<div style="width:100%; height:100%; line-height:140px; text-align:center;">正在加载图片，请稍后...</div>');
                this.getBannerSource(function(source){
                    var len = source.length;
                    if(source!=="error"){
                        if(len>1){
                            that.setupSlider(source);
                        }else{
                            var src = source[0] ? source[0]["src"] : PFT_MALL.errorImg;
                            var link = source[0] ? source[0]["link"] : "javascript:void(0)";
                            if(!link) link = "javascript:void(0)";
                            PFT.Help.LoadImage(container,src,{
                                success : function(container,src,img){
                                    var iW = img.width;
                                    var iH = img.height;
                                    var sW = $(window).width();
                                    var sH = parseInt((sW*iH)/iW);
                                    $("#bannerWrap").height(sH);
                                    $("#bannerCon").html('<a style="display:block; width:100%; height:100%;" href="'+link+'"><img style="width:100%" src="'+src+'" alt=""/></a>')
                                }
                            })
                        }
                    }else{ //如果请求"wx/api/index.php?c=Mall_Common&a=getMallConfig"这个接口时服务器发生错误
                        $("#bannerCon").html('<div style="width:100%; height:100%; line-height:140px; text-align:center;">请求出错..</div>')
                    }
                });
            },
            setupSlider : function(source){
                var that = this;
                if(!source || Object.prototype.toString.call(source)!=="[object Array]") return false;
                source = this.filterSlideSource(source);
                var list = [];
                for(var i in source){
                    var link = source[i]["link"] || "javascript:void(0)";
                    var src = source[i]["src"];
                    var item = '<div class="slideItem"><a href="'+link+'"><img src="'+src+'" alt=""/></a></div>';
                    list.push({content:item});
                }
                PFT.Help.LoadImage($("body"),source[0]["src"],{
                    loading : function(){},
                    removeLoading : function(){
                        $("#bannerCon").html("");
                        that.iSlider = new iSlider({
                            data: list,
                            dom: document.getElementById("bannerCon"),
                            isAutoplay : true,
                            isVertical : false,
                            isLooping: true,
                            animateType: 'default',
                            plugins : ["dot"]
                        });
                        that.iSlider.on("slideChanged",function(index,item,r){})
                    },
                    success : function(container,src,img){
                        var iW = img.width;
                        var iH = img.height;
                        var sW = $(window).width();
                        var sH = parseInt((sW*iH)/iW);
                        $("#bannerWrap").height(sH);
                    },
                    error : function(){
                        PFT.Help.LoadImage($("body"),PFT_MALL.errorImg,{
                            success : function(container,src,img){
                                var iW = img.width;
                                var iH = img.height;
                                var sW = $(window).width();
                                var sH = parseInt((sW*iH)/iW);
                                $("#bannerWrap").height(sH);
                            }
                        })
                    }
                })
            },
            //获取用户设置好的banner图 异步
            getBannerSource(callback){
                var account = window.location.hostname.split(".")[0];
                PFT_MALL.ShopConfig.getBanner(function(banners){
                    var result = [];
                    if(Object.prototype.toString.call(banners)=="[object Array]"){
                        for(var i in banners){
                            var banner = banners[i] || {};
                            var json = {};
                            for(var src in banner){
                                json["src"] = src;
                                result.push(json);
                            }
                        }
                        callback(result);
                    }else{ //banners == "error"
                        callback("error");
                    }
                })
            }
        }
    }
</script>
<style lang="sass"></style>
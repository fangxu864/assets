<template>
    <div id="ptypeListContainer" class="ptypeListContainer">
        <template v-if="state=='success'">
            <!--<div id="ptypeScrollWrap" class="scrollWrap ptype ptypeScrollWrap" style="width:100%; overflow:hidden; position:relative">-->
                <!--<ul class="ptypeList">-->
                    <!--<li class="ptypeBox" :class="getPtypeBoxCls(item)" v-for="item in ptypeList" :data-ptype="item.identify">-->
                        <!--<a class="ptypeBoxCon" :href="getLinkUrl(item)">-->
                            <!--<div :style="{'backgroundColor':getBackgroundColor(item)}" class="iconBox">-->
                                <!--<i class="icon-ecshop-theme" :class="getIconCls(item)"></i>-->
                            <!--</div>-->
                            <!--<p class="text" v-text="item.name"></p>-->
                        <!--</a>-->
                    <!--</li>-->
                <!--</ul>-->
            <!--</div>-->
            <div id="ptypeThemeSliderContainer">
                <div id="ptypeThemeScrollWrap" class="ptypeThemeScrollWrap"></div>
            </div>
        </template>
        <template v-if="state!=='success'">
            <div class="state" v-text="state"></div>
        </template>
    </div>
</template>
<script type="es6">
    let getPtypeList = require("SERVICE_M/getptype");
    let Themes = {
        "爱上古迹" : {
            cls : "guji",color : "#cd423f",icon : "icon-guji"
        },"逐海踏浪" : {
            cls : "talang",color : "#6951ff",icon : "icon-talang"
        },"度假山庄" : {
            cls : "shanzhuang",color : "#9a77f3",icon : "icon-shanzhuang"
        },"激情漂流" : {
            cls : "piaoliu",color : "#5a79e0",icon : "icon-piaoliu"
        },"城市观光" : {
            cls : "chengshi",color : "#3d56d4",icon : "icon-chengshi"
        },"乐游山水" : {
            cls : "shanshui",color : "#3fcd6c",icon : "icon-shanshui"
        },"文化寻根" : {
            cls : "wenhua1",color : "#ff9d51",icon : "icon-wenhua1"
        },"主题乐园" : {
            cls : "zhuti1",color : "#f3bf77",icon : "icon-zhuti1"
        },"温泉养生" : {
            cls : "wenquan",color : "#e0635a",icon : "icon-wenquan"
        },"水世界" : {
            cls : "shuishijie",color : "#d43d79",icon : "icon-shuishijie"
        },"冰雪世界" : {
            cls : "bingxue",color : "#4b3fcd",icon : "icon-bingxue"
        }
    };
    export default {
        data(){
            return {
                ptypeList : null,
                themeList : null,
                state : "",
                icons : {
                    A : {
                        icon : "jingqu",color : "#3dafd4"
                    },
                    B : {
                        icon : "zhoubianyou",color : "#ff516a"
                    },
                    C : {
                        icon : "jiudian",color : "#64cd3f"
                    },
                    F : {
                        icon : "taopiao",color : "#f37777"
                    },
                    H : {
                        icon : "yanchu",color : "#e05a9f"
                    }
                }
            }
        },
        ready(){
            getPtypeList({
                loading : () =>{
                    this.state = PFT.AJAX_LOADING_TEXT;
                },
                complete : () =>{
                    this.state = PFT.AJAX_COMPLETE_TEXT;
                },
                success : (data) =>{
                    this.state = "success";
                    var filterTheme = {
                        "出境游" : 1,
                        "国内游" : 1,
                        "跟团游" : 1,
                        "周边游" : 1,
                        "邮轮" : 1,
                        "定制游" : 1,
                        "自由行" : 1,
                        "自驾游" : 1
                    };
                    var newData = [];
                    for(var i=0; i<data.length; i++){
                        var item = data[i];
                        var name = item.name;
                        if(!filterTheme[name]) newData.push(item);
                    }
                    this.$nextTick(()=>{
                        this.render(newData);
                    })

                },
                empty : (res) =>{
                    this.state = "用户没有配置要显示的产品类型";
                    this.list = [];
                },fail : (res) =>{
                    this.state = (res.msg || PFT.AJAX_ERROR_TEXT);
                }
            })
        },
        methods : {
            getPtypeBoxCls(item){
                if(item.identify!=="theme") return item.identify;
                var theme = Themes[item.name];
                if(!theme) return "theme";
                var cls = theme["cls"] || "";
                return cls+" theme";
            },
            getLinkUrl(item){
                var href = "plist.html";
                return item.identify!=='theme' ? (href+"?ptype="+encodeURIComponent(item.identify)) : (href+"?theme="+encodeURIComponent(item.name));
            },
            getIconCls(item){
                return item.identify!=="theme" ? ('icon-'+this.icons[item.identify]["icon"]) : (Themes[item.name]["icon"]);
            },
            getBackgroundColor(item){
                return item.identify!=="theme" ? this.icons[item.identify]["color"] : Themes[item.name]["color"];
            },
            render(list){
                var that = this;
                var _renderSlideItem = function(data){
                    var html = "";
                    html += '<ul class="ptypeThemeSlideItemCon ptypeList listUl">';
                    for(var i=0; i<data.length; i++){
                        var item = data[i];
                        html += '<li class="ptypeBox" class="'+that.getPtypeBoxCls(item)+'" data-ptype="'+item.identify+'">';
                        html += '<a class="ptypeBoxCon" href="'+that.getLinkUrl(item)+'">';
                        html += '<div style="background-color:'+that.getBackgroundColor(item)+'" class="iconBox">';
                        html += '<i class="icon-ecshop-theme '+that.getIconCls(item)+'"></i>';
                        html += '</div>';
                        html += '<p class="text">'+item.name+'</p>';
                        html += '</a>';
                        html += '</li>';
                    }
                    html += '</ul>';
                    return html;
                };
                var sliceArr = function(arr,groupCountPer){
                    var result = [];
                    var len = arr.length;
                    var groupCount = Math.ceil(len/groupCountPer);
                    for(var i=0; i<groupCount; i++){
                        var _arr = [];
                        for(var s=i*groupCountPer; s<(i+1)*groupCountPer; s++){
                            arr[s] && _arr.push(arr[s]);
                        }
                        result.push(_arr);
                    }
                    return result;
                };
                var container = document.getElementById("ptypeThemeScrollWrap");
                if(list.length<=10){ //小于10个不需要滑动
                    container.innerHTML = _renderSlideItem(list);
                    setTimeout(function(){
                        $("#ptypeThemeScrollWrap").height($(".ptypeThemeSlideItemCon").height())
                    },20)
                }else{ //大于10个启用滑动
                    list = sliceArr(list,10);
                    var slideDataList = [];
                    for(var i=0; i<list.length; i++){
                        var group = list[i];
                        var item = {type:"html",content:_renderSlideItem(group)};
                        slideDataList.push(item);
                    }
                    var slide = new iSlider({
                        data: slideDataList,
                        dom: container,
                        isAutoplay : false,
                        isVertical : false,
                        isLooping: false,
                        animateType: 'default',
                        plugins : ["dot"]
                    });
                    slide.on("slideChanged",function(index,item,r){})

                    setTimeout(function(){
                        $("#ptypeThemeScrollWrap").height($(".ptypeThemeSlideItemCon").height()).css({
                            paddingBottom : 20
                        });
                    },20)

                }
            }
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/core/px2rem";
    @import "COMMON/css/base/iconfont.ptype.scss";
    @import "COMMON/css/base/flex";
    #ptypeListContainer{ padding:px2rem(30) px2rem(16) 0 px2rem(16); border-bottom:10px solid #e5e5e5; background:#fff; overflow:hidden}
    #ptypeListContainer .state{
        height:3rem;
        line-height:3rem;
        background:#fff;
        text-align:center;
    }
    #ptypeListContainer .ptypeList{
        text-align:left;
        font-size:0;
        width:100%;
        @include flexbox;
        @include flex-wrap(wrap);
        @include justify-content(space-around)
    }
    #ptypeListContainer .ptypeBox{
        width:20%;
        text-align:center;
        margin-bottom:12px;
    }
    #ptypeListContainer .ptypeBoxCon{ display:block; width:100%}
    #ptypeListContainer .ptypeBox .iconBox{
        width:px2rem(114);
        height:px2rem(110);
        line-height:px2rem(114);
        background:#3cafd5;
        border-top-right-radius:20px;
        border-bottom-left-radius:20px;
        color:#fff;
        margin:0 auto 0.2rem;
    }
    #ptypeListContainer .ptypeBox .icon-ecshop-theme{
        font-size:0.7rem;
    }
    #ptypeListContainer .ptypeBox .text{
        color:#333;
        font-size:0.35rem;
    }
    #ptypeListContainer .ptypeBox.C .iconBox i{ font-size:0.6rem}
    #ptypeListContainer .ptypeBox.H .iconBox i{ font-size:0.75rem}
    #ptypeListContainer .ptypeBox.F .iconBox i{ font-size:0.75rem}

    #ptypeThemeSliderContainer{ position:relative}
    #ptypeThemeSliderContainer .islider-dot-wrap{ bottom:5px}
    #ptypeThemeSliderContainer .islider-dot{ background:rgba(0,0,0,0.3); border:0 none;}
    #ptypeThemeSliderContainer .islider-dot.active{ background:#2a98da; border:0 none}
    #ptypeThemeScrollWrap{ width:100%; height:180px; position:relative; overflow:hidden;}
    #ptypeThemeScrollWrap .islider-outer{ position:relative; height:100%; overflow:hidden}
    #ptypeThemeScrollWrap .islider-html{ position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; list-style: none;margin: 0;padding: 0; }
    #ptypeThemeScrollWrap .slideItem{ display:block; width:100%; height:100%; font-size:0; overflow:hidden;}

</style>
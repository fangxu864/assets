<template>
    <div id="ptypeListContainer" class="ptypeListContainer">
        <template v-if="state=='success'">
            <ul class="ptypeList">
                <li class="ptypeBox" :class="getPtypeBoxCls(item)" v-for="item in list" :data-ptype="item.identify">
                    <a class="ptypeBoxCon" :href="getLinkUrl(item)">
                        <div :style="{'backgroundColor':getBackgroundColor(item)}" class="iconBox">
                            <i class="icon-ecshop-theme" :class="getIconCls(item)"></i>
                        </div>
                        <p class="text" v-text="item.name"></p>
                    </a>
                </li>
            </ul>
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
                list : null,state : "",icons : {
                    A : {
                        icon : "jingqu",color : "#3dafd4"
                    },B : {
                        icon : "zhoubianyou",color : "#ff516a"
                    },C : {
                        icon : "jiudian",color : "#64cd3f"
                    },F : {
                        icon : "taopiao",color : "#f37777"
                    },H : {
                        icon : "yanchu",color : "#e05a9f"
                    }
                }
            }
        },ready(){
            getPtypeList({
                loading : () =>{
                    this.state = PFT.AJAX_LOADING_TEXT;
                },complete : () =>{
                    this.state = PFT.AJAX_COMPLETE_TEXT;
                },success : (data) =>{
                    this.state = "success";
                    this.list = data;
                },empty : (res) =>{
                    this.state = "用户没有配置要显示的产品类型";
                    this.list = [];
                },fail : (res) =>{
                    this.state = (res.msg || PFT.AJAX_ERROR_TEXT);
                }
            })
        },
        methods : {
            getPtypeBoxCls(item){
                return item.identify!=='theme' ? item.identify : (Themes[item.name]['cls']+' theme')
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
            }
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/core/px2rem";
    @import "COMMON/css/base/iconfont.ptype.scss";
    #ptypeListContainer{ padding:px2rem(40) px2rem(16) 0 px2rem(16); border-bottom:10px solid #e5e5e5; background:#fff; overflow:hidden}
    #ptypeListContainer .state{
        height:3rem;
        line-height:3rem;
        background:#fff;
        text-align:center;
    }
    #ptypeListContainer .ptypeList{
        text-align:center;
        font-size:0;
        padding-bottom:7px;
    }
    #ptypeListContainer .ptypeBox{
        display:inline-block;
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
</style>
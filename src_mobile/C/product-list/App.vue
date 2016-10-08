<template>
    <div class="bodyContainer">
        <div id="scrollWrap" class="scrollWrap">
            <scroller
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
    </div>
</template>
<script type="es6">
    const FetchList = require("SERVICE_M/product-list");
    let Toast = new PFT.Mobile.Toast();
    let Alert = PFT.Mobile.Alert;
    export default{
        data(){
            return{
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
            this.scrollWrap = $("#scrollWrap");
            this.scrollerHeight = String(this.scrollWrap.height())+"px";
            this.fetchData();
        },
        methods : {
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
                        var citys = data.citys;
                        this.list = this.list.concat(data.list);
                        this.filterParams.lastPos = data.lastPos;
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
            scroller : require("vux/src/components/scroller/index.vue")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/main";
    body{ background:$bgColor}
    $tabHeight : 42px;
    .scrollWrap{ margin-top:$tabHeight}
    #fixTabHead{
        position:fixed;
        top:0;
        left:0;
        right:0;
        z-index:10;
        height:$tabHeight;
        line-height:$tabHeight;
        overflow:hidden;
        background:#e5f5fc;
        box-shadow:0 1px 1px rgba(0,0,0,0.1);
    }
    #fixTabHead .tabItem{
        position:relative;
        float:left;
        width:50%;
        height:100%;
        line-height:$tabHeight;
        text-align:center;
    }
    #fixTabHead .tabItem.active{
        color:$orange;
    }
    #fixTabHead .tabItem.active:before{
        content : "";
        position:absolute;
        left:20%;
        right:20%;
        bottom:0;
        height:2px;
        background:$orange;
        font-size:0;
    }

    .item{
        height:100px;
        line-height:100px;
        text-align:center;
        background:#fff;
        margin-bottom:10px;
    }









    .xs-plugin-pullup-container{ line-height:40px}



</style>
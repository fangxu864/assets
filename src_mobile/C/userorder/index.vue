<template>
    <div class="bodyContainer">
        <div id="fixTabHead" class="fixTabHead">
            <span @click="onTabItemClick('unuse')" data-type="unuse" class="tabItem unuse" :class="{active:tabActive=='unuse'}">未使用</span>
            <span @click="onTabItemClick('history')" data-type="history" class="tabItem history" :class="{active:tabActive=='history'}">历史订单</span>
        </div>
        <div id="scrollWrap" class="scrollWrap">
            <scroller
                v-ref:scroller
                :height="scrollerHeight"
                :lock-x="true"
                :use-pulldown="true"
                :use-pullup="true"
                :lock-y="lockY"
                :pullup-config="pullupConfig"
                :pulldown-config="pulldownConfig"
                v-on:pullup:loading="onPullupLoading"
                :scrollbar-x="false">
                <div class="scrollCon">
                    <ul v-if="tabActive=='unuse'" data-type="unuse" class="scrollInerCon unuse">
                        <li class="item" v-for="item in unuse.list" v-text="$index"></li>
                    </ul>
                    <ul v-if="tabActive=='history'" data-type="history" class="scrollInerCon history">
                        <li class="item" v-for="item in history.list" v-text="$index"></li>
                    </ul>
                </div>
            </scroller>
        </div>
    </div>
</template>
<script type="es6">
    const OrderService = require("SERVICE_M/mall-member-user-order");
    let Toast = new PFT.Mobile.Toast();
    let Alert = new PFT.Mobile.Alert();
    export default{
        data(){
            return{
                lockY : false,
                scrollerHeight : "",
                tabActive : "unuse",
                unuse : {
                    page : 0,
                    totalPage : 0,
                    list : []
                },
                history : {
                    page : 0,
                    totalPage : 0,
                    list : []
                },
                pullupConfig : {
                    content: '查看更多订单..',
                    pullUpHeight: 60,
                    height: 40,
                    autoRefresh: false,
                    downContent: '释放以加载更多..',
                    upContent: '查看更多订单..',
                    loadingContent: '努力加载中..',
                    clsPrefix: 'xs-plugin-pullup-'
                },
                pulldownConfig : {
                    content: '刷新..',
                    pullUpHeight: 60,
                    height: 40,
                    autoRefresh: false,
                    downContent: '释放以刷新订单..',
                    upContent: '刷新订单..',
                    loadingContent: '努力加载中..',
                    clsPrefix: 'xs-plugin-pulldown-'
                }
            }
        },
        ready(){
            var win = PFT.Util.winWidthHeight();
            var fixTabHeight = $("#fixTabHead").height();
            this.scrollWrap = $("#scrollWrap");
            this.scrollerHeight = String(win.height-fixTabHeight)+"px";
        },
        route : {
            data(){
                this.lockY = false;
                this.tabActive = sessionStorage.getItem("tabActive") || this.tabActive;
                if(!sessionStorage.getItem(this.tabActive)){
                    this.fetchData(this.tabActive);
                }
            },
            activate(){

            },
            deactivate(){
                this.lockY = true;
                sessionStorage.setItem("tabActive",this.tabActive);
                sessionStorage.setItem("scrollTop",$(window).scrollTop());
            }
        },
        watch : {
            unuse_scroller_disable(val){
                if(this.tabActive=="unuse" && val=="disable"){
                    this.disableScroll();
                }else{
                    this.enableScroll();
                    this.resetScroll();
                }
            },
            history_scroller_disable(val){
                if(this.tabActive=="history" && val=="disable"){
                    this.disableScroll();
                }else{
                    this.enableScroll();
                    this.resetScroll();
                }
            }
        },
        computed : {
            unuse_scroller_disable(){
                var unuse = this.unuse;
                var page = unuse.page;
                var totalPage = unuse.totalPage;
                if(page>0 && page<totalPage){
                    return "able";
                }else{
                    return "disable";
                }
            },
            history_scroller_disable(){
                var history = this.history;
                var page = history.page;
                var totalPage = history.totalPage;
                if(page>0 && page<totalPage){
                    return "able";
                }else{
                    return "disable";
                }
            }
        },
        methods : {
            fetchData(type,page){
                page = page || 1;
                OrderService.list({
                    type : type || "unuse",
                    page : page,
                    pageSize : 20
                },{
                    loading : () => {
                        Toast.show("loading","努力加载中..");
                    },
                    complete : () => {
                        Toast.hide();
                    },
                    empty : () => {
                        this.$broadcast('pullup:disable', this.$refs.scroller.uuid)
                    },
                    success : (data) => {
                        var totalPage = data.total_page;
                        var list = data.list;
                        if(type=="unuse"){
                            this.$set("unuse.page",page);
                            this.$set("unuse.totalPage",totalPage);
                            this.$set("unuse.list",this.unuse.list.concat(list));
                        }else{
                            this.$set("history.page",page);
                            this.$set("history.totalPage",totalPage);
                            this.$set("history.list",this.history.list.concat(list));
                        }
                        this.$nextTick(()=>{
                            this.$broadcast('pullup:reset', this.$refs.scroller.uuid)
                        })
                    },
                    fail : () => {}
                })
            },
            onPullupLoading(uuid){
                var page = this.tabActive=="unuse" ? (this.unuse.page+1) : (this.history.page+1);
                this.fetchData(this.tabActive,page)
            },
            onTabItemClick(type){
                this.tabActive = type;
                sessionStorage.setItem("tabActive",type);
                this.$nextTick(()=>{
                    if(this.tabActive=="unuse" && this.unuse_scroller_disable=="disable"){
                        this.disableScroll();
                    }else if(this.tabActive=="history" && this.history_scroller_disable=="disable"){
                        this.disableScroll();
                    }else{
                        this.enableScroll();
                        this.resetScroll();
                    }
                })
                if(type=="history" && this.history.page==0 && this.history.totalPage==0){
                    this.fetchData(type);
                }
                if(type=="unuse" && this.unuse.page==0 && this.unuse.totalPage==0){
                    this.fetchData(type);
                }
            },
            disableScroll(){
                this.$broadcast('pullup:disable', this.$refs.scroller.uuid);
            },
            enableScroll(callback){
                this.$broadcast('pullup:enable', this.$refs.scroller.uuid);
                callback && callback();
            },
            resetScroll(callback){
                console.log("resetScroll")
                this.$refs.scroller.reset();
                callback && callback();
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
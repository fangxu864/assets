<template>
    <div id="productListContainer" class="productListContainer">
        <ul id="productListUl" class="productListUl">
            <template v-if="state=='loading'">
                <li class="status loading">努力加载中，请稍后...</li>
            </template>
            <template v-if="state=='success'">
                <li v-for="item in list" class="prodItem itemRow">
                    <a class="con" href="pdetail.html?lid=">
                        <div class="photoBox">
                            <img v-lazyload="{src:item.imgpath,loading:photo.loading,error:photo.error}"/>
                        </div>
                        <div class="botBox">                 
                            <div class="col lt">                    
                                <i class="yen">¥</i><em class="num" v-text="item.tprice"></em><i class="qi">起</i>
                                <span class="tprice">¥{{item.jsprice}}</span>                
                            </div>                 
                            <div class="col rt">
                                <span class="title" v-text="item.title"></span>
                            </div>             
                        </div>
                    </a>
                </li>
            </template>
            <template v-if="state=='empty'">
                <li class="status empty">暂无产品...</li>
            </template>
            <template v-if="state=='fail'">
                <li class="status fail" v-text="errorMsg"></li>
            </template>
        </ul>
    </div>
</template>

<script type="es6">
    let GetProductHot = require("SERVICE_M/getproduct-hot-c");
    import VueImageLazyload from 'vue-image-lazyload';
    Vue.use(VueImageLazyload, {
        try: 1,
        error : PFT.DEFAULT_IMG
    })
    export default{
        props: {
            area : {
                type : String,
                default : "全国"
            }
        },
        data(){
            return {
                photo : {
                    loading : PFT.LOADING_IMG_GIF,
                    error : PFT.DEFAULT_IMG
                },
                list : [],
                state : "loading",
                errorMsg : ""
            }
        },
        ready(){
            this.request();
        },
        methods : {
            request(){
                let area = this.area;
                GetProductHot({
                    area : area,
                    loading : () => {
                        this.list = [];
                        this.state = "loading";
                    },
                    complete : () => {
                        this.state = "complete";
                    },
                    success : res => {
                        res = res || {};
                        this.list = res.data.list;
                        this.state = "success";
                    },
                    empty : res => {
                        this.list = [];
                        this.state = "empty";
                    },
                    fail : res => {
                        this.errorMsg = res.msg || PFT.AJAX_ERROR_TEXT;
                        this.list = [];
                        this.state = "fail";

                    }
                })
            }
        }
    }
</script>
<style lang="sass">
    #productListUl .itemRow{ margin-bottom:10px;}
    #productListUl .itemRow > .con{ display:block; position:relative; overflow:hidden;}
    #productListUl .itemRow .photoBox{ height:170px; line-height:170px; text-align:center; font-size:0; overflow:hidden; background-color:#fff; background-position:center center; background-size:cover; background-repeat:no-repeat}
    #productListUl .itemRow .photoBox img:not([lazy=loading]){ width:100%;}
    #productListUl .itemRow .botBox{ width:100%; height:50px; font-size:0; overflow:hidden;}
    #productListUl .itemRow .botBox .col{ float:left; height:100%; font-size:12px;}
    #productListUl .itemRow .botBox .col.lt{ width:30%; line-height:50px; text-align:center; background:#f07845; color:#fff; -webkit-box-sizing:border-box; box-sizing:border-box}
    #productListUl .itemRow .botBox .col.lt .yen{ font-size:14px; margin-right:2px;}
    #productListUl .itemRow .botBox .col.lt .num{ font-size:18px;}
    #productListUl .itemRow .botBox .col.lt .qi{ font-size:12px; margin-left:2px;}
    #productListUl .itemRow .botBox .col.rt{ width:70%; padding:8px 10px; background:#fff; font-size:12px; color:#333; line-height:1.7; overflow:hidden; -webkit-box-sizing:border-box; box-sizing:border-box}
    #productListUl .itemRow.loading .botBox{ display:none}
    #productListUl .itemRow.loading .photoBox{ background:#fff}
    #productListUl .itemRow.loading .photoBox img{ width:auto;}
    #productListUl .itemRow.loading .photoBox{ height:120px;}
    #productListUl .itemRow.loading .photoBox table{ width:100%; height:100%; text-align:center}
    #productListUl .itemRow .botBox .col.lt .tprice{ font-size:14px; text-decoration:line-through; margin-left:5px;}
    #productListUl .status{ height:150px; line-height:150px; text-align:center; background:#fff}
</style>
<template>
    <div id="productListContainer" class="productListContainer">
        <div class="htitle"><img src="http://static.12301.cc/assets/build/images/mb_c_index_hot_title.png" alt=""/></div>
        <ul id="productListUl" class="productListUl">
            <template v-if="state=='loading'">
                <li class="status loading">努力加载中，请稍后...</li>
            </template>
            <template v-if="state=='success'">
                <li v-for="item in list" class="prodItem itemRow">
                    <a class="con" :href="'pdetail.html?lid='+item.lid">
                        <img-loador :src="item.imgpath" :height="imgHeight" :fixed="true"></img-loador>
                        <div class="botBox">
                            <div class="col lt">
                                <span class="title" v-text="item.title"></span>
                            </div>
                            <div class="col rt">
                                <span class="tprice">¥{{item.tprice}}</span>
                                <span class="jsprice"><i class="yen">¥</i><em class="num" v-text="item.jsprice"></em></span>
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
    export default{
        props: {
            imgHeight : {
                type : Number,
                default : 150
            },
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
            this.fetch(this.area);
        },
        watch : {
            area : function(val,oldVal){
                this.fetch(val);
            }
        },
        methods : {
            fetch(area){
                GetProductHot({
                    area : area,
                    loading : () => {
                        this.list = [];
                        this.state = "loading";
                    },
                    complete : () => {
                        this.state = "complete";
                    },
                    success : (list) => {
                        this.list = list;
                        this.state = "success";
                    },
                    empty : (list) => {
                        this.list = [];
                        this.state = "empty";
                    },
                    fail : (msg) => {
                        this.errorMsg = msg;
                        this.list = [];
                        this.state = "fail";

                    }
                })
            }
        },
        components : {
            ImgLoador : require("COMMON_VUE_COMPONENTS/image-loador")
        }
    }
</script>
<style lang="sass">
    #productListContainer{ padding:0 10px;}
    #productListContainer .htitle{ font-size:0; text-align:center; margin:15px 0 15px;}
    #productListContainer .htitle img{ width:65%;}
    #productListUl .itemRow{ margin-bottom:10px;}
    #productListUl .itemRow > .con{ display:block; position:relative; overflow:hidden;}
    #productListUl .itemRow .botBox{ width:100%; height:50px; overflow:hidden; background:#f5f5f5}
    #productListUl .itemRow .botBox .col.lt{ float:left; width:70%; line-height:50px; overflow:hidden; font-size:0.35rem; color:rgba(0,0,0,0.8)}
    #productListUl .itemRow .botBox .col.lt .title{ padding-left:5px;}
    #productListUl .itemRow .botBox .col.rt{ float:right; width:30%; line-height:50px; overflow:hidden; text-align:right;}
    #productListUl .itemRow .botBox .col.rt .jsprice{ color:#f37138}
    #productListUl .itemRow .botBox .col.rt .tprice{ color:rgba(0,0,0,0.5); text-decoration:line-through; font-size:0.3rem; margin-right:3px}
    #productListUl .itemRow .botBox .col.rt .yen{ font-size:0.3rem; margin-right:1px;}
    #productListUl .itemRow .botBox .col.rt .num{ font-size:0.45rem; margin-right:5px}
    #productListUl .status{ height:150px; line-height:150px; text-align:center; background:#fff}
</style>
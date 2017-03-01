<template>
    <div id="productListContainer" class="productListContainer">
        <ul id="productListUl" class="productListUl">
            <template v-if="listSuccess">
                <li v-for="item in list" class="prodItem itemRow">
                    <a class="con" href="pdetail.html?lid=">
                        <div class="photoBox" v-bind:style="{ backgroundImage:'url('+item.imgpath+')'}"></div>
                        <div class="botBox">                 
                            <div class="col lt">                    
                                <i class="yen">¥</i><em class="num">{{item.tprice}}</em><i class="qi">起</i>                     
                                <span class="tprice">¥{{item.jsprice}}</span>                
                            </div>                 
                            <div class="col rt">
                                <span class="title" v-text="item.title"></span>
                            </div>             
                        </div>
                    </a>
                </li>
            </template>
            <template v-if="listEmpty">
                <li class="status empty" style="height:150px; line-height:150px;">暂无产品...</li>
            </template>
            <template v-if="listFail">
                <li class="status fail" style="height:150px; line-height:150px;">errorMsg</li>
            </template>
        </ul>
    </div>
</template>

<script type="es6">
    let GetProductHot = require("SERVICE_M/getproduct-hot-c");
    export default {
        props: {
            area : {
                type : String,
                default : "全国"
            }
        },
        data(){
            return {
                list : [],
                error_msg : "",
                status_loading : true,
                status_fail : false,
                status_empty : false
            }
        },
        computed : {
            listSuccess(){
                return !this.status_loading && !this.status_fail && !this.status_empty;
            },
            listEmpty(){
                return !this.status_loading && !this.status_fail && this.status_empty;
            },
            listFail(){
                return !this.status_loading && this.status_fail && !this.status_empty;
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
                        this.status_loading = true;
                        this.list = [];
                    },
                    complete : () => {
                        this.status_loading = false;
                    },
                    success : res => {
                        res = res || {};
                        this.list = res.data.list;
                        this.status_empty = false;
                        this.status_fail = false;
                    },
                    empty : res => {
                        this.list = [];
                        this.status_empty = true;
                        this.status_fail = false;
                    },
                    fail : res => {
                        this.status_fail = true;
                        this.status_empty = false;
                        this.list = [];
                        this.errorMsg = res.msg || PFT.AJAX_ERROR_TEXT;
                    }
                })
            }
        }
    }
</script>
<style lang="sass">
    #productListUl .itemRow{ margin-bottom:10px;}
    #productListUl .itemRow > .con{ display:block; position:relative; overflow:hidden;}
    #productListUl .itemRow .photoBox{ height:170px; text-align:center; font-size:0; overflow:hidden; background-color:#fff; background-position:center center; background-size:cover; background-repeat:no-repeat}
    #productListUl .itemRow .photoBox img{ width:100%;}
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
</style>
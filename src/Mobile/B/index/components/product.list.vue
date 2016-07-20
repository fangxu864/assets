<template>
    <div id="productListContainer" class="productListContainer">
        <ul id="productListUl" class="productListUl">
            <template v-if="status_loading">
                <li class="status loading">努力加载中...</li>
            </template>
            <template v-if="listSuccess">
                <li v-for="item in list" class="prodItem itemRow">
                    <a class="con" href="pdetail.html?lid=">
                        <div class="photoBox" v-bind:style="{ background:'url('+item.imgpath+')'}"></div>
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
                <li class="status fail" style="height:150px; line-height:150px;">listFail</li>
            </template>
        </ul>
    </div>
</template>

<script type="es6">
    export default {
        data(){
            return {
                list : [],
                status_loading : true,
                status_fail : false,
                status_empty : false,
            }
        },
        computed : {
            listSuccess(){
                return !this.loading && !this.status_fail && !this.status_empty;
            },
            listEmpty(){
                return !this.loading && !this.status_fail && this.status_empty;
            },
            listFail(){
                return !this.loading && this.status_fail && !this.status_empty;
            }
        },
        ready(){
            setTimeout(function(){
                this.status_loading = false;
                this.status_fail = false;
                this.status_empty = false;
                this.list = [{
                    account : "123624",
                    addr : "1111",
                    area : "天津市|和平区|",
                    areacode : "1100",
                    id : "13474",
                    imgpath : "http://www.12301.cc/images/defaultThum.jpg",
                    jsprice : "2",
                    jtype : "AAAAA",
                    lid : "121",
                    title : "二级店铺测试",
                    tprice : "3",
                    uprice : "2"
                },{
                    account : "123624",
                    addr : "1111",
                    area : "天津市|和平区|",
                    areacode : "1100",
                    id : "13474",
                    imgpath : "http://www.12301.cc/images/defaultThum.jpg",
                    jsprice : "2",
                    jtype : "AAAAA",
                    title : "二级店铺测试",
                    lid : "121",
                    tprice : "3",
                    uprice : "2"
                },{
                    account : "123624",
                    addr : "1111",
                    area : "天津市|和平区|",
                    areacode : "1100",
                    id : "13474",
                    imgpath : "http://www.12301.cc/images/defaultThum.jpg",
                    jsprice : "2",
                    jtype : "AAAAA",
                    lid : "121",
                    title : "二级店铺测试",
                    tprice : "3",
                    uprice : "2"
                },{
                    account : "123624",
                    addr : "1111",
                    area : "天津市|和平区|",
                    areacode : "1100",
                    id : "13474",
                    imgpath : "http://www.12301.cc/images/defaultThum.jpg",
                    jsprice : "2",
                    jtype : "AAAAA",
                    lid : "121",
                    title : "二级店铺测试",
                    tprice : "3",
                    uprice : "2"
                }];

            }.bind(this),1500)
        }
    }
</script>
<style lang="sass" scope>
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
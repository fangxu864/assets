<template>
    <div class="detailPage">
        <div style="line-height:100px; text-align:center"><span style="font-size:1rem" v-text="id"></span></div>
    </div>
</template>
<script type="es6">
    const OrderService = require("SERVICE_M/mall-member-user-order");
    let Toast = new PFT.Mobile.Toast();
    export default{
        data(){
            return{
                infoData : {},
                active : false
            }
        },
        ready(){

        },
        route : {
            data(transition){
                var ordernum = transition.to.params.id;
                var cacheData = sessionStorage.getItem("orderDetail");
                if(cacheData){

                }else{
                    OrderService.detail(ordernum,{
                        loading : ()=>{
                            Toast.show("loading","努力加载中..")
                        },
                        complete : ()=>{},
                        success : (res)=>{},
                        fail : (msg)=>{}
                    })
                }
            },
            activate(){

            },
            deactivate(){


            }
        },
        methods : {
            fetchData(ordernum){
                if(!ordernum) return false;



            }
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/main";
    .detailPage{
        position:fixed;
        left:0;
        right:0;
        top:0;
        bottom:0;
        z-index:10;
        background:$bgColor;
    }
</style>
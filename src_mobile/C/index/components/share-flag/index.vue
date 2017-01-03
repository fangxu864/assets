<template>
    <div>
        <a href="##" id="goToOpenShop" class="goToOpenShop">
            <span class="con"><em class="t">分享</br>互惠</em></span>
        </a>
        <a href="##" id="goToShareShop" class="goToOpenShop">
            <span class="con"><em class="t">分享</br>店铺</em></span>
        </a>
    </div>
</template>
<script type="es6">
    import {getStatus} from "SERVICE_M/mall-alldis";
    export default{
        data(){
            return{

            }
        },
        ready(){
            getStatus({
                success :(data)=>{
                    var openAllDis = data.openAllDis; //是否开通全民分销
                    var isAllDisMan = data.isAllDisMan; //当前用户是否开过店
                },
                fail : (msg,code)=>{
                    console.error(msg)
                }
            })
        }
    }
</script>
<style lang="sass">
    .goToOpenShop{ display:block; position:fixed; bottom:20%; right:5px;}
    .goToOpenShop>.con{ display:block; width:60px; height:60px; font-size:16px; overflow:hidden; text-align:center; background:rgba(18,115,174,0.7); color:#fff;
        border-top-left-radius:50%;
        border-top-right-radius:48%;
        border-bottom-left-radius:48%;
    }
    .goToOpenShop>.con .t{ position:relative; top:13px; left:1px;}
    .goToOpenShop.block{ display:block;}
    .goToOpenShop.none{ display:none;}
</style>
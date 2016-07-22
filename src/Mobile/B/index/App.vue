<template>
    <div id="bodyContainer">
        <fix-header>
            <a class="leftBtn" href="javascript:void(0)" slot="left"><i class="iconfont icon-back"></i></a>
            <h3 class="fixHeaderTitle" slot="center">微商城首页</h3>
            <a class="rightBtn" href="javascript:void(0)" slot="right"><i class="iconfont icon-yonghu"></i></a>
        </fix-header>
        <div id="bodyMainCon" class="bodyMainCon">
            <product-list :area="area"></product-list>
            <page-footer></page-footer>
        </div>
        <login :z-index="loginZIndex" :show="loginShow"></login>
    </div>
</template>

<script type="es6">
    export default {
        data(){
            return {
                area : "福州",
                loginShow : true,
                loginZIndex : 100
            }
        },
        components : {
            productList : require("./components/product-list.vue"),
            fixHeader : require("COMMON_VUE_COMPONENTS/fix-header.vue"),
            pageFooter : require("COMMON_VUE_COMPONENTS/page-footer.vue"),
            login : require("COMMON_VUE_COMPONENTS_B/login.vue")
        }
    }
</script>


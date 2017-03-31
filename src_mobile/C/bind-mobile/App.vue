<template>
    <bind-mobile :to="to"></bind-mobile>
</template>
<script type="es6">
    export default{
        data(){
            return{
                to : ""
            }
        },
        ready(){
            this.to = PFT.Util.UrlParse()["to"];
        },
        components : {
            bindMobile : require("COMMON_VUE_COMPONENTS/login-bind-mobile")
        }
    }
</script>

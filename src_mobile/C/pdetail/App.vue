<template>
    <div id="bodyContainer" class="bodyContainer">
        <photo :state="state" :src="info.imgpath"></photo>
        <ticket-list :lid="lid"></ticket-list>
        <div style="margin-top:10px">
            <taopiao-list :lid="lid"></taopiao-list>
        </div>
        <!--<actionsheet-->
                <!--:menus="actions"-->
                <!--:show.sync="sheetVisible"-->
                <!--:cancel-text="cancelText"-->
                <!--v-on:click="onActionsheetClick">-->
        <!--</actionsheet>-->
    </div>
</template>

<script type="es6">
    import "./index.scss";
    let Toast = require("COMMON/modules/Toast");
    let toast = new Toast();
    let LandInfo = require("SERVICE_M/land-info");
    let ProvCityData = require("COMMON/js/config.province.city.data");

    export default {
        data(){
            return {
                lid : "1111",
                state : "",
                errorMsg : "",
                info : {
                    id: "",
                    title: "",
                    area: "",
                    address: "",
                    jtzn: "",
                    jqts: "",
                    imgpath: "",
                    apply_did: ""
                }
            }
        },
        ready(){
            this.fetchInfo(this.lid);
        },
        methods : {
            fetchInfo(lid){
                LandInfo(lid,{
                    loading : ()=> {
                        this.state = "loading";
                    },
                    complete : ()=> {
                        this.state = "complete";
                    },
                    success : (data)=> {
                        this.state = "success";
                        data["area"] = this.adaptAddr(data.area);
                        for(var i in data){
                            this.info[i] = data[i];
                        }
                        this.info = data;
                    },
                    fail : (msg)=> {
                        this.state = "fail";
                        this.errorMsg = msg;
                    }
                })
            },
            adaptAddr(area){

            }
        },
        watch : {
            state : function(val){
                if(val=="loading"){
                    toast.show("loading","努力加载中...");
                }else if(val!="loading" && val!==""){
                    toast.hide();
                }
            }
        },
        components : {
            photo : require("COMMON_VUE_COMPONENTS/pdetail-photo"),
            ticketList : require("COMMON_VUE_COMPONENTS/ticket-list"),
            taopiaoList : require("COMMON_VUE_COMPONENTS/taopiao-list")
        }
    }
</script>
<style lang="sass">

</style>

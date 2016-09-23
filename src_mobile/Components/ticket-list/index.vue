<template>
    <ticketlist-core
            :ptype="ptype"
            :error-msg="errorMsg"
            :list="list"
            :max="max"
            :state="state">
    </ticketlist-core>
</template>
<script type="es6">
    import ProductTicketList from "SERVICE_M/product-ticket-list";
    export default {
        props : {
            lid : {
                type : String,
                require : true,
                default : ""
            },
            max : { //最多显示几个item,超出的会先被隐藏
                type : Number,
                default : 5
            }
        },
        data(){
            return{
                ptype : "",
                state : "",
                errorMsg : "",
                list : []
            }
        },
        ready(){
            this.fetchList(this.lid);
        },
        methods : {
            fetchList(lid){
                ProductTicketList(lid,{
                    loading : () => {
                        this.state = "loading";
                    },
                    complate : () => {
                        this.state = "complate";
                    },
                    success : (data) => {
                        this.state = "success";
                        this.ptype = data.ptype;
                        this.list = data.list;
                    },
                    empty : (list) => {
                        this.state = "empty";
                    },
                    fail : (msg) => {
                        this.errorMsg = msg;
                    }
                })
            }
        },
        components : {
            TicketlistCore : require("COMMON_VUE_COMPONENTS/ticket-list-core")
        }
    }
</script>

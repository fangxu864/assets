<template>
    <div class="ticketListContainer">
        <ul class="ticketListUl" v-if="state=='success'">
            <li class="item" v-for="item in list">
                <p class="title"></p>
            </li>
        </ul>
    </div>
</template>
<script type="es6">
    let GetTicketList = require("SERVICE_M/booking-ticket-list");
    export default {
        props : {
            pid : {
                type : String,
                require : true,
                default : "111"
            }
        },
        data(){
            return{
                list : [],
                storage : [],
                price : [],
                total_money : "",
                state : "",
                errorMsg : ""
            }
        },
        ready(){
            GetTicketList(this.pid,{
                loading : ()=>{
                    this.state = "loading";
                },
                success : (list)=>{
                    this.state = "success";
                    this.list = list;
                },
                empty : ()=>{
                    this.state = "empty";
                },
                fail : (msg)=>{
                    this.errorMsg = msg;
                }
            })
        },
        methods : {

        },
        watch : {

        },
        components : {

        }
    }
</script>
<style lang="sass">

</style>
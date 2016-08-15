<template>
    <div id="bodyContainer" class="bodyContainer">
        <sheet-calendar v-on:switch-day="onBeginTimeChange" :yearmonth.sync="begin_calendar.yearmonth" :show.sync="begin_calendar.show"></sheet-calendar>
        <input-line
                :model.sync="begin_calendar.date"
                :type="'text'"
                :label="'游玩时间'"
                :click="onClick"
                :icon="'rili'"
                :placeholder="'请选择日期'">
        </input-line>
        <!--<div style="width:40%; margin-top:10px; margin-left:10px"><count :value="0" :max="100" :min="5" :can_0="true"></count></div>-->
        <ticket-list></ticket-list>
    </div>
</template>

<script type="es6">
    import "./index.scss";
    export default {
        data(){
            return {
                begin_calendar : {
                    date : "2016-08-15",
                    yearmonth : "",
                    show : false
                }
            }
        },
        ready(){
            //setTimeout(()=>{
            //    this.begin_calendar.show = true;
            //    this.begin_calendar.yearmonth = "2016-08-15";
            //},1000)
        },
        methods : {
            onBeginTimeChange(data){

            }
        },
        components : {
            sheetCalendar : require("COMMON_VUE_COMPONENTS/sheet-calendar"),
            ticketList : require("COMMON_VUE_COMPONENTS/ticket-list-booking"),
            inputLine : require("./components/input-line")
        }
    }
</script>
<style lang="sass">

</style>

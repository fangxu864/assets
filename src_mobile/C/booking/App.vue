<template>
    <div id="bodyContainer" class="bodyContainer">
        <sheet-calendar v-on:switch-day="onSwitch"></sheet-calendar>
    </div>
</template>

<script type="es6">
    import "./index.scss";
    export default {
        data(){
            return {

            }
        },
        ready(){

        },
        methods : {
            onSwitch(data){
                console.log(data);
            }
        },
        components : {
            sheetCalendar : require("COMMON_VUE_COMPONENTS/sheet-calendar")
        }
    }
</script>
<style lang="sass">

</style>

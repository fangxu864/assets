<template>
    <div class="beginEndTimeContainer">
        <div class="con">
            <div @click="onBegintimeClick" class="beginBox box">
                <p class="tit">入住</p>
                <p><span v-text="beginText"></span></p>
            </div>
            <div @click="onEndtimeClick" class="endBox box">
                <p class="tit">离店</p>
                <p><span v-text="endText"></span></p>
            </div>
            <span class="timeFlag"><span v-text="daycount"></span>晚</span>
        </div>
    </div>
</template>
<script type="es6">
    let Week = {
        1 : "周一",
        2 : "周二",
        3 : "周三",
        4 : "周四",
        5 : "周五",
        6 : "周六",
        7 : "周日",
        0 : "周日"
    };
    export default {
        props : {
            begintime : {
                type : String,
                default : "2016-08-10"
            },
            endtime : {
                type : String,
                default : "2016-08-21"
            },
            daycount : {
                type : Number,
                twoway : true,
                default : 2
            }
        },
        data(){
            return{};
        },
        computed : {
            beginText(){
                var begintime = this.begintime.split("-");
                var weeken = new Date(this.begintime).getDay();
                return (begintime[1]+"月"+begintime[2]+"日 "+Week[weeken]);
            },
            endText(){
                var endtime = this.endtime.split("-");
                var weeken = new Date(this.endtime).getDay();
                return (endtime[1]+"月"+endtime[2]+"日 "+Week[weeken]);
            }
        },
        methods : {
            onBegintimeClick(e){
                this.$dispatch("begintime-click",e);
            },
            onEndtimeClick(e){
                this.$dispatch("endtime-click",e)
            }
        }
    }
</script>
<style lang="sass">
    .beginEndTimeContainer{ padding:10px 25px; border-bottom:1px solid #e5e5e5}
    .beginEndTimeContainer > .con{ position:relative; height:50px; line-height:50px; text-align:center;}
    .beginEndTimeContainer .box{ position:absolute; top:0; bottom:0; line-height:1.5; padding-top:5px; font-size:0.35rem;}
    .beginEndTimeContainer .box.beginBox{ left:0}
    .beginEndTimeContainer .box.endBox{ right:0}
    .beginEndTimeContainer .timeFlag{ display:inline-block; line-height:1.4; padding:0px 7px; border:1px solid #008fc2; color:#008fc2}
</style>
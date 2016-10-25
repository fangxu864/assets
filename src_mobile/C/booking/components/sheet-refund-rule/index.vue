<template>
    <sheet-core :show.sync="show">
        <div class="refundRuleList" slot="content">
            <ul v-html="content"></ul>
            <div @click="show=false" class="cancelBtn">确定</div>
        </div>
    </sheet-core>
</template>
<script type="es6">
    let MinueToDayTime = require("COMMON/js/util.minuToDayTime");
    export default {
        props : {
            show : {
                type : Boolean,
                default : false
            },
            p_type : {
                type : String,
                default : "A"
            },
            ruleList : {},
            reb : {
                default : 0,
                type : Number
            },
            reb_type : {
                default : 1,
                type : Number
            }
        },
        data(){
            return {
                content : ""
            }
        },
        ready(){
            var html = "";
            var that = this;
            var ruleList = this.ruleList;
            var reb = this.reb;
            var reb_type = this.reb_type;
            if(reb!=0){
                var reg_text = reb_type==1 ? (reb+"元") : ("票价的"+reb+"%");
                html += '<li class="refundRuleItem">';
                html += '基础扣费：'+ reg_text;
                html += '</li>';
            }
            if(Object.prototype.toString.call(ruleList)=="[object Array]"){
                for(var i in ruleList){
                    html += '<li class="refundRuleItem">';
                    var item = ruleList[i];
                    html += i*1+1+"、";
                    html += that.beginTimePerfix(that.p_type) + that.getDayTime(item.c_days);
                    html += item.c_type==0 ? "收取手续费："+(item.c_cost / 100) : "收取手续费："+("票价的"+item.c_cost/100);
                    html += item.c_type==0 ? "元" : "%";
                    html += '</li>';
                }
            }else{
                html += '<li class="staticLi">退票需收取'+ruleList/100+'元手续费</li>';
            }
            this.content = html;
        },
        methods : {
            getDayTime(daytime){
                //var day = daytime/(24*60);
                //var day_init = Math.floor(day);
                //var hour = (day-day_init) * 24;
                //var hour_init = Math.floor(hour);
                //var mine = (hour-hour_init) * 60;
                //var mine_init = Math.floor(mine);
                //var day_text = day_init==0 ? "" : (day_init+"天");
                //var hour_text = (day_init==0 && hour_init==0) ? "" : (hour_init+"小时");
                //var mine_text = mine_init + "分钟";
                return MinueToDayTime(daytime)+"内，";
            },
            beginTimePerfix(p_type){
                return {
                    "A" : "游玩日期前",
                    "B" : "集合日期前",
                    "C" : "入住日期前",
                    "F" : "游玩日期前",
                    "H" : "演出日期前"
                }[this.p_type]
            }
        },
        components : {
            sheetCore : require("COMMON_VUE_COMPONENTS/sheet-core")
        }
    }
</script>
<style lang="sass">
    .refundRuleList li{ line-height:1.5; padding:13px 10px; border-bottom:1px solid #e5e5e5;}
    .refundRuleList .cancelBtn{ height:43px; line-height:43px; text-align:center}
    .refundRuleList .staticLi{ height:150px; line-height:60px;}
</style>
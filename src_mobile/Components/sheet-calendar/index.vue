<template>
    <div class="calendarContainer">
        <sheet-core :show.sync="show">
            <div slot="content">
                <div class="state loading" v-if="state=='loading'">努力加载中...</div>
                <div class="state error" v-if="state=='error'" v-text="errorMsg"></div>
                <template v-if="state=='success'">
                    <div class="calTop">
                        <div class="calTopText" v-text="selected_year+'-'+selected_month"></div>
                        <span @click="onPrevMonth" href="javascript:void(0)" class="navBtn prev prevBtn"><i class="iconfont icon-back"></i></span>
                        <span @click="onNextMonth" href="javascript:void(0)" class="navBtn next nextBtn"><i class="iconfont icon-right"></i></span>
                    </div>
                    <div class="calContent">
                        <div class="calContent-head">
                            <flexbox :gutter="flex_gutter">
                                <flex-item>日</flex-item><flex-item>一</flex-item><flex-item>二</flex-item><flex-item>三</flex-item><flex-item>四</flex-item><flex-item>五</flex-item><flex-item>六</flex-item>
                            </flexbox>
                        </div>
                        <div class="calContent-con">
                            <flexbox :gutter="flex_gutter" v-for="date in dates">
                                <flex-item v-for="item in date">
                                    <div @click="onCalendarBoxClick" :class="calBoxCls(item)"
                                         data-weeken="{{item.weeken}}"
                                         data-day="{{item.day}}"
                                         data-price="{{item.price}}"
                                         class="calendar-box">
                                        <span class="day" v-text="item.day"></span>
                                        <span class="price" v-if="item.price"><i class="yen">&yen;</i><em v-text="item.price"></em></span>
                                    </div>
                                </flex-item>
                            </flexbox>
                        </div>
                    </div>
                </template>
            </div>
        </sheet-core>
    </div>
</template>
<script type="es6">
    let CalendarCore = require("COMMON/js/calendarCore");
    let GetCalendarPrice = require("SERVICE_M/calendar-price");
    export default {
        props : {
            pid : {
                type : String,
                default : "111"
            },
            show : {
                type : Boolean,
                default : false,
                twoWay : true
            },
            yearmonth : {
                type : String,
                twoWay : true,
                default : ""
            }
        },
        data(){
            return{
                Cache_Prices : {},
                Cache_Dates : {},
                state : "",
                selected_month : "",
                selected_year : "",
                selected_date : "",
                errorMsg : "",
                dates : [],
                flex_gutter : 0
            }
        },
        ready(){

        },
        watch : {
            yearmonth(val,oldVal){
                if(val.substr(0,7)==oldVal.substr(0,7)) return;
                var arr = val.split("-");
                this.selected_year = arr[0];
                this.selected_month = arr[1];
                if(arr.length==3) this.selected_date = val;
                var _yearmonth = this.selected_year + "-" + this.selected_month;
                this.switchYearmonth(this.pid,_yearmonth);
            }
        },
        methods : {
            calBoxCls(dateObj){
                 return{
                     empty : !dateObj.day,
                     disable : typeof dateObj.price=="undefined",
                     prevmonth : (dateObj.month!=='current' && dateObj.month < this.selected_month),
                     nextmonth : (dateObj.month!=='current' && dateObj.month > this.selected_month),
                     currentmonth : dateObj.month=='current',
                     todaybefore : dateObj.today=='before',
                     todayafter : dateObj.today=='after',
                     today : dateObj.today=='today',
                     selected : dateObj.date==this.selected_date
                 }
            },
            switchYearmonth(pid,yearmonth){
                if(!pid || !yearmonth) return console.error("缺省pid或yearmonth");
                var cache_dates = this.Cache_Dates[yearmonth];
                var cache_prices = this.Cache_Prices[yearmonth];
                if(!cache_dates) cache_dates = this.Cache_Dates[yearmonth] = CalendarCore.outputDate(yearmonth);
                if(!cache_prices){
                    GetCalendarPrice(pid,yearmonth,{
                        loading : ()=> {
                            this.state = "loading";
                        },
                        success : (list)=> {
                            this.dates = this.mixPricesInDates(cache_dates,list);
                            this.Cache_Prices[yearmonth] = list;
                            this.state = "success";
                        },
                        empty : (list)=> {
                            this.state = "empty";
                        },
                        fail : (msg)=> {
                            this.errorMsg = msg;
                            this.state = "fail";
                        }
                    })
                }else{
                    this.state = "success";
                    this.dates = this.mixPricesInDates(cache_dates,cache_prices);
                }
            },
            mixPricesInDates(dates,prices){
                dates.forEach(function(date,index){
                    date.forEach(function(_date,_index){
                        var price = prices[_date.date];
                        if(price) _date["price"] = price;
                    })
                })
                return dates;
            },
            onNextMonth(){
                this.yearmonth = CalendarCore.nextMonth(this.yearmonth);
            },
            onPrevMonth(){
                this.yearmonth = CalendarCore.prevMonth(this.yearmonth);
            },
            onCalendarBoxClick(e){
                var tarBox = $(e.target);
                tarBox = tarBox.hasClass("calendar-box") ? tarBox : tarBox.parents(".calendar-box");
                if(tarBox.hasClass("empty") || tarBox.hasClass("disable")) return false;
                var year = this.selected_year;
                var month = this.selected_month;
                var day = tarBox.attr("data-day");
                var yearmonth = year + "-" + month;
                var date = yearmonth + "-" + day;
                var data = {
                    day :       day,
                    weeken :    tarBox.attr("data-weeken"),
                    price :     tarBox.attr("data-price"),
                    month :     month,
                    year :      year,
                    date :      date,
                    yearmonth : yearmonth
                };
                this.selected_date = date;
                this.$dispatch("switch-day",data);
                this.show = false;
            }
        },
        components : {
            sheetCore : require("COMMON_VUE_COMPONENTS/sheet-core"),
            flexbox : require("VUX_COMPONENTS/flexbox/index.vue"),
            flexItem : require("VUX_COMPONENTS/flexbox-item/index.vue")
        }
    }
</script>
<style lang="sass">
    .calendarContainer .state{ height:350px; line-height:350px; text-align:center}
    .calendarContainer .calTop{ position:relative}
    .calendarContainer .calTopText{ height:43px; line-height:43px; margin:0 60px; text-align:center; font-size:0.35rem; font-weight:bold}
    .calendarContainer .calTop .navBtn{ display:block; position:absolute; width:60px; top:0; bottom:0; line-height:43px; text-align:center}
    .calendarContainer .calTop .navBtn .iconfont{ color:rgb(100,100,100)}
    .calendarContainer .calTop .navBtn.prev{ left:0}
    .calendarContainer .calTop .navBtn.next{ right:0}
    .calendarContainer .calContent-head{ background:rgb(240,240,240); height:36px; line-height:36px; border-top:1px solid #e5e5e5; border-bottom:1px solid #e5e5e5;}
    .calendarContainer .calContent-head .vux-flexbox{ text-align:center}
    .calendarContainer .calendar-box{ position:relative; text-align:center; height:40px; padding:7px 0 2px; overflow:hidden; border-right:1px solid #e5e5e5; border-bottom:1px solid #e5e5e5  }
    .calendarContainer .calendar-box.empty,.calendarContainer .calendar-box.disable{ background:rgb(252,252,252)}
    .calendarContainer .calendar-box.selected{ background:#f37138; color:#fff}
    .calendarContainer .calendar-box.selected .price{ color:#fff}
    .calendarContainer .calendar-box .day{ display:block; font-size:0.35rem; line-height:1.5}
    .calendarContainer .calendar-box .price{ color:#f37138}
    .calendarContainer .vux-flexbox-item:last-child .calendar-box{ border-right:0 none;}
</style>
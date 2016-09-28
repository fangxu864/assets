<template>
    <div class="beginEndTimeContainer">
        <div class="con">
            <div @click="onBegintimeClick" class="beginBox box">
                <p class="tit">入住</p>
                <p><span id="beginTimeInp_hotel" v-text="beginText"></span></p>
            </div>
            <div @click="onEndtimeClick" class="endBox box">
                <p class="tit">离店</p>
                <p><span id="endTimeInp_hotel" v-text="endText"></span></p>
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
    //const GetStoragePriceHotel = require("SERVICE_M/booking-storage-price-hotel");
    //const Toast = require("COMMON/modules/toast");
    export default {
        props : {
            pid : {
                type : String,
                default : ""
            },
            aid : {
                type : String,
                default : ""
            },
            begintime : {
                type : String,
                twoway : true,
                default : "2016-08-10"
            },
            endtime : {
                type : String,
                twoway : true,
                default : "2016-08-21"
            },
            daycount : {
                type : Number,
                twoway : true,
                default : 2
            },
            ticketList : {
                type : Array,
                twoway : true,
                detault : function(){ return[]}
            },
            switchor : {
                type : String,
                twoway : true,
                default : ""
            }
        },
        data(){
            return{};
        },
        ready(){
            //this.toast = new Toast();
             this.$on("calendar-date-switch",(data) => {
                 var date = data.date;
                 var begintime = this.begintime;
                 var begintime_s = +new Date(begintime);
                 var endtime = this.endtime;
                 var endtime_s = +new Date(endtime);
                 var date_s = +new Date(date);
                 if(this.switchor=="begin"){
                     if(date_s>=endtime_s){
                         this.endtime = (function(){
                             var _begintime = new Date(date);
                             var endtime = new Date(_begintime.getTime()+24*60*60*1000);
                             var year = endtime.getFullYear();
                             var month = endtime.getMonth()*1+1;
                             var day = endtime.getDate();
                             if(month<10) month = "0"+month;
                             if(day<10) day = "0"+day;
                             var result = year+"-"+month+"-"+day;
                             return result;
                         })();
                     }
                     this.begintime = date;
                 }else{ //切换的是离店时间
                     if(date_s<=begintime_s) return alert("离店时间必须晚于入住时间");
                     this.endtime = date;
                 }
                 var daycount = +new Date(this.endtime) - (+new Date(this.begintime));
                 daycount = daycount / (24 * 60 *60 * 1000);
                 this.daycount = daycount;

                 //修改入住时间或离店时间都会重新请求一次价格跟库存
                 this.queryStoragePrice();

             })

             //this.queryStoragePrice();

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
            },
            //修改入住时间或离店时间都会重新请求一次价格跟库存
            queryStoragePrice(){
                var pid = this.pid;
                var aid = this.aid;
                var beginDate = this.begintime;
                var endDate = this.endtime;
                GetStoragePriceHotel({
                    pid : pid,
                    aid : aid,
                    beginDate : beginDate,
                    endDate : endDate
                },{
                    loading : () => { this.toast.show("loading","努力加载中...")},
                    success : (data) => {
                        this.toast.hide();

                        var price = data.jsprice;

                        var store = (function(){
                            var storage = data.store;
                            var storeArray = [];
                            for(var i in storage) storeArray.push(storage[i]);

                            var getStoreMin = function(array){
                                if(array.length==0) return null;
                                var no_limit_arr = [];
                                var limit_arr = [];
                                array.forEach(function(item,index){
                                    if(item==-1) no_limit_arr.push(item);
                                    if(item!=-1) limit_arr.push(item);
                                })
                                //都为-1
                                if(no_limit_arr.length==array.length) return -1;
                                return Math.min.apply({},limit_arr);
                            };

                            var storeMin = getStoreMin(storeArray);

                            if(daycount==1){ //预订1天
                                return{
                                    daycount : daycount,
                                    storeNum : storeArray[0],
                                    storeText : ""
                                }
                            }else{ //预订1天以上

                                //在多天中只要有一天库存为0(没有库存)，即视为用户选择的时间段内没有库存，无法下单
                                //有问题请 @产品-詹必魁
                                if(storeMin==0){
                                    return{
                                        daycount : daycount,
                                        storeNum : 0,
                                        storeText : "无"
                                    }
                                }else{ //如果选择的时间段内都有库存(包含不限库存)，库存取最小的那天
                                    if(storeMin==-1){ //时间段内每一天库存都为不限
                                        return{
                                            daycount : daycount,
                                            storeNum : -1,
                                            storeText : "有"
                                        }
                                    }else{ //如果时间段内有不限的 也有 具体库存的，取具体库存最小值
                                        return{
                                            daycount : daycount,
                                            storeNum : storeMin,
                                            storeText : "有"
                                        }
                                    }
                                }
                            }

                            //赋值给ticketList



                        })();
                    },
                    fail : (msg) => {
                        this.toast.hide();
                        alert(msg);
                    }
                })
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
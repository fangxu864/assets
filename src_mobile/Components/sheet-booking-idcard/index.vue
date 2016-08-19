<template>
    <sheet-core :show.sync="show" :height="'80%'">
        <div class="tourMsgContainer" slot="content">
            <div class="topTip">请正确填写，因信息不完整、填写不正确造成的额外损失，需由客人自行承担</div>
            <div class="listCon">
                <ul class="listUl">
                    <li class="ticketLi" v-for="ticket in list">
                        <p class="ticketname" v-text="ticket.title"></p>
                        <div class="idcardItem" v-for="tour in ticket.tourMsg">
                            <input type="text" class="nameInp" :placeholder="'游客信息'+($index*1+1)" v-model="tour.name"/>
                            <input type="text" class="idcardInp" placeholder="身份证" v-model="tour.idcard"/>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="botBtnGroup">
                <span class="btn yes">确定</span>
                <span @click="show=false" class="btn cancel">取消</span>
            </div>
        </div>
    </sheet-core>
</template>
<script type="es6">
    export default {
        props : {
            show : {
                type : Boolean,
                require : true,
                default : false,
                twoway : true
            },
            list : {
                type : Array,
                require : true,
                twoway : true,
                default : function(){
                    return [];
                }
            }
        },
        components : {
            sheetCore : require("COMMON_VUE_COMPONENTS/sheet-core")
        }
    }
</script>
<style lang="sass">
    $btnHeight : 54px;
    $btnLineHeight : 34px;
    $topTipHeight : 48px;
    .tourMsgContainer{ position:relative; height:100%; overflow:hidden}
    .tourMsgContainer .topTip{
        position:absolute; top:0; left:0; right:0; height:$topTipHeight;
        font-size:0.35rem; line-height:1.5; padding:5px 15px;
        box-shadow:0 1px 1px rgba(0,0,0,0.1);
        box-sizing:border-box;
    }
    .tourMsgContainer .listCon{ position:absolute; top:$topTipHeight; bottom:$btnHeight; left:0; right:0; overflow:auto; -webkit-overflow-scrolling:touch}
    .tourMsgContainer .ticketLi{ padding:15px 0; margin:0 15px; border-bottom:1px solid #e5e5e5}
    .tourMsgContainer .ticketLi:last-child{ border-bottom:0 none}
    .tourMsgContainer .ticketLi .ticketname{ font-size:0.35rem; font-weight:bold;}
    .tourMsgContainer .ticketLi .idcardItem{ width:100%; overflow:hidden; position:relative; margin-top:8px;}
    .tourMsgContainer .idcardItem input{
        display:block; float:left;
        height:32px; line-height:22px; box-sizing:border-box;
        box-shadow:inset 1px 1px 1px rgba(0,0,0,0.05);
        border:1px solid #e5e5e5;
        padding:5px 5px;
    }
    .tourMsgContainer .idcardItem .nameInp{ float:left; width:30%;}
    .tourMsgContainer .idcardItem .idcardInp{ float:right; width:67%;}
    .tourMsgContainer .botBtnGroup{
        position:absolute; left:0; right:0; bottom:0; height:$btnHeight; overflow:hidden;
        padding:10px 15px; border-top:1px solid #e5e5e5;
        box-sizing:border-box;
        background:#fff;
    }
    .tourMsgContainer .botBtnGroup .btn{
        display:inline-block;
        width:47%;
        height:100%;
        line-height:$btnLineHeight;
        text-align:center;
    }
    .tourMsgContainer .botBtnGroup .btn.yes{ float:right; background:#258cc9; color:#fff}
    .tourMsgContainer .botBtnGroup .btn.cancel{ float:left; background:#c7c7c7; color:#333}
</style>
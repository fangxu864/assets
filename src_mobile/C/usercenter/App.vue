<template>
    <div class="body">
        <div class="photoContainer">
            <div class="infoContainer">
                <div class="infoBox">
                    <div class="infoCon">
                        <div class="userInfoBox" style="background-image:url('http://static.12301.cc/assets/build/images/dlogin_mg_cpft7.jpg')">
                        </div>
                        <p class="topTitleName">店铺名稍店铺名称</p>
                    </div>
                </div>
            </div>
            <img class="photoImg" src="http://static.12301.cc/assets/build/images/wx_mall_c_usercenter_bg.jpg" alt=""/>
        </div>
        <div class="absContainer">
            <div class="col left">
                <div>
                    <span class="t">帐户余额</span>
                    <i class="yen">&yen;</i><em class="num">45.32</em>
                </div>
                <div style="margin-top:10px"><a href="javascript:void(0)">红包提现</a></div>
            </div>
            <div class="col right">
                <div>
                    <span class="t">手机号</span>
                    <span class="mobileNum">18306936755</span>
                </div>
                <div style="margin-top:10px"><a href="javascript:void(0)">解绑</a></div>
            </div>
        </div>
        <div class="line-list">
            <line-item :class-name="'fenxiao'">
            <span slot="left">
                <i class="icon-biz icon-fenxiao"></i>
                <span class="t">分销中心</span>
            </span>
            <span slot="right">
                <span class="t">累计佣金：<i class="yen">&yen;</i><em class="num">136</em></span>
                <i class="uicon uicon-jiantou-sin-right"></i>
            </span>
            </line-item>
            <line-item :class-name="'fenxiao'">
            <span slot="left">
                <i class="icon-biz icon-fenxiao"></i>
                <span class="t">分销中心</span>
            </span>
            <span slot="right">
                <span class="t">累计佣金：<i class="yen">&yen;</i><em class="num">136</em></span>
                <i class="uicon uicon-jiantou-sin-right"></i>
            </span>
            </line-item>
        </div>
    </div>
    <page-footer></page-footer>
</template>
<script type="es6">
    export default{
        data(){
            return{

            }
        },
        ready(){

        },
        components : {
            lineItem : require("COMMON_VUE_COMPONENTS/line-item"),
            pageFooter : require("COMMON_VUE_COMPONENTS/page-footer")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/main";
    body{ background:$bgColor}
    .body{ min-height:600px}
    .photoContainer{
        position:relative;
        font-size:0;
    }
    .photoContainer .photoImg{ width:100%}
    .pftui-line-item.fenxiao .icon-fenxiao{ color:#f37138}
    .infoContainer{ position:absolute; top:0; right:0; left:0; bottom:0}
    .infoBox{
        width:100%; height:100%;
        display:flex;
        justify-content:center;
        align-items:center;
    }
    .userInfoBox{
        width:px2rem(160);
        height:px2rem(160);
        font-size:0;
        overflow:hidden;
        border-radius:50%;
        border:3px solid rgba(0,0,0,0.05);
        margin:0 auto 15px;
        background-color:#fff;
        background-position:center center;
        background-repeat:no-repeat;
        background-size:cover;
    }
    .userInfoBox img{ width:100%}
    .topTitleName{ font-size:0.4rem; font-weight:bold; text-align:center; color:#fff}

    .absContainer{ width:100%; overflow:hidden; background:#fff; margin-bottom:10px; border-bottom:1px solid $gray90}
    .absContainer .col{ position:relative; float:left; box-sizing:border-box; padding:20px 0; font-size:0.35rem}
    .absContainer .col .t{ margin-right:5px; color:$gray50}
    .absContainer .col.left{ width:40%; padding-left:20px;}
    .absContainer .col.right{ padding-left:20px;}
    .absContainer .col.right:before{
        content : "";
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        width:1px;
        font-size:0;
        background:$gray80;
        transform:scaleX(0.5);
    }
</style>
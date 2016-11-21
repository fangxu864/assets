<template>
    <template v-if="state=='success'">
        <div class="body">
            <div class="photoContainer">
                <div class="infoContainer">
                    <div class="infoBox">
                        <div class="infoCon">
                            <div class="userInfoBox" :style="{backgroundImage:'url('+info.headImg+')'}">
                            </div>
                            <p class="topTitleName" v-text="info.name"></p>
                        </div>
                    </div>
                </div>
                <img class="photoImg" src="http://static.12301.cc/assets/build/images/wx_mall_c_usercenter_bg.jpg" alt=""/>
            </div>
            <div class="absContainer">
                <div class="col left">
                    <div>
                        <span class="t">帐户余额</span>
                        <i class="yen">&yen;</i><em class="num" v-text="info.remainMoney"></em>
                    </div>

                </div>
                <div class="col right">
                    <div v-if="info.remainMoney>1"><a href="javascript:void(0)">红包提现</a></div>
                    <!--<div>-->
                        <!--<span class="t">手机号</span>-->
                        <!--<span v-if="info.mobile" class="mobileNum" v-text="info.mobile"></span>-->
                    <!--</div>-->
                    <!--<div style="margin-top:10px"><a :href="link" v-text="bindMobileText"></a></div>-->
                </div>
            </div>
            <div class="line-list">
                <line-item :link="menuName=='orderList'? 'userorder.html' : ''" :class-name="menuName" v-for="(menuName,item) in info.menus">
                    <span slot="left">
                        <i class="icon-biz" :class="getCls(menuName)"></i>
                        <span class="t" v-text="item.name"></span>
                    </span>
                    <span slot="right">
                        <i class="uicon uicon-jiantou-sin-right"></i>
                    </span>
                </line-item>
                <line-item :link="'index.html'">
                    <span slot="left">
                        <span class="t" v-text="'去逛逛'"></span>
                    </span>
                    <span slot="right">
                        <i class="uicon uicon-jiantou-sin-right"></i>
                    </span>
                </line-item>
            </div>
            <span @click="onLogoutBtnClick" class="accountLoginBtn" data-wxaccount="{{wxAccount}}" v-text="wxAccount==1 ? '切换手机号登录' : '退出'"></span>
        </div>
        <page-footer></page-footer>
    </template>
</template>
<script type="es6">
    const FetchUsercenterInfo = require("SERVICE_M/mall-member-usercenter-info");
    const Logout = require("SERVICE_M/mall-member-user-logout");
    let Toast = new PFT.Mobile.Toast;
    let Alert = PFT.Mobile.Alert;
    export default{
        data(){
            return{
                state : "",
                wxAccount : "1",
                info : {}
            }
        },
        computed : {
            link(){
                if(this.info.mobile){ //如果已绑定
                    return "javascript:void(0)";
                }else{
                    return "bind_mobile.html";
                }
            },
            bindMobileText(){
                if(this.info.mobile){ //如果已绑定
                    return "解绑";
                }else{
                    return "绑定";
                }
            }
        },
        ready(){
            var Mobile = PFT.Mobile;
            let Toast = new Mobile.Toast();
            FetchUsercenterInfo({
                loading : () => {
                    Toast.show("loading","努力加载中...");
                },
                complete : ()=> { Toast.hide()},
                success : (data)=> {
                    var that = this;
                    this.state = "success";
                    if(typeof data.wxAccount!=="undefined") this.wxAccount = data.wxAccount;
                    for(var i in data) that.$set("info."+i,data[i]);
                },
                fail : (msg,code)=> {
                    Alert(msg);
                    if(code==102){
                        window.location.href = "bind_mobile.html";
                    }
                }
            })
        },
        methods : {
            getCls(menuName){
                return{
                    saleCenter : "icon-fenxiao",
                    orderList : "icon-wodedingdan",
                    coupon : "icon-youhuiquan",
                    poster : "icon-erweima"
                }[menuName];
            },
            onLogoutBtnClick(e){
                var tarBtn = $(e.currentTarget);
                if(tarBtn.hasClass("disable")) return false;
                Logout({
                    loading : ()=> {
                        tarBtn.addClass("disable");
                        Toast.show("loading","请稍后...")
                    },
                    complete : ()=> {
                        tarBtn.removeClass("disable");
                        Toast.hide();
                    },
                    success : (data)=> {
                       window.location.href = "bind_mobile.html";
                    },
                    fail : (msg,code)=> {
                        Alert(msg);
                    }
                })
            }
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
    .pftui-line-item.saleCenter .icon-biz{ color:$orange}
    .pftui-line-item.orderList .icon-biz{ color:$blue}
    .pftui-line-item.coupon .icon-biz{ color:$orange; font-size:18px}
    .pftui-line-item.poster .icon-biz{ color:$green}

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
        margin:0 auto 15px;
        background-color:#fff;
        background-position:center center;
        background-repeat:no-repeat;
        background-size:cover;
    }
    .userInfoBox img{ width:100%}
    .topTitleName{ font-size:0.4rem; font-weight:bold; text-align:center; color:#fff}
    .absContainer{ width:100%; overflow:hidden; background:#fff; margin-bottom:10px; border-bottom:1px solid $gray90}
    .absContainer .col{ position:relative; float:left; box-sizing:border-box; padding:20px 0 20px 18px; font-size:0.35rem}
    .absContainer .col .t{ margin-right:5px; color:$gray50}
    .absContainer .col.left{ width:40%; }
    .absContainer .col.right{ float:right; padding-right:15px }
    /*.absContainer .col.right:before{*/
        /*content : "";*/
        /*position:absolute;*/
        /*top:0;*/
        /*left:0;*/
        /*bottom:0;*/
        /*width:1px;*/
        /*font-size:0;*/
        /*background:$gray80;*/
        /*transform:scaleX(0.5);*/
    /*}*/

    .accountLoginBtn{
        @include btn-block();
        width:auto;
        height:px2rem(86);
        line-height:px2rem(86);
        margin:30px 15px 0;
        text-align:center;
        &.disable{ @include btn-disable}
    }



</style>
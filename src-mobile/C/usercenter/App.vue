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
                        <i class="icon-ecshop-application icon-zhanghaoyue"></i>
                        <span class="t">帐户余额</span>
                        <i class="yen" growing-ignore="true">&yen;</i><em class="num" v-text="info.remainMoney"></em>
                    </div>
                </div>
                <div class="col right">
                    <div v-if="info.remainMoney>1 && info.allDisMan"><a @click="sheetShow=true" href="javascript:void(0)">红包提现</a></div>
                </div>
            </div>
            <div class="line-list">
                <line-item :link="item.link" :class-name="menuName" v-for="(menuName,item) in info.menus">
                    <span slot="left">
                        <i class="icon-ecshop-application" :class="getCls(menuName)"></i>
                        <span class="t" v-text="item.name"></span>
                    </span>
                    <span slot="right">
                        <i class="uicon uicon-jiantou-sin-right"></i>
                    </span>
                </line-item>
                <line-item :link="'index.html'">
                    <span slot="left">
                        <i class="icon-ecshop-application icon-quguangguang"></i>
                        <span class="t" v-text="'去逛逛'"></span>
                    </span>
                    <span slot="right">
                        <i class="uicon uicon-jiantou-sin-right"></i>
                    </span>
                </line-item>
            </div>
            <span @click="onLogoutBtnClick" class="accountLoginBtn" data-wxaccount="{{wxAccount}}" v-text="wxAccount==1 ? '切换手机号登录' : '退出'"></span>
        </div>
        <sheet-core :show.sync="sheetShow">
            <div slot="content" class="cashSheetContainer">
                <p class="title">请输入提现金额</p>
                <input type="number" name="" class="cashMoney" id="" v-model="cashMoney"/><i class="tip">1到200之间</i>
                <div class="btnGroup">
                    <a href="javascript:void(0)" @click="sheetShow=false" class="btn no">取消</a>
                    <a href="javascript:void(0)" @click="onCash" class="btn yes">确定</a>
                </div>
            </div>
        </sheet-core>
        <page-footer></page-footer>
    </template>
</template>
<script type="es6">
    const FetchUsercenterInfo = require("SERVICE_M/mall-member-usercenter-info");
    const Logout = require("SERVICE_M/mall-member-user-logout");
    let Toast = new PFT.Mobile.Toast;
    let Alert = PFT.Mobile.Alert;
    const Cash = require("SERVICE_M/mall-alldis").cash;
    export default{
        data(){
            return{
                state : "",
                wxAccount : "1",
                info : {},
                sheetShow : false,
                cashMoney : "",
                Link : {
                    "saleCenter" : "distri_center.html",
                    "coupon" : "javascript:void(0)",
                    "orderList" : "userorder.html",
                    "poster" : "share_my_shop.html"
                }
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
                    var Link = this.Link;
                    this.state = "success";
                    if(typeof data.wxAccount!=="undefined") this.wxAccount = data.wxAccount;

                    for(var i in data.menus){
                        data.menus[i]["link"] = Link[i] ? Link[i] : "javascript:void(0)";
                    }

                    that.$set("info",data);
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
                    poster : "icon-haibaotuiguang"
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
            },
            onCash(e){
                var that = this;
                var tarBtn = $(e.target);
                if(tarBtn.hasClass("disable")) return false;
                var money = this.cashMoney;
                var totalMoney = this.info.remainMoney * 1;
                if(isNaN(money)) return false;
                money = money * 1;
                if(money<1 || money>200) return Alert("提现金额须在1-200之间");
                if(money>totalMoney) return Alert("提现金额超出帐户余额，请修改提现金额");
                Cash({
                    money : money,
                    loading : function(){
                        Toast.show("loading","请稍后...")
                    },
                    complete : function(){
                        Toast.hide();
                    },
                    success : function(){
                        Alert("恭喜您，提现成功！");
                        that.sheetShow = false;
                        that.info.remainMoney = that.info.remainMoney - money;
                        that.cashMoney = "";

                    },
                    fail : function(msg,code){ Alert(msg)}
                })
            }
        },
        components : {
            lineItem : require("COMMON_VUE_COMPONENTS/line-item"),
            sheetCore : require("COMMON_VUE_COMPONENTS/sheet-core"),
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

    .line-list{
        .icon-wodedingdan{ position:relative; color:$orange;}
        .icon-youhuiquan{ position:relative; color:$green;}
        .icon-haibaotuiguang{ position:relative; top:1px; color:$blue;}
        .icon-quguangguang{ position:relative; top:1px; color:#db41d3;}
    }

    .icon-zhanghaoyue{
        position:relative;
        top:1px;
        color:$blue;
    }

    .cashSheetContainer{
        height:150px;
        background:#fff;
        padding:20px;

        .title{
            padding-top:10px;
            margin-bottom:10px;
            font-size:14px;
            font-weight:bold;
        }

        .tip{ color:#999; margin-left:10px}

        .cashMoney{
            width:120px;
            height:22px;
            padding:3px 6px;
            border:1px solid #e5e5e5;
            box-shadow:inset 1px 1px 1px rgba(0,0,0,0.1);
        }

        .btnGroup{
            position:absolute;
            left:0;
            right:0;
            bottom:0;
            height:44px;
            line-height:44px;
            font-size:0;
            border-top:1px solid #e5e5e5;
            .btn{
                display:inline-block;
                height:100%;
                line-height:44px;
                width:50%;
                position:relative;
                font-size:12px;
                text-align:center;
            }
            .btn.yes:before{
                content:"";
                position:absolute;
                top:0;
                bottom:0;
                left:0;
                width:1px;
                background:#e5e5e5;
            }

        }

    }

</style>
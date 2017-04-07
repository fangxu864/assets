<template>
    <div id="loginPage" class="loginPage" :class="{'show':show}" :style="{zIndex:zIndex}">
        <div class="loginPageCon">
            <div class="line account">
                <span class="descIcon"><i class="iconfont icon-user"></i></span>
                <input type="text" v-model="account" name="" autocomplete="off" id="accountInp" class="accountInp textInp" placeholder="手机号或平台帐号"/>
                <div @click="onClearBtnClick" class="clearBtn account" :class="{'show':account}"><i class="iconfont icon-shanchu2"></i></div>
            </div>
            <div class="line">
                <span class="descIcon"><i class="iconfont icon-iconmima"></i></span>
                <input type="password" v-model="password" name="" autocomplete="off" id="passwordInp" class="passwordInp textInp" placeholder="请输入密码"/>
                <div @click="onClearBtnClick" class="clearBtn password" :class="{'show':password}"><i class="iconfont icon-shanchu2"></i></div>
            </div>
            <button id="loginSubmitBtn" class="loginSubmitBtn" :class="{'disable':!submitBtnDisable}">绑定</button>
        </div>
    </div>
</template>
<script type="es6">
    export default {
        data(){
            return{
                account : "",
                password : ""
            }
        },
        props : {
            show : {
                type : Boolean,
                default : false
            },
            zIndex : {
                type : Number,
                default : 99
            }
        },
        computed : {
            submitBtnDisable(){
                return false;
            }
        },
        methods : {
            onClearBtnClick(e){
                var tarBtn = e.currentTarget;
                tarBtn.classList.contains("account") ? (this.account = "") : (this.password = "");
            }
        }
    }
</script>
<style lang="sass">
    #loginPage{ display:none; position:fixed; top:0; left:0; right:0; bottom:0; z-index:-1; background:#fff}
    #loginPage.show{ display:block; z-index:99;}
    #loginPage .line .clearBtn{ display:none}
    #loginPage .line .clearBtn.show{ display:block}
</style>
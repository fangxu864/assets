<template>
    <sheet-core :height="'100%'" :show.sync="show">
        <div id="contactContainer" class="contactContainer" slot="content" growing-ignore="true">
            <div class="contact-header">常用联系人</div>
            <div class="content">
                <template v-if="list">
                    <ul class="userList">
                        <li class="userItem" v-for="(mobile,name) in list">
                            <div class="con">
                                <div @click="onNameColClick" class="nameCol">
                                    <span class="name" v-text="name"></span>
                                    <span class="mobile" v-text="mobile"></span>
                                </div>
                                <a @click="onDeleteBtnClick" href="javascript:void(0)" class="deleteBtn"><i class="uicon uicon-shanchu"></i></a>
                            </div>
                        </li>
                    </ul>
                </template>
                <template v-else>
                    <div class="emptyItem">尚无常用联系人</div>
                </template>
            </div>
            <div @click="show=false" class="foot-cancelBtn">取消</div>
        </div>
    </sheet-core>
</template>
<script type="es6">
    export default {
        props : {
            show : {
                type : Boolean,
                twoway : true,
                default : false
            }
        },
        data(){
            return{
                selected_id : "",
                list : {}
            }
        },
        computed : {

        },
        ready(){
            var that = this;
            var contacts = this.getFromStorage();
            this.list = contacts;
            this.$on("orderBtn.click",function(data){
                that.addStorage(data.name,data.mobile);
            })
        },
        watch : {

        },
        methods : {
            onNameColClick(e){
                var target = $(e.target);
                if(target.hasClass("name") || target.hasClass("mobile")){
                    target = target.parent();
                }
                var name = target.find(".name").text();
                var mobile = target.find(".mobile").text();
                this.$dispatch("select",{name:name,mobile:mobile});
            },
            onDeleteBtnClick(e){
                var target = $(e.target);
                if(target.hasClass("uicon")){
                    target = target.parent();
                }
                var parent = target.parent();
                var name = parent.find(".name").text();
                var mobile = parent.find(".mobile").text();

                this.removeFromStorage(mobile);
                this.list = this.getFromStorage();

                this.$dispatch("delete",{name:name,mobile:mobile});
            },
            getFromStorage : function(){
                var key = "WX-C-USUAL-CONTACTER";
                var contacts = window.localStorage.getItem(key);
                return contacts ? JSON.parse(contacts) : null;
                //contacts = {"18305915678":"姓名","18305915678":"姓名","18305915678":"姓名"};
            },
            removeFromStorage : function(mobile){
                var key = "WX-C-USUAL-CONTACTER";
                var contacts = this.getFromStorage();
                if(!contacts) return false;
                delete contacts[mobile];
                if(PFT.Util.isEmptyObject(contacts)){
                    localStorage.removeItem(key);
                }else{
                    localStorage.setItem(key,JSON.stringify(contacts));
                }
            },
            addStorage : function(name,mobile){
                var key = "WX-C-USUAL-CONTACTER";
                if(!name || !mobile) return false;
                var contacts = this.getFromStorage() || {};
                contacts[mobile] = name;
                this.list = contacts;
                localStorage.setItem(key,JSON.stringify(contacts));
            }
        },
        components : {
            sheetCore : require("COMMON_VUE_COMPONENTS/sheet-core")
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/main";
#contactContainer{
    height:100%;
    overflow:hidden;

    .contact-header{
        height:40px;
        line-height:40px;
        text-align:center;
        border-bottom:1px solid $gray90;
    }
    .content{
        position:absolute;
        top:41px;
        bottom:44px;
        left:0;
        right:0;
        width:100%;
        overflow:auto;
        -webkit-overflow-scrolling:touch;
    }
    .foot-cancelBtn{
        position:absolute;
        bottom:0;
        left:0;
        right:0;
        height:43px;
        line-height:43px;
        text-align:center;
        border-top:1px solid $gray90;
        color:$blue;
    }

    .userItem{
        height:45px;
        line-height:45px;
        margin:0 10px;
        overflow:hidden;
        border-bottom:1px solid $gray90;

        .con{
            position:relative;
            padding-right:45px;
        }

        .nameCol{ position:relative; overflow:hidden}
        .nameCol:active{
            background:$gray95;
        }
        .name{
            display:block;
            float:left;
            width:80px;
            padding-left:10px;
            text-overflow:ellipsis;
            white-space:nowrap;
            overflow:hidden;
        }
        .mobile{
            float:left;
            margin-left:5px;
        }
        .deleteBtn{
            position:absolute;
            top:0;
            right:0;;
            height:45px;
            line-height:45px;
            width:45px;
            text-align:center;
            color:$gray60;
            &:active{
                background:$gray95;
                color:$blue;
            }
        }

    }

    .emptyItem{
        height:150px;
        line-height:150px;
        text-align:center;
    }



}
</style>
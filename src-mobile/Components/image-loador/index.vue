<template>
    <div class="ui-image-container" :style="{height:height+'px'}">
        <template v-if="state=='loading'">
            <div :style="{height:height+px, lineHeight:height+px, textAlign:center}">loading...</div>
        </template>
        <template v-if="state=='success'">
            <img v-if="fixed" :style="{marginTop:marginTop+'px'}" :src="src" alt=""/>
            <img v-else :src="src" :style="{top:0}" alt=""/>
        </template>
    </div>
</template>
<script type="es6">
    export default {
        props : {
            src : {
                type : String,
                default : "",
                require : true
            },
            error : {
                type : String,
                default : PFT.DEFAULT_IMG
            },
            height : {
                type : Number,
                default : 100
            },
            fixed : {
                type : Boolean,
                default : false
            }
        },
        data(){
            return{
                state : "loading",
                imgHeight : 0
            }
        },
        ready(){
            var img = new Image();
            img.onload = () => {
                this.state = "success";
                this.imgHeight = this.calImageHeight(img);
                if(!this.fixed) this.height = this.imgHeight;
                this.$dispatch("success",this.src,img,this.imgHeight);
            }
            img.onerror = () => {
                this.src = this.error;
                img.src = this.error;
                img.onerror = null;
            }

            img.src = this.src;

            if(img.complete){
                this.state = "success";
                this.imgHeight = this.calImageHeight(img);
                if(!this.fixed) this.height = this.imgHeight;
                this.$dispatch("success",this.src,img,this.imgHeight);
                return false;
            }
        },
        computed : {
            marginTop : function(){
                return -(this.imgHeight / 2);
            }
        },
        methods : {
            calImageHeight(img){
                var iW = img.width;
                var iH = img.height;
                var cW = document.querySelector(".ui-image-container").offsetWidth;
                var sH = parseInt((cW*iH)/iW);
                return sH;
            }
        }
    }
</script>
<style lang="sass">
    .ui-image-container{ position:relative; width:100%; overflow:hidden; font-size:0; transition:height 0.2s}
    .ui-image-container img{
        position:absolute;
        width:100%;
        left:0;
        right:0;
        top:50%;
    }
</style>
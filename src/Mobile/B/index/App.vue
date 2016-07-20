<template>
    <div id="app">
        <product-list></product-list>
    </div>
</template>

<script type="es6">
    export default {
        data(){
            return {
                msg: 'Hello Vue!'
            }
        },
        components : {
            productList : require("./components/product.list.vue")
        }
    }
</script>


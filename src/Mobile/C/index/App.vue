<template>
    <div id="app">
        <h1>{{ msg }}</h1>
    </div>
</template>

<script type="es6">
    export default {
        data() {
            return {
                msg: 'Hello Vue!'
            }
        }
    }
</script>

<style lang="sass">
    body {
        font-family: Helvetica, sans-serif;
    }
    .container{
        box-shadow:1px 1px 1px rgba(0,0,0,0.7);
        transform:translateX(50%)
    }
</style>

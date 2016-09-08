//import App from "./App.vue";
//import Vue from "vue";
//import VueRouter from "vue-router";
Vue.use(VueRouter);
let router = new VueRouter({
	hashbang: true,
	history: false,
	saveScrollPosition: true,
	transitionOnLoad: true
});


router.map({
	'/' : {				//首页
		name : 'index',
		component: require('./index.vue')
	},
	"/detail/:id" : {
		name : "detail",
		component : require("./detail.vue")
	}
})

let App = Vue.extend({});


router.start(App, "#appContainer");

//new Vue({
//	el: 'body',
//	components: { App }
//})

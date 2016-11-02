import App from "./App.vue";
import "./index.scss";

import Datepicker from "COMMON/modules/datepicker-mobile/v1";

$(function(){

	var d = new Datepicker();

	setTimeout(function(){
		d.show("2016-10-23")
	},500)



})


new Vue({
	el: 'body',
	components: { App }
})

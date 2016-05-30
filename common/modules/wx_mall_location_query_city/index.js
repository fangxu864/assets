/**
 * Author: huangzhiyang
 * Date: 2016/5/23 15:28
 * Description: ""
 */
var Location = require("../geolocation");
var Store = require("./modules/city.store");
var CityView = require("./modules/city.view");
var Main = Backbone.View.extend({
	initialize : function(){
		new CityView({
			model : new Store(),
			location : Location
		});
	}
});
Main.getStoreCity = function(){
	return Location.getStorageCity();
};
Main.setStoreCity = function(city){
	Location.setStorageCity(city);
}
module.exports = Main;

/**
 * Author: huangzhiyang
 * Date: 2016/11/28 10:59
 * Description: ""
 */
module.exports = PFT.Util.Class({
	__Plugins : {},
	plug : function(id,plugin){
		if(this.__Plugins[id] || !plugin || typeof plugin.pluginInitialize!=="function") return false;
		this.__Plugins[id] = plugin;
		plugin.pluginInitialize(this);
	},
	unPlug : function(id){
		var plugin = this.__Plugins[id];
		if(!id || !plugin) return false;
		if(typeof plugin.pluginDestory=="function"){
			plugin.pluginDestory(this);
		}
		this.__Plugins[id] = null;
		delete this.__Plugins[id];
	},
	getPlugin : function(id){
		if(!id) return null;
		return this.__Plugins[id];
	}
});

var path = require("path");
var Root = require("../../rootDir")();
var webpack = require("webpack");
var ExtractTextPlugin = webpack.ExtractTextPlugin;
module.exports = function(opt){
    opt || (opt={});
    var autoprefixer = require("autoprefixer");
    var precss = require("precss");
    return{
        debug : typeof opt.debug==="boolean" ? opt.debug : false,
        watch : !!opt.watch,
        entry : opt.entry || "",
        output : opt.output || {},
        module : {
            loaders : opt.loaders || []
        },
		vue : {
			loaders : {
				css: ExtractTextPlugin.extract("css"),
				sass: ExtractTextPlugin.extract("css!sass")
			}
		},
        postcss : function(){
			return [precss, autoprefixer];
		},
		plugins : opt.plugins || [],
		externals: [],
		resolve : {
			alias : {
				COMMON : path.join(Root,"./common"),
				CSS_CORE : path.join(Root,"./common/css/base/core"),
				CSS_MIXIN : path.join(Root,"./common/css/base/mixin"),
				COMMON_VUE_COMPONENTS : path.join(Root,"./src-mobile/Components"),
				COMMON_VUE_COMPONENTS_B : path.join(Root,"./src-mobile/B/Components"),
				COMMON_VUE_COMPONENTS_C : path.join(Root,"./src-mobile/C/Components"),
				SERVICE_M : path.join(Root,"./src-mobile/Service"),
				SERVICE : path.join(Root,"./Service"),
				VUX_COMPONENTS : path.join(Root,"./node_modules/vux/src/components"),
				NODE_MODULES : path.join(Root,"./node_modules")
			}
		},
		devtool : "#source-map"
    }
}
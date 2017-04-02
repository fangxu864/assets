<<<<<<< HEAD
=======
var path = require("path");
var RootConfig = require("../../config.js");
var Root = RootConfig.root;
>>>>>>> a6534b3f4e8655b9fb0ac85f47c37ca823962059
module.exports = function(opt){
    opt || (opt={});
    var autoprefixer = require("autoprefixer");
    var precss = require("precss");
    return{
        debug : typeof opt.debug==="boolean" ? opt.debug : false,
<<<<<<< HEAD
=======
        watch : !!opt.watch,
>>>>>>> a6534b3f4e8655b9fb0ac85f47c37ca823962059
        entry : opt.entry || "",
        output : opt.output || {},
        module : {
            loaders : opt.loaders || []
        },
        postcss : function(){
			return [precss, autoprefixer];
		},
		plugins : opt.plugins || [],
		externals: [],
		resolve : {
			alias : {
<<<<<<< HEAD
				
=======
				COMMON : path.join(Root,"./common"),
				CSS_CORE : path.join(Root,"./common/css/base/core"),
				CSS_MIXIN : path.join(Root,"./common/css/base/mixin"),
				COMMON_VUE_COMPONENTS : path.join(Root,"./src_mobile/Components"),
				COMMON_VUE_COMPONENTS_B : path.join(Root,"./src_mobile/B/Components"),
				COMMON_VUE_COMPONENTS_C : path.join(Root,"./src_mobile/C/Components"),
				SERVICE_M : path.join(Root,"./src_mobile/Service"),
				SERVICE : path.join(Root,"./Service"),
				VUX_COMPONENTS : path.join(Root,"./node_modules/vux/src/components"),
				NODE_MODULES : path.join(Root,"./node_modules")
>>>>>>> a6534b3f4e8655b9fb0ac85f47c37ca823962059
			}
		},
		devtool : "#source-map"
    }
}
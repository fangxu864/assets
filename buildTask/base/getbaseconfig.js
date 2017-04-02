module.exports = function(opt){
    opt || (opt={});
    var autoprefixer = require("autoprefixer");
    var precss = require("precss");
    return{
        debug : typeof opt.debug==="boolean" ? opt.debug : false,
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
				
			}
		},
		devtool : "#source-map"
    }
}
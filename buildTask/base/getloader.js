module.exports = function(){
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    var loaders = [{
        test : /\.html|tpl|xtpl$/,
        loader : "html?-minimize"
    },{
        test : /\.css$/,
        loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!postcss")
    },{
        test : /\.less$/,
        loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!postcss!less")
    },{
        test : /\.sass|scss$/,
        loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!postcss!sass")
    },{
        test : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,loader : 'file-loader'
    },{
        test : /\.(png|jpe?g|gif)$/,loader : 'url-loader?limit=8192&name=images/[name]-[hash].[ext]'
    },{
        test: /\.json$/,
        loader: 'json'
    }]


    return loaders;

};

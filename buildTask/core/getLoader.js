module.exports = function(){
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    var loaders = [{
        test : /\.html|tpl|xtpl$/,
        loader : "html?-minimize"
    },{
        test : /\.css$/,
        //loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!autoprefixer")
        loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!postcss")
    },{
        test : /\.sass|scss$/,
        //loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!autoprefixer!sass")
        loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!postcss!sass")
    },{
        test : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,loader : 'file-loader'
    },{
        test : /\.(png|jpe?g|gif)$/,loader : 'url-loader?limit=8192&name=images/[name]-[hash].[ext]'
    },{
        test: /\.vue$/,
        loader: "vue"
    },{
        test: /\.(es|es6)$/,
        loader: 'babel',
        exclude: /node_modules/
    },{
        test: /\.json$/,
        loader: 'json'
    },{
        test: /\.jsx$/,
        loader: 'babel-loader',
        query:{
            plugins:['transform-runtime'],
            presets:['es2015','stage-0','react']
        },
        exclude: /node_modules/
    }]


    return loaders;

};

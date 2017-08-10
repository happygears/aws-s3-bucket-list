const ExtractTextPlugin  = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CleanCSSPlugin     = require('less-plugin-clean-css');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const UglifyJSPlugin     = require('uglifyjs-webpack-plugin');

const webpack = require('webpack');
const path = require('path');

const env = process.env.NODE_ENV || 'dev';
const isDev = env === 'dev';

const extractStyles = new ExtractTextPlugin({
    filename: '[name].css',
    disable: process.env.NODE_ENV === 'dev'
});

const cleanPlugin = new CleanWebpackPlugin(['dist']);
const cleanStyles = new CleanCSSPlugin({advanced: true});
const htmlPlugin = new HtmlWebpackPlugin({
    title: 'Amazon Bucket listing',
    template: 'src/index.html'
});
const copyPlugin = new CopyWebpackPlugin(isDev ? [{from: './src/data.xml'}] : []);
const distPath = path.resolve(__dirname, isDev ? 'dist_dev' : 'dist');


const plugins = [
    cleanPlugin,
    extractStyles,
    htmlPlugin,
    copyPlugin
];

if (isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'aws-bucket-list.min.js',
        path: distPath
    },
    
    devtool: isDev ? 'inline-source-map' : false,
    
    devServer: isDev ? {
        contentBase: distPath,
        hot: true,
        port: 9992
    } : {},

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.less$/,
                use: extractStyles.extract({
                    use: [
                        {loader: 'css-loader'},
                        {loader: 'less-loader', options: {plugins: [cleanStyles]}}
                    ],
                    fallback: 'style-loader'
                })
            }
        ]
    },

    plugins: plugins
};
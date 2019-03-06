const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const webpack = require('webpack');
const path = require('path');


module.exports = (env, argv) => {
	const isDev = argv.mode === 'development';
	const extractStyles = new MiniCssExtractPlugin({
		filename: 'aws-bucket-list.min.css',
		chunkFilename: '[id].css'
	});

	const cleanPlugin = new CleanWebpackPlugin();
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

	return {
		mode: argv.mode,
		entry: './src/index.js',
		output: {
			filename: 'aws-bucket-list.min.js',
			path: distPath
		},

		devServer: {
			contentBase: path.join(__dirname, 'dist'),
			compress: true,
			port: 9777
		},

		devtool: isDev ? 'inline-source-map' : false,

		optimization: {
			minimizer: isDev ? [] : [
				new UglifyJsPlugin({
					cache: true,
					parallel: true,
					sourceMap: false,
					uglifyOptions: {
						compress: {
							drop_console: true,
						}
					}
				}),
				new OptimizeCSSAssetsPlugin({})
			]
		},

		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				},
				{
					test: /\.less$/,
					use: [
						{loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader},
						{loader: 'css-loader'},
						{loader: 'less-loader'}
					]
				}
			]
		},

		plugins: plugins
	};
}
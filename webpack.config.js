const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const pages = [
	{ template: './src/pages/main/index.pug', filename: 'index.html' },
	{ template: './src/pages/about/about.pug', filename: 'about.html' },
	{ template: './src/pages/team/team.pug', filename: 'team.html' },
	{ template: './src/pages/process/process.pug', filename: 'process.html' },
	{ template: './src/pages/pricing/pricing.pug', filename: 'pricing.html' },
	{ template: './src/pages/blog/blog.pug', filename: 'blog.html' },
	{ template: './src/pages/contact/contact.pug', filename: 'contact.html' },
];

const htmlPlugins = pages.map(
	(page) =>
		new HtmlWebpackPlugin({
			template: page.template,
			filename: page.filename,
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true,
			},
		})
);

module.exports = {
	entry: './src/scripts/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: ['pug-loader'],
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},
	optimization: {
		minimizer: [
			new CssMinimizerPlugin(),
			new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: true,
					},
					mangle: true,
				},
			}),
		],
		minimize: true,
	},
	plugins: [
		new CleanWebpackPlugin(),
		new Dotenv(),
		...htmlPlugins,
		new MiniCssExtractPlugin({
			filename: 'styles.css',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'src/images',
					to: 'images',
				},
			],
		}),
	],
	mode: 'production',
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		open: true,
		port: 9000,
		historyApiFallback: {
			rewrites: [
				{ from: /^\/about/, to: '/about.html' },
				{ from: /^\/team/, to: '/team.html' },
				{ from: /^\/process/, to: '/process.html' },
				{ from: /^\/pricing/, to: '/pricing.html' },
				{ from: /^\/blog/, to: '/blog.html' },
				{ from: /^\/contact/, to: '/contact.html' },
				{ from: /./, to: '/index.html' },
			],
		},
	},
};

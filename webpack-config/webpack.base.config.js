/** ****************************************************************************************************
 * File: webpack.base.config.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

import { resolve } from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const
	extractSass      = new ExtractTextPlugin( './css/main.scss' ),
	extractAssests   = new CopyWebpackPlugin( [
		{
			from: './assets/',
			to: '../dist/assets/'
		}
	] ),
	extractHtml      = new HtmlWebpackPlugin( {
		template: 'index.html',
		filename: '../dist/index.html'
	} ),
	includeModules   = new webpack.ProvidePlugin( {
		$: 'jquery',
		jQuery: 'jquery',
		'window.jQuery': 'jquery',
		Popper: [ 'popper.js', 'default' ]
	} );

export default {
	context: resolve( __dirname, '../ui' ),
	entry: {
		app: [ './js/index.js' ]
	},
	output: {
		path: resolve( __dirname, '../dist/' ),
		filename: 'js/bundle.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				use: { loader: 'html-loader' }
			},
			{
				test: /\.css$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader' }
				]
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: function() {
								return [
									require( 'autoprefixer' )
								];
							}
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.js/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.(ttf|woff|woff2|eot)$/,
				use: {
					loader: 'file-loader?publicPath=./&name=fonts/[name].[ext]'
				}
			},
			{
				test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
				use: {
					loader: 'file-loader',
					options: {
						outputPath: 'images/',
						publicPath: './',
						name: '[name].[ext]'
					}
				}
			}
		]
	},
	plugins: [
		extractSass,
		extractAssests,
		extractHtml,
		includeModules
	]
};

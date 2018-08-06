/** ****************************************************************************************************
 * File: webpack.prod.config.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

import webpack from 'webpack';
import Merge from 'webpack-merge';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import CommonConfig from './webpack.base.config';

export default Merge( CommonConfig, {
	plugins: [
		new webpack.LoaderOptionsPlugin( {
			minimize: false,
			debug: false
		} ),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new UglifyJsPlugin( {
			sourceMap: false
		} ),
		new OptimizeCssAssetsPlugin( {
			assetNameRegExp: /\.min\.css$/,
			cssProcessorOptions: { discardComments: { removeAll: true } }
		} )
	]
} );

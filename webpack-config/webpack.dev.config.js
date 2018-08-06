/** ****************************************************************************************************
 * File: webpack.dev.config.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

import { resolve } from 'path';
import Merge from 'webpack-merge';
import CommonConfig from './webpack.base.config';

export default Merge( CommonConfig, {
	context: resolve( __dirname, '../ui' ),
	devServer: {
		compress: true,
		port: 8080,
		publicPath: '/',
		contentBase: './dist'
	}
} );

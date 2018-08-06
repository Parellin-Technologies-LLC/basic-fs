/** ****************************************************************************************************
 * File: webpack.babel.config.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

export default function( env ) {
	return require( `./webpack-config/webpack.${ env }.config.js` );
}

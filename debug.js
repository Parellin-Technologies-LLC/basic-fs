/** ****************************************************************************************************
 * File: debug.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-Jul-2018
 *******************************************************************************************************/
'use strict';

const gonfig = require( 'gonfig' );

module.exports = msg => {
	if( gonfig.log === gonfig.LEVEL.VERBOSE ) {
		console.log( msg );
	}
};

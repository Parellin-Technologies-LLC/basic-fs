/** ****************************************************************************************************
 * File: ping.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jan-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' );

module.exports = ( req, res ) => {
	return Promise.resolve( 'pong' )
		.then( d => res.respond( new Response( 200, d ) ) )
		.then( e => res.respond( new Response( 500, e ) ) );
};

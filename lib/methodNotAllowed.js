/** ****************************************************************************************************
 * File: methodNotAllowed.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jan-2018
 *******************************************************************************************************/
'use strict';

const Response = require( 'http-response-class' );

module.exports = ( req, res ) => {
	return Promise.resolve( `Method: ${req.method} on ${req.path} not allowed` )
		.then( d => res.respond( new Response( 405, d ) ) )
		.catch( e => res.respond( new Response( 500, e ) ) );
};

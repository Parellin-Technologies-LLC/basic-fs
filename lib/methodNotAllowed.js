/** ****************************************************************************************************
 * File: methodNotAllowed.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jan-2018
 *******************************************************************************************************/
'use strict';

const
	{ api }  = require( '../config' ),
	Response = require( 'http-response-class' );

module.exports = ( req, res ) => {
	const
		methods = Object.keys( api ).reduce(
			( r, i ) => {
				api[ i ].method.forEach( m => r.push( m + ' ' + api[ i ].route ) );
				return r;
			}, []
		);

	// DO NOT DELETE: Compliance requirement: RFC2616 10.4.7
	if( res ) {
		res.setHeader( 'Allow', methods.join( ', ' ) );
		res.setHeader( 'Cache-Control', 'max-age=600' );
		res.respond(
			new Response( 405, {
				reason: `Method: ${req.method} on ${req.path} not allowed`,
				allow: methods
			} )
		);
	}
};
/** ****************************************************************************************************
 * File: inspection.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 04-Jan-2018
 *******************************************************************************************************/
'use strict';

const
	{
		timeout,
		maximumURISize,
		maximumHeaderSize,
		maximumPayloadSize,
		minimumHTTPVersion
	}        = require( '../config' ),
	UUIDv4   = require( 'uuid/v4' ),
	Response = require( 'http-response-class' );

function inspection( req, res, next ) {
	res.respond = d => {
		if( !res ) {
			return;
		}

		if( d instanceof Response ) {
			const data = d.toString();
			res.set( {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Max-Age': 1728000,
				'Content-Type': 'application/json; charset=utf-8',
				'Content-Length': data.length,
				RequestID: UUIDv4()
			} );

			res.status( d.statusCode ).send( data );
		} else {
			res.respond( new Response( 400, d ) );
		}

		res = null;
	};

	if( `${req.protocol}://${req.hostname}${req.path}`.length >= maximumURISize ) {
		return res.respond( new Response( 414, 'URI exceeds maximum length' ) );
	} else if( req.rawHeaders.join( '' ).length >= maximumHeaderSize ) {
		return res.respond( new Response( 431 ) );
	} else if( req.headers[ 'content-length' ] >= maximumPayloadSize ) {
		return res.respond( new Response( 413, 'Payload exceeds maximum length' ) );
	} else if( +req.httpVersion < minimumHTTPVersion ) {
		return res.respond( new Response( 505 ) );
	}

	setTimeout(
		() => {
			if( res ) {
				res.respond( new Response( 408 ) );
			}
		}, timeout
	);

	next();
}

module.exports = () => {
	return inspection;
};
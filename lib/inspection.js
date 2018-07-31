/** ****************************************************************************************************
 * @file: inspection.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig     = require( 'gonfig' ),
	config     = gonfig.get( 'server' ),
	UUIDv4     = require( 'uuid/v4' ),
	onFinished = require( 'on-finished' ),
	Response   = require( 'http-response-class' ),
	debug      = require( '../debug' );

function startPacketTime( req ) {
	req.startTime = process.hrtime();
}

function endPacketTime( req ) {
	const
		hrtime = process.hrtime( req.startTime ),
		t      = ( hrtime[ 0 ] * 1e9 ) + hrtime[ 1 ];

	req.endTime = t < 1000 ? `${ t.toFixed( 2 ) } ns` :
		t < 1000000 ? `${ ( t / 1e3 ).toFixed( 2 ) } μs` :
			t < 1000000000 ? `${ ( t / 1e6 ).toFixed( 2 ) } ms` :
				`${ ( t / 1e9 ).toFixed( 2 ) } s`;
}

function decodeHeaders( headers ) {
	Object.keys( headers )
		.forEach( hdr => headers[ hdr ] = decodeURI( headers[ hdr ] ) );
}

function setupResponse( req, res ) {
	res.respond = d => {
		if( !res ) {
			return;
		}

		endPacketTime( req );

		if( d instanceof Response ) {
			const data = JSON.stringify( d.data || '' );

			res
				.set( {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Max-Age': 1728000,
					'Content-Type': 'application/json; charset=utf-8',
					'Content-Length': data.length,
					RequestID: UUIDv4()
				} )
				.status( d.statusCode )
				.send( data );
		} else {
			res.respond( new Response( 400, d ) );
		}

		clearTimeout( res.timer );
		res = null;
	};

	let maximumTime = config.timeout + ( config.speedStandard * req.headers[ 'content-length' ] || 0 );

	if( maximumTime > 0x7FFFFFFF ) {
		maximumTime = 0x7FFFFFFF;
	}

	res.timer = setTimeout(
		() => !res || res.respond( new Response( 408 ) ),
		maximumTime
	);
}

function inspection( req, res, next ) {
	startPacketTime( req );
	decodeHeaders( req.headers );
	setupResponse( req, res );

	if( gonfig.log === gonfig.LEVEL.VERBOSE ) {
		onFinished( res, ( e, d ) => {
			if( res ) {
				clearTimeout( res.timer );
				res = null;
			}

			debug( {
				timestamp: new Date().toISOString(),
				request: `HTTP/${ req.httpVersion } ${ req.method } ${ req.path }`,
				response: `${ d.statusCode } ${ d.statusMessage }`,
				in: +req.headers[ 'content-length' ] || 0,
				out: +d._contentLength || 0,
				time: req.endTime
			} );
		} );
	}

	if( `${ req.protocol }://${ req.hostname }${ req.path }`.length >= config.maximumURISize ) {
		return res.respond( new Response( 414, 'URI exceeds maximum length' ) );
	} else if( req.rawHeaders.join( '' ).length >= config.maximumHeaderSize ) {
		return res.respond( new Response( 431 ) );
	} else if( req.headers[ 'content-length' ] >= config.maximumPayloadSize ) {
		return res.respond( new Response( 413, 'Payload exceeds maximum length' ) );
	} else if( +req.httpVersion < config.minimumHTTPVersion ) {
		return res.respond( new Response( 505 ) );
	}

	next();
}

module.exports = () => {
	return inspection;
};

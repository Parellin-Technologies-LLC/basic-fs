/** ****************************************************************************************************
 * @file: inspection.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig      = require( 'gonfig' ),
	config      = gonfig.get( 'server' ),
	UUIDv4      = require( 'uuid/v4' ),
	onFinished  = require( 'on-finished' ),
	{ resolve } = require( 'path' ),
	{ stat }    = require( './filesys' ),
	Response    = require( 'http-response-class' );

function inspection( req, res, next ) {
	const id = UUIDv4();
	
	const packet = {
		id,
		path: req.path,
		method: req.method,
		params: req.params,
		query: req.query,
		cookies: req.cookies,
		data: req.body || req.data,
		headers: {
			'Access-Control-Expose-Headers': '*',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Max-Age': 1728000,
			'Content-Type': 'application/json; charset=utf-8',
			RequestID: id
		},
		ContentLength: req.headers[ 'content-length' ],
		IP: req.ip
	};
	
	packet.internalTime = 0;
	packet.startTimer   = process.hrtime();
	packet.endTimer     = () => {
		const
			hrtime = process.hrtime( packet.startTimer ),
			t      = ( hrtime[ 0 ] * 1e9 ) + hrtime[ 1 ];
		
		packet.internalTime = t < 1000 ? `${ t.toFixed( 2 ) } ns` :
			t < 1000000 ? `${ ( t / 1e3 ).toFixed( 2 ) } μs` :
				t < 1000000000 ? `${ ( t / 1e6 ).toFixed( 2 ) } ms` :
					`${ ( t / 1e9 ).toFixed( 2 ) } s`;
	};
	
	packet.timer = setTimeout(
		() => ( !res || !packet ) || packet.respond( new Response( 408 ) ),
		config.timeout
	);
	
	packet.respond = d => {
		if( !res || !packet ) {
			return;
		}
		
		packet.endTimer();
		packet.kill();
		
		if( d instanceof Response ) {
			const data = JSON.stringify( d.data || '' );
			
			res
				.set( packet.headers )
				.status( d.statusCode )
				.send( data )
				.end();
		} else {
			return packet.respond( new Response( 400, d ) );
		}
	};
	
	packet.sendFile = async ( fpath, opts ) => {
		packet.kill();
		fpath = resolve( fpath );
		
		const { size }     = await stat( fpath );
		res._contentLength = size;
		
		res.sendFile( fpath, {
			dotfiles: gonfig.get( 'server' ).dotfiles,
			headers: { 'x-timestamp': Date.now(), 'x-sent': true },
			...opts
		} );
	};
	
	packet.kill = () => {
		if( !res || !packet ) {
			return;
		}
		
		clearTimeout( res.timer );
		
		res.locals = req.locals = null;
	};
	
	res.locals = req.locals = packet;
	
	if( gonfig.log === gonfig.LEVEL.VERBOSE ) {
		onFinished( res, ( e, d ) => {
			console.log( {
				timestamp: new Date().toISOString(),
				request: `HTTP/${ req.httpVersion } ${ req.method } ${ req.path }`,
				response: `${ d.statusCode } ${ d.statusMessage }`,
				in: +req.headers[ 'content-length' ] || 0,
				out: +d._contentLength || 0,
				time: packet.internalTime
			} );
			
			if( res ) {
				packet.kill();
				res = null;
			}
		} );
	}
	
	if( `${ req.protocol }://${ req.hostname }${ req.path }`.length >= config.maximumURISize ) {
		return packet.respond( new Response( 414, 'URI exceeds maximum length' ) );
	} else if( req.rawHeaders.join( '' ).length >= config.maximumHeaderSize ) {
		return packet.respond( new Response( 431 ) );
	} else if( req.headers[ 'content-length' ] >= config.maximumPayloadSize ) {
		return packet.respond( new Response( 413, 'Payload exceeds maximum length' ) );
	} else if( +req.httpVersion < config.minimumHTTPVersion ) {
		return packet.respond( new Response( 505 ) );
	}
	
	next();
}

module.exports = () => {
	return inspection;
};

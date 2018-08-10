/** ****************************************************************************************************
 * File: upload.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 20-Feb-2018
 *******************************************************************************************************/
'use strict';

const
	{ createWriteStream } = require( 'fs' ),
	{ Duplex }            = require( 'stream' ),
	{ join, basename }    = require( 'path' ),
	gonfig                = require( 'gonfig' ),
	Response              = require( 'http-response-class' ),
	UUIDv4                = require( 'uuid/v4' ),
	mime                  = require( 'mime-types' );

module.exports = ( req, res ) => {
	const
		ext   = mime.extension( req.headers[ 'content-type' ] || req.headers[ 'Content-Type' ] ),
		fname = req.params[ 0 ] === '/' ? UUIDv4() + ( ext ? `.${ ext }` : '' ) : req.params[ 0 ],
		fpath = join( gonfig.get( 'dataDir' ), fname ),
		save  = createWriteStream( fpath );
	
	if( ext === 'json' ) {
		const stream = new Duplex();
		stream.push( Buffer.from( JSON.stringify( req.body, null, 4 ) ) );
		stream.push( null );
		stream.pipe( save );
	} else {
		req.pipe( save );
	}
	
	save
		.on( 'drain',
			() => req.resume()
		)
		.on( 'error',
			e => res.respond( new Response( e.statusCode || 500, e.stackTrace || e.message || e ) )
		)
		.on( 'finish',
			() => res.respond( new Response( 201, [ `/${ basename( fpath ) }` ] ) )
		);
};

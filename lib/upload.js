/** ****************************************************************************************************
 * File: upload.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 20-Feb-2018
 *******************************************************************************************************/
'use strict';

const
	{ createWriteStream } = require( 'fs' ),
	{ join, basename }    = require( 'path' ),
	config                = require( '../config' ),
	Response              = require( 'http-response-class' ),
	UUIDv4                = require( 'uuid/v4' ),
	mime                  = require( 'mime-types' );

module.exports = ( req, res ) => {
	const
		ext   = mime.extension( req.headers[ 'content-type' ] || req.headers[ 'Content-Type' ] ),
		fname = req.params[ 0 ] === '/' ? UUIDv4() + ( ext ? `.${ext}` : '' ) : req.params[ 0 ],
		fpath = join( config.root, fname ),
		save  = createWriteStream( fpath );
	
	req.pipe( save );
	
	save.on( 'drain', () => req.resume() );
	save.on( 'error', e => res.respond( new Response( e.statusCode || 500, e.stackTrace || e.message || e ) ) );
	req.on( 'error', e => res.respond( new Response( e.statusCode || 500, e.stackTrace || e.message || e ) ) );
	req.on( 'end', () => res.respond( new Response( 201, [ `/${basename( fpath )}` ] ) ) );
};

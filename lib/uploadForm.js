/** ****************************************************************************************************
 * File: uploadFile.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jan-2018
 *******************************************************************************************************/
'use strict';

const
	formidable = require( 'formidable' ),
	Response   = require( 'http-response-class' ),
	UUIDv4     = require( 'uuid/v4' ),
	{
		join,
		extname
	}          = require( 'path' ),
	{
		pathExists,
		saveFile,
		ensureDir,
		moveFile
	}          = require( './filesys' ),
	mime       = require( 'mime-types' );

module.exports = ( req, res ) => {
	const
		form   = new formidable.IncomingForm(),
		method = req.method;
	
	form.maxFileSize = process.config.maximumPayloadSize;
	
	// form.on( 'progress', function( bytesReceived, bytesExpected ) {
	// 	console.log( ( ( bytesReceived / bytesExpected ) * 100 ) );
	// } );
	
	form.parse( req, ( err, fields, files ) => {
		if( err ) {
			return res.respond( new Response( 400, err.stack || err.message || err ) );
		}
		
		const
			validation = [],
			ops        = [];
		
		if( typeof fields === 'object' && !Object.keys( files ).length ) {
			const
				ext   = mime.extension( req.headers[ 'content-type' ] || req.headers[ 'Content-Type' ] ),
				fname = req.params[ 0 ] === '/' ? UUIDv4() + ( ext ? `.${ext}` : '' ) : req.params[ 0 ],
				fpath = join( process.config.root, fname );
			
			validation.push(
				pathExists( fpath )
					.then( exists => {
						if( exists && method === 'PUT' ) {
							return fpath;
						} else if( !exists && method === 'PUT' ) {
							return Promise.reject( { code: 'ENOENT', path: fname } );
						} else if( exists && method === 'POST' ) {
							return Promise.reject( { code: 'EEXIST', path: fname } );
						} else {
							return fpath;
						}
					} )
					.then(
						() => {
							if( extname( fname ) ) {
								if( Object.keys( fields ).length ) {
									ops.push( saveFile( fpath, JSON.stringify( fields ) ).then( () => fname ) );
								} else {
									ops.push( Promise.reject( { code: 'EPERM' } ) );
								}
							} else {
								ops.push( ensureDir( fpath ).then( () => fname ) );
							}
						}
					)
			);
		} else {
			Object.keys( files ).forEach(
				i => {
					const fpath = join( process.config.root, req.params[ 0 ] || '', files[ i ].name || '' );
					
					validation.push(
						pathExists( fpath )
							.then( exists => {
								if( exists && method === 'PUT' ) {
									return fpath;
								} else if( !exists && method === 'PUT' ) {
									return Promise.reject( { code: 'ENOENT', path: fpath } );
								} else if( exists && method === 'POST' ) {
									return Promise.reject( { code: 'EEXIST', path: fpath } );
								} else if( extname( req.params[ 0 ] ) ) {
									return Promise.reject( { code: 'ENOTDIR', path: fpath } );
								} else {
									return fpath;
								}
							} )
							.then( () => ops.push( moveFile( files[ i ].path, fpath ).then( () => fpath ) ) )
					);
				}
			);
		}
		
		return Promise.all( validation )
			.then( () => Promise.all( ops ) )
			.then( d => res.respond( new Response( method === 'PUT' ? 202 : 201, d ) ) )
			.catch( e => {
				if( e.code === 'EPERM' ) {
					res.respond( new Response( 400, 'No data provided' ) );
				} else if( e.code === 'ENOTDIR' ) {
					res.respond( new Response( 400, `${e.path} expected to be directory` ) );
				} else if( e.code === 'ENOENT' ) {
					res.respond( new Response( 404, e.path ) );
				} else if( e.code === 'EEXIST' ) {
					res.respond( new Response( 409, `File or path already exists: ${e.path}` ) );
				} else {
					res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) );
				}
			} );
	} );
};

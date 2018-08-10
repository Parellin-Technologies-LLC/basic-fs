/** ****************************************************************************************************
 * File: getData.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jan-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig   = require( 'gonfig' ),
	Response = require( 'http-response-class' ),
	{ join } = require( 'path' ),
	{
		stat,
		listFiles,
		isFile
	}        = require( '../lib/filesys' );

module.exports = ( req, res ) => {
	const fpath = join( gonfig.get( 'dataDir' ), req.params[ 0 ] || '' );
	
	return isFile( fpath )
		.then(
			d => {
				if( d ) {
					return res.sendFile( fpath, {
						dotfiles: gonfig.get( 'server' ).dotfiles,
						headers: { 'x-timestamp': Date.now(), 'x-sent': true }
					} );
				} else {
					return listFiles( fpath )
						.then(
							t => t.map(
								fname => stat( join( fpath, fname ) )
									.then( d => ( {
										filepath: fpath,
										filename: fname,
										size: d.size,
										modified: d.mtime,
										created: d.birthtime,
										isDirectory: d.isDirectory()
									} ) )
							)
						)
						.then( t => Promise.all( t ) )
						.then( t => res.respond( new Response( 200, t ) ) );
				}
			}
		)
		.catch(
			e => e instanceof Response ?
				res.respond( e ) :
				e.code === 'ENOENT' ?
					res.respond( new Response( 404, req.params[ 0 ] ) ) :
					res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) )
		);
};

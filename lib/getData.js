/** ****************************************************************************************************
 * File: getData.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jan-2018
 *******************************************************************************************************/
'use strict';

const
	config   = require( '../config' ),
	Response = require( 'http-response-class' ),
	{ join } = require( 'path' ),
	{
		isDirectory,
		listFiles,
		isFile
	}        = require( './filesys' );

module.exports = ( req, res ) => {
	const
		fpath = join( config.root, req.params[ 0 ] || '' );
	
	return isFile( fpath )
		.then(
			d => {
				if( d ) {
					res.sendFile( fpath, {
						dotfiles: config.dotfiles,
						headers: { 'x-timestamp': Date.now(), 'x-sent': true }
					} );
				} else {
					listFiles( fpath )
						.then(
							t => t.map(
								item => isDirectory( join( fpath, item ) ).then( t => t ? `${item}/` : item )
							)
						)
						.then( t => Promise.all( t ) )
						.then( t => res.respond( new Response( 200, t ) ) );
				}
			}
		)
		.catch(
			e => {
				if( e.code === 'ENOENT' ) {
					res.respond( new Response( 404, req.params[ 0 ] ) );
				} else {
					res.respond( new Response( 500, e ) );
				}
			}
		);
};

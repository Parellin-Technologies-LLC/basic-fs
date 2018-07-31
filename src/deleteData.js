/** ****************************************************************************************************
 * File: deleteData.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jan-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig   = require( 'gonfig' ),
	Response = require( 'http-response-class' ),
	{ join } = require( 'path' ),
	{
		remove,
		emptyDir,
		pathExists
	}        = require( '../lib/filesys' );

module.exports = ( req, res ) => {
	const
		fpath = join( gonfig.get( 'dataDir' ), req.params[ 0 ] || '' );

	return pathExists( fpath )
		.then(
			d => d && fpath === gonfig.get( 'dataDir' ) ?
				emptyDir( fpath ) : d ? remove( fpath ) :
					Promise.reject( { code: 'ENOENT' } )
		)
		.then( () => res.respond( new Response( 200, [ req.params[ 0 ] ] || 'data directory emptied' ) ) )
		.catch(
			e => e.code === 'ENOENT' ?
				res.respond( new Response( 404, [ req.params[ 0 ] ] ) ) :
				res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) )
		);
};

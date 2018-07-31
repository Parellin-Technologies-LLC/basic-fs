/** ****************************************************************************************************
 * File: index.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 08-Jan-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig      = require( 'gonfig' ),
	{ resolve } = require( 'path' );

gonfig
	.setLogLevel( gonfig.LEVEL.VERBOSE )
	.setEnvironment( process.env.NODE_ENV || gonfig.ENV.DEBUG )
	.load( 'server', 'config/server.json' )
	.load( 'api', 'config/api.js' )
	.set( 'dataDir', resolve( './data' ) )
	.refresh();

( async () => {
	await require( './init' )();

	require( './server' )
		.initialize()
		.start();
} )();

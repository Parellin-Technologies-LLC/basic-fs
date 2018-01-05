/** ****************************************************************************************************
 * File: index.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 11-Jul-2017
 *******************************************************************************************************/
'use strict';

const
	config           = require( './config' ),
	express          = require( 'express' ),
	op               = require( 'openport' ),
	{ ensureDir }    = require( './lib/filesys' ),
	uploadData       = require( './lib/uploadData' ),
	getData          = require( './lib/getData' ),
	deleteData       = require( './lib/deleteData' ),
	home             = require( './lib/home' ),
	ping             = require( './lib/ping' ),
	kill             = require( './lib/kill' ),
	docs             = require( './lib/docs' ),
	methodNotAllowed = require( './lib/methodNotAllowed' ),
	inspection       = require( './lib/inspection' ),
	lanIP            = require( './lib/lanIP' ),
	app              = express();

app.use( inspection() );

app.get( config.api.data.route, getData );
app.post( config.api.data.route, uploadData );
app.put( config.api.data.route, uploadData );
app.delete( config.api.data.route, deleteData );
app.all( config.api.home.route, home );
app.all( config.api.ping.route, ping );
app.all( config.api.kill.route, kill );
app.all( config.api.docs.route, docs );
app.all( '*', methodNotAllowed );

ensureDir( config.dataDirectory )
	.then(
		() => new Promise(
			( res, rej ) => op.find(
				{ startingPort: config.port, endingPort: config.port + 50 },
				( e, p ) => e ? rej( e ) : res( p )
			)
		)
	)
	.then(
		port => app.listen(
			port,
			() => console.log( `BasicFS v${config.version} running on ${lanIP}:${port}` )
		)
	);

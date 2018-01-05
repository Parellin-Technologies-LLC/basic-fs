'use strict';

const
	config        = require( './config' ),
	path          = require( 'path' ),
	Response      = require( 'http-response-class' ),
	express       = require( 'express' ),
	op            = require( 'openport' ),
	{ ensureDir } = require( './lib/fswrapper' ),
	uploadData    = require( './lib/uploadData' ),
	getData       = require( './lib/getData' ),
	deleteData    = require( './lib/deleteData' ),
	ping          = require( './lib/ping' ),
	kill          = require( './lib/kill' ),
	inspection    = require( './lib/inspection' ),
	lanIP         = require( './lib/lanIP' ),
	app           = express(),
	find          = opt => new Promise(
		( res, rej ) => op.find( opt,
			( e, p ) => e ? rej( e ) : res( p )
		)
	);

config.root = path.join( config.cwd, config.dataDirectory );

app.use( inspection() );

app.all( config.ping, ping );
app.all( config.kill, kill );
app.get( config.data, getData );
app.post( config.data, uploadData );

app.delete( config.data, deleteData );

app.all( config.docs,
	( req, res ) => {
		res.setHeader( 'Content-Type', 'application/json' );
		res.send( new Response( 200, config ).toString() );
	}
);

app.all( '*', ( req, res ) => catchAll( res ) );


ensureDir( config.dataDirectory )
	.then(
		() => find( { startingPort: config.port, endingPort: config.port + 50 } )
	)
	.then(
		port => app.listen(
			port,
			() => console.log( `BasicFS v${config.version} running on ${lanIP}:${port}` )
		)
	);

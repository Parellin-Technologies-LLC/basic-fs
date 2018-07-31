/** ****************************************************************************************************
 * File: index.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 11-Jul-2017
 *******************************************************************************************************/
'use strict';

const
	gonfig      = require( 'gonfig' ),
	http        = require( 'http' ),
	express     = require( 'express' ),
	bodyParser  = require( 'body-parser' ),
	{ resolve } = require( 'path' ),
	debug       = require( './debug' );

let isClosed = false;

class BasicFS
{
	constructor()
	{

	}

	hookRoute( item )
	{
		item.exec = require( resolve( item.exec ) );

		this.express[ item.method.toLowerCase() ](
			item.route,
			( req, res ) => res ?
				item.exec( req, res ) :
				res.status( 500 ).send( 'unknown' )
		);

		return item;
	}

	expressInitialize()
	{
		this.express = express();

		this.express.disable( 'x-powered-by' );
		this.express.use( bodyParser.raw( { limit: '5gb' } ) );
		this.express.use( bodyParser.json() );
		this.express.use( require( './lib/inspection' )() );

		gonfig.set( 'api', gonfig.get( 'api' ).map( item => this.hookRoute( item ) ) );

		this.express.use( require( './lib/captureErrors' )() );
	}

	initialize()
	{
		this.expressInitialize();

		process
			.on( 'uncaughtException', err => debug( gonfig.getErrorReport( err ) ) )
			.on( 'unhandledRejection', err => debug( gonfig.getErrorReport( err ) ) )
			.on( 'SIGINT', () => {
				debug( 'Received SIGINT, graceful shutdown...' );
				this.shutdown( 0 );
			} )
			.on( 'exit', code => {
				debug( `Received exit with code ${ code }, graceful shutdown...` );
				this.shutdown( code );
			} );

		return this;
	}

	start()
	{
		return new Promise(
			res => {
				this.server = http.createServer( this.express );

				this.server.listen(
					gonfig.get( 'server' ).port,
					() => {
						debug(
							`${ gonfig.get( 'name' ) } ` +
							`v${ gonfig.get( 'version' ) } ` +
							`running on ${ gonfig.get( 'lanip' ) }:${ gonfig.get( 'server' ).port }`
						);

						res( this );
					}
				);
			}
		);
	}

	shutdown( code = 0 )
	{
		if( this.server ) {
			this.server.close();
		}

		if( isClosed ) {
			debug( 'Shutdown after SIGINT, forced shutdown...' );
			process.exit( 0 );
		}

		isClosed = true;

		debug( `server exiting with code: ${ code }` );
		process.exit( code );
	}
}

module.exports = new BasicFS();

// basicauth     = require( 'express-basic-auth' ),
// if( process.config.authentication === 'basicauth' ) {
// 	const { challenge, realm } = process.config;
//
// 	this.express.use( basicauth( {
// 		authorizeAsync: true,
// 		authorizer: this.authorizer,
// 		challenge,
// 		realm
// 	} ) );
// }

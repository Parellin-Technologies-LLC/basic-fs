/** ****************************************************************************************************
 * File: index.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 11-Jul-2017
 *******************************************************************************************************/
'use strict';

const
	http          = require( 'http' ),
	express       = require( 'express' ),
	basicauth     = require( 'express-basic-auth' ),
	{ resolve }   = require( 'path' ),
	{ ensureDir } = require( './lib/filesys' ),
	{ bind }      = require( './lib/kill' ),
	lanIP         = require( './lib/lanIP' ),
	logging       = process.env.SILENT === 'false';

let isClosed = false;

class BasicFS
{
	constructor( config )
	{
		process.config = config;
		bind( this );
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
	
	authorizer( username, password, cb )
	{
		const challenge = process.config.users[ username ];
		
		return cb( null, challenge && challenge === password );
	}
	
	expressInitialize()
	{
		this.express = express();
		this.express.disable( 'x-powered-by' );
		
		this.express.use( require( './lib/inspection' )() );
		
		if( process.config.authentication === 'basicauth' ) {
			const { challenge, realm } = process.config;
			
			this.express.use( basicauth( {
				authorizeAsync: true,
				authorizer: this.authorizer,
				challenge,
				realm
			} ) );
		}
		
		process.config.api = process.config.api
			.map( item => this.hookRoute( item ) );
	}
	
	initialize()
	{
		this.expressInitialize();
		
		return new Promise(
			( res, rej ) => {
				process
					.on( 'SIGINT', () => {
						if( logging ) {
							console.log( 'Received SIGINT, graceful shutdown...' );
						}
						
						this.shutdown( 0 );
					} )
					.on( 'uncaughtException', err => {
						if( logging ) {
							console.log( 'global status: ' + ( err.status || 'no status' ) + '\n' + JSON.stringify( err.message ) + '\n' + JSON.stringify( err.stack ) );
							console.log( err );
						}
					} )
					.on( 'unhandledRejection', err => {
						if( logging ) {
							console.log( err );
						}
					} )
					.on( 'exit', code => {
						if( logging ) {
							console.log( `Received exit with code ${code}, graceful shutdown...` );
						}
						
						this.shutdown( code );
					} );
				
				ensureDir( process.config.data )
					.then( () => this.port = process.config.port )
					.then( () => res( this ) )
					.catch( rej );
			}
		);
	}
	
	start()
	{
		return new Promise(
			res => {
				this.server = http.createServer( this.express );
				
				this.server.listen( process.config.port, () => {
					if( logging ) {
						console.log( `BasicFS v${process.config.version} running on ${lanIP}:${process.config.port}` );
						console.log( `  Serving data directory: ${resolve( process.config.data )}` );
					}
					
					res( this );
				} );
			}
		);
	}
	
	shutdown( code )
	{
		if( !logging ) {
			this.server.close();
			return;
		}
		
		code = code || 0;
		
		if( this.server ) {
			this.server.close();
		}
		
		if( isClosed ) {
			if( logging ) {
				console.log( 'Shutdown after SIGINT, forced shutdown...' );
			}
			process.exit( 0 );
		}
		
		isClosed = true;
		
		if( logging ) {
			console.log( 'server exiting with code:', code );
		}
		
		process.exit( code );
	}
}

module.exports = ( config = require( './config' ) ) => new BasicFS( config );

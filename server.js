/** ****************************************************************************************************
 * File: index.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 11-Jul-2017
 *******************************************************************************************************/
'use strict';

const
    config           = require( './config' ),
    http             = require( 'http' ),
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
    lanIP            = require( './lib/lanIP' ),
    logging          = [ 'development', 'dev', 'production', 'prod' ].indexOf( process.env.NODE_ENV ) !== -1;

let isClosed = false;

class BasicFS
{
    constructor()
    {
        this.expressInitialize();
    }
    
    expressInitialize()
    {
        this.express = express();
        this.express.disable( 'x-powered-by' );
    }
    
    initialize()
    {
        kill.bind( this );
        
        this.express.use( require( './lib/inspection' )() );
        this.express.get( config.api.data.route, getData );
        this.express.post( config.api.data.route, uploadData );
        this.express.put( config.api.data.route, uploadData );
        this.express.delete( config.api.data.route, deleteData );
        this.express.all( config.api.home.route, home );
        this.express.all( config.api.ping.route, ping );
        this.express.all( config.api.kill.route, kill );
        this.express.all( config.api.docs.route, docs );
        this.express.all( '*', methodNotAllowed );
        
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
                    .on( 'unhandledRejection', error => {
                        if( logging ) {
                            console.log( error );
                        }
                    } )
                    .on( 'exit', code => {
                        if( logging ) {
                            console.log( `Received exit with code ${code}, graceful shutdown...` );
                        }
                        this.shutdown( code );
                    } );
                
                ensureDir( config.dataDirectory )
                    .then(
                        () => new Promise(
                            ( res, rej ) => op.find(
                                { startingPort: config.port, endingPort: config.port + 50 },
                                ( e, p ) => e ? rej( e ) : res( p )
                            )
                        )
                    )
                    .then( port => this.port = port )
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
                
                this.server.listen( config.port, () => {
                        if( logging ) {
                            console.log( `BasicFS v${config.version} running on ${lanIP}:${config.port}` );
                        }
                        res( this );
                    }
                );
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

module.exports = () => new BasicFS();
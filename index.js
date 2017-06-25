'use strict';

const
    config     = require( './config' ),
    {
        getFile,
        listFiles,
        saveFile,
        deleteFile,
    }          = require( './lib/fswrapper' ),
    {
        ensureDir
    }          = require( 'fs-extra' ),
    path       = require( 'path' ),
    crypto     = require( 'crypto' ),
    Response   = require( './lib/Response' ),
    express    = require( 'express' ),
    formidable = require( 'formidable' ),
    op         = require( 'openport' ),
    lanIP      = require( './lib/lanIP' ),
    app        = express(),
    catchAll   = res => {
        res.setHeader( 'Content-Type', 'application/json' );
        res.json( config );
    },
    find       = opt => new Promise(
        ( res, rej ) => op.find( opt,
            ( e, p ) => e ? rej( e ) : res( p )
        )
    );

app.all( config.ping, ( req, res ) => {
    res.setHeader( 'Content-Type', 'application/json' );
    res.json( new Response( 200, 'pong' ) );
} );

app.all( config.kill, ( req, res ) => ( res.send( 'closed server' ), process.exit() ) );

app.all( config.path, ( req, res ) => {
    res.setHeader( 'Content-Type', 'application/json' );

    const fpath = path.join( config.cwd, config.publicDirectory );
    let statusCode = 0, message = '';

    listFiles( fpath )
        .then( r => ( statusCode = 200, message = r ) )
        .catch( e => ( statusCode = 500, message = e ) )
        .then( () => new Response( statusCode, message ) )
        .then( r => ( res.status( r.statusCode ), r ) )
        .then( r => res.json( r ) )
        .catch( console.error );
} );

app.get( config.proxy, ( req, res ) => {
    const
        options = {
            root: path.join( config.cwd, config.publicDirectory ),
            dotfiles: 'allow',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        },
        fname   = req.params.name;

    res.sendFile( fname, options );
} );

app.post( config.proxy, ( req, res ) => {
    const form = new formidable.IncomingForm();
    let statusCode = 0, message = '';

    form.parse( req, ( err, fields, files ) => {
        if( typeof fields === 'object' && !Object.keys( files ).length ) {
            const
                fname = req.params.name || `${crypto.randomBytes( 32 ).toString( 'hex' )}.json`,
                fpath = path.join( config.cwd, 'public', fname );

            saveFile( fpath, JSON.stringify( fields ) )
                .then( () => ( statusCode = 200, message = fpath ) )
                .catch( e => ( statusCode = 500, message = e ) )
                .then( () => new Response( statusCode, message ) )
                .then( r => ( res.status( r.statusCode ), r ) )
                .then( r => res.json( r ) )
                .catch( console.error );
        } else {
            console.log( fields, files );

            const
                ops = Object.keys( files ).reduce(
                    ( r, i ) => {
                        const fname = path.join( config.cwd, config.publicDirectory, i );
                        r.push(
                            getFile( files[ i ].path )
                                .then( data => saveFile( fname, data ) )
                                .then( () => ( {
                                    delete: files[ i ].path,
                                    save: fname
                                } ) )
                                .catch( e => e )
                        );
                        return r;
                    }, []
                );

            Promise.all( ops )
                .then(
                    items => items.reduce(
                        ( r, i ) => (
                            r.push(
                                deleteFile( i.delete )
                                    .then( () => i.save )
                                    .catch( () => false )
                            ),
                                r
                        ), []
                    )
                )
                .then( items => Promise.all( items ) )
                .then(
                    items => items.indexOf( false ) === -1 ? items : false
                )
                .then(
                    r => r ?
                        ( statusCode = 201, message = r ) :
                        ( statusCode = 500, message = 'Error' )
                )
                .catch( e => ( statusCode = 500, message = e ) )
                .then( () => new Response( statusCode, message ) )
                .then( r => ( res.status( r.statusCode ), r ) )
                .then( r => res.json( r ) )
                .catch( console.error );
        }
    } );
} );

app.delete( config.proxy, ( req, res ) => {
    const fname = path.join( config.cwd, 'public', req.params.name );
    let statusCode = 0, message = '';

    deleteFile( fname )
        .then( () => ( statusCode = 200, message = 'Deleted' ) )
        .catch(
            e => e.code === 'ENOENT' ?
                ( statusCode = 404, message = 'File Not Found' ) :
                ( statusCode = 500, message = e )
        )
        .then( () => new Response( statusCode, message ) )
        .then( r => ( res.status( r.statusCode ), r ) )
        .then( r => res.json( r ) )
        .catch( console.error );
} );

app.all( config.docs, ( req, res ) => catchAll( res ) );
app.all( '*', ( req, res ) => catchAll( res ) );


ensureDir( config.publicDirectory )
    .then(
        () => find( { startingPort: config.port, endingPort: config.port + 50 } )
    )
    .then(
        port => app.listen(
            port,
            () => console.log( `BasicFS v${config.version} running on ${lanIP}:${port}` )
        )
    );

/** ****************************************************************************************************
 * File: uploadFile.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jan-2018
 *******************************************************************************************************/
'use strict';

const
    config     = require( '../config' ),
    formidable = require( 'formidable' ),
    Response   = require( 'http-response-class' ),
    UUIDv4     = require( 'uuid/v4' ),
    {
        join,
        extname
    }          = require( 'path' ),
    {
        pathExists,
        saveFile,
        ensureDir,
        moveFile
    }          = require( './filesys' );

module.exports = ( req, res ) => {
    const
        form   = new formidable.IncomingForm(),
        method = req.method;

    form.parse( req, ( err, fields, files ) => {
        if( err ) {
            console.error( err );
        }

        const
            validation = [],
            ops        = [];

        if( typeof fields === 'object' && !Object.keys( files ).length ) {
            const
                fname = req.params[ 0 ] || `${UUIDv4()}.json`,
                fpath = join( config.root, fname );

            validation.push(
                pathExists( fpath )
                    .then( exists => {
                        if( exists && method === 'PUT' ) {
                            return fpath;
                        } else if( !exists && method === 'PUT' ) {
                            return Promise.reject( { code: 'ENOENT' } );
                        } else if( exists && method === 'POST' ) {
                            return Promise.reject( { code: 'EEXIST' } );
                        } else {
                            return fpath;
                        }
                    } )
                    .then(
                        () => {
                            if( extname( fname ) ) {
                                if( Object.keys( fields ).length ) {
                                    ops.push( saveFile( fpath, JSON.stringify( fields ) ).then( () => fname ) );
                                } else {
                                    ops.push( Promise.reject( { code: 'EPERM' } ) );
                                }
                            } else {
                                ops.push( ensureDir( fpath ).then( () => fname ) );
                            }
                        }
                    )
            );
        } else {
            Object.keys( files ).forEach(
                i => {
                    const fpath = join( config.root, req.params[ 0 ] || '', files[ i ].name || '' );

                    validation.push(
                        pathExists( fpath )
                            .then( exists => {
                                if( exists && method === 'PUT' ) {
                                    return fpath;
                                } else if( !exists && method === 'PUT' ) {
                                    return Promise.reject( { code: 'ENOENT' } );
                                } else if( exists && method === 'POST' ) {
                                    return Promise.reject( { code: 'EEXIST' } );
                                } else if( extname( req.params[ 0 ] ) ) {
                                    return Promise.reject( { code: 'ENOTDIR' } );
                                } else {
                                    return fpath;
                                }
                            } )
                            .then( () => ops.push( moveFile( files[ i ].path, fpath ).then( () => fpath ) ) )
                    );
                }
            );
        }

        Promise.all( validation )
            .then( () => Promise.all( ops ) )
            .then( d => res.respond( new Response( method === 'PUT' ? 202 : 201, d ) ) )
            .catch( e => {
                if( e.code === 'EPERM' ) {
                    res.respond( new Response( 400, 'No data provided' ) );
                } else if( e.code === 'ENOTDIR' ) {
                    res.respond( new Response( 400, `${req.params[ 0 ]} expected to be directory` ) );
                } else if( e.code === 'ENOENT' ) {
                    res.respond( new Response( 404, req.params[ 0 ] ) );
                } else if( e.code === 'EEXIST' ) {
                    res.respond( new Response( 409, `File or path already exists: ${req.params[ 0 ]}` ) );
                } else {
                    res.respond( new Response( 500, e ) );
                }
            } );
    } );
};

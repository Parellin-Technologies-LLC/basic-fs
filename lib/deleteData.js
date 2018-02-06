/** ****************************************************************************************************
 * File: deleteData.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jan-2018
 *******************************************************************************************************/
'use strict';

const
    config   = require( '../config' ),
    Response = require( 'http-response-class' ),
    { join } = require( 'path' ),
    {
        remove,
        emptyDir,
        pathExists
    }        = require( './filesys' );

module.exports = ( req, res ) => {
    const
        fpath = join( config.root, req.params[ 0 ] || '' );

    pathExists( fpath )
        .then(
            d => {
                if( d && fpath === config.root ) {
                    return emptyDir( fpath );
                } else if( d ) {
                    return remove( fpath );
                } else {
                    return Promise.reject( { code: 'ENOENT' } );
                }
            }
        )
        .then( () => res.respond( new Response( 200, req.params[ 0 ] || 'Data directory emptied' ) ) )
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

'use strict';

const
    fs = require( 'fs' );

module.exports = {
    getFile: fname => new Promise(
        ( res, rej ) =>
            fs.readFile( fname,
                ( e, d ) => e ? rej( e ) : res( d )
            )
    ),
    listFiles: fpath => new Promise(
        ( res, rej ) =>
            fs.readdir( fpath,
                ( e, d ) => e ? rej( e ) : res( d )
            )
    ),
    saveFile: ( fname, data ) => new Promise(
        ( res, rej ) =>
            fs.writeFile( fname, data,
                ( e, d ) => e ? rej( e ) : res( d )
            )
    ),
    deleteFile: fname => new Promise(
        ( res, rej ) =>
            fs.unlink( fname,
                ( e, d ) => e ? rej( e ) : res( d )
            )
    )
};
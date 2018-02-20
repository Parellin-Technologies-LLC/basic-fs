/** ****************************************************************************************************
 * File: index.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 08-Jan-2018
 *******************************************************************************************************/
'use strict';

const { name, version } = require( './package' );

( function() {
    if( process.argv.includes( '-v' ) || process.argv.includes( '--version' ) ) {
        return console.log( `v${version}` );
    } else if( process.argv.includes( '-h' ) || process.argv.includes( '--help' ) ) {
        return console.log( [
            `Welcome to ${name}`,
            `    Version: v${version}`,
            '',
            'A very simple internal file system API for any computer.',
            'Builds out compiled versions to MacOS, Linux, and Windows.',
            '',
            'Usage:  basic-fs [options]',
            '    basic-fs -d ~/data',
            '',
            '    -h, --help         help menu',
            `    -v, --version      print ${name} version`,
            `    -s, --silent       run ${name} in silent mode`,
            '    -d, --data [dir]   set the data directory to save files to',
            `    -p, --port [port]  set the port to start ${name} on`
        ].join( '\n' ) );
    }

    function parseArguments( args, defaults = {} ) {
        args = args.splice( 2 );

        return args.reduce(
            ( r, item, i ) => {
                if( /(-s)|(--silent)/i.test( item ) ) {
                    r.SILENT = true;
                } else if( /(-d)|(--data)/i.test( item ) ) {
                    const arg = args[ i + 1 ];

                    if( !arg ) {
                        console.error( 'Argument Error: -d, --data option must be specified' );
                        process.exit( 1 );
                    } else {
                        r.DATA = arg;
                    }
                } else if( /(-p)|(--port)/i.test( item ) ) {
                    const arg = +args[ i + 1 ];

                    if( !arg ) {
                        console.error( 'Argument Error: -p, --port option must be a number' );
                        process.exit( 1 );
                    } else {
                        r.PORT = arg;
                    }
                }

                return r;
            }, defaults
        );
    }

    const
        args = parseArguments( process.argv, {
            SILENT: false,
            DATA: 'data/',
            PORT: 3000
        } );

    Object.keys( args )
        .forEach(
            k => process.env[ k ] = process.env[ k ] || args[ k ]
        );

    require( './server' )()
        .initialize()
        .then( inst => inst.start() );
} )();

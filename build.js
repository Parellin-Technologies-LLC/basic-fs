/** ****************************************************************************************************
 * File: build.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 06-Feb-2018
 *******************************************************************************************************/
'use strict';

const
    { name, main } = require( './package.json' ),
    { exec } = require( 'pkg' );

exec( [ main, '--target', 'host', '--output', name, '--build' ] )
    .then( console.log )
    .then( () => console.log( 'Build Complete' ) )
    .catch( console.error );


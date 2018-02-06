/** ****************************************************************************************************
 * File: build.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 06-Feb-2018
 *******************************************************************************************************/
'use strict';

const
    { name } = require( './package.json' ),
    { exec } = require( 'pkg' );

async function build() {
    await exec( [ 'index.js', '--target', 'host', '--output', name, '--build' ] );
}

build();

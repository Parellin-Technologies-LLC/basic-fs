/** ****************************************************************************************************
 * File: home.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jan-2018
 *******************************************************************************************************/
'use strict';

const
    { name, version } = require( '../config' ),
    Response          = require( 'http-response-class' );

module.exports = ( req, res ) => res.respond( new Response( 200, { name, version } ) );

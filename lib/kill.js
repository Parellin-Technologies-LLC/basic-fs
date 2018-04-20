/** ****************************************************************************************************
 * File: kill.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jan-2018
 *******************************************************************************************************/
'use strict';

const Response = require( 'http-response-class' );
let server;

module.exports = ( req, res ) => {
	res.respond( new Response( 200, 'server terminated' ) );
	server.shutdown( 0 );
};

module.exports.bind = s => {
	server = s;
};

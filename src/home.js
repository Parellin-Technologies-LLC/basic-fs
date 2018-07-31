/** ****************************************************************************************************
 * File: home.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jan-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig   = require( 'gonfig' ),
	Response = require( 'http-response-class' );

module.exports = ( req, res ) => {
	return Promise.resolve( gonfig.get( gonfig.sympkg ) )
		.then( ( { name, version } ) => res.respond( new Response( 200, { name, version } ) ) )
		.catch( e => res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) ) );
};

/** ****************************************************************************************************
 * File: ExternalAPI.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	request  = require( 'request' ),
	Response = require( 'http-response-class' );

class ExternalAPI
{
	/**
	 * constructor
	 * @param {string} [protocol=http] - protocol
	 * @param {string} [hostname=127.0.0.1] - hostname
	 * @param {number} [port=23000] - port
	 */
	constructor( protocol = 'http', hostname = '127.0.0.1', port = 23000 )
	{
		protocol = protocol.replace( ':', '' );
		protocol = protocol.replace( '//', '' );
		this.url = new URL( `${ protocol }://${ hostname }:${ port }` );
	}
	
	request( opts = {} )
	{
		return new Promise(
			( res, rej ) => {
				opts.uri  = new URL( opts.uri || opts.path, this.url );
				opts.json = opts.json === false ? false : opts.json || true;
				
				request( opts,
					( e, status, data ) => e ?
						rej( e ) :
						res( new Response( status.statusCode, data ) )
				);
			}
		);
	}
	
	rawRequest( opts = {} )
	{
		opts.uri  = new URL( opts.uri || opts.path, this.url );
		opts.json = opts.json === false ? false : opts.json || true;
		
		return request( opts );
	}
}

module.exports = ExternalAPI;

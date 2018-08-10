/** ****************************************************************************************************
 * File: BasicFSAPI.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

import ExternalAPI from './ExternalAPI';

class BasicFSAPI extends ExternalAPI
{
	constructor( args )
	{
		super( args );
	}

	listFiles( url = '/data/' )
	{
		console.log( `List Files: ${ url }` );
		return this.request( { url } );
	}
}

module.exports = new BasicFSAPI(
	window.location.protocol,
	window.location.hostname,
	window.location.port
);

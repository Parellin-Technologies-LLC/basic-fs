/** ****************************************************************************************************
 * File: Page.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

import ko from 'knockout';

export default class Page
{
	constructor( id, html, authorizationRequired = false )
	{
		this.id                    = id.startsWith( '#' ) ? id : `#${ id }`;
		this.html                  = `<div id="${ id }" class="container">${ html }</div>`;
		this.authorizationRequired = authorizationRequired;
	}
	
	preRender()
	{
		return Promise.resolve( this );
	}
	
	postRender()
	{
		return Promise.resolve( this );
	}
	
	bind()
	{
		const binding = $( this.id )[ 0 ];
		
		if( binding ) {
			ko.applyBindings( this, binding );
		} else {
			console.warn( `Cannot find binding element ${ binding }` );
		}
		
		return Promise.resolve( this );
	}
}

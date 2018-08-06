/** ****************************************************************************************************
 * File: Container.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

import { mainContainer, title } from '../variables';

import html from '../../html/container.html';
import { showAlert } from '../components/statusBar';

class Container
{
	constructor()
	{
		$( 'body' ).append( html );
		this.ele = $( mainContainer );
		
		this.pages        = new Map();
		this._currentPage = '';
		this.history      = [];
		
		this.title = title;
	}
	
	initialize()
	{
		window.addEventListener( 'popstate', () => this.changePage() );
	}
	
	id( id )
	{
		if( id !== '' + id ) {
			id = location.hash;
		}
		
		id = id || 'home';
		id = id.replace( /#/g, '' );
		
		return id;
	}
	
	get currentPage()
	{
		return this._currentPage;
	}
	
	set currentPage( id )
	{
		id = this.id( id );
		
		this._currentPage = `#${ id }`;
		location.hash     = this._currentPage;
		
		this.history.push( this._currentPage );
		return this._currentPage;
	}
	
	changePage( id )
	{
		if( id !== '' + id ) {
			id = location.hash;
		}
		
		id = this.id( id );
		
		return this.render( id );
	}
	
	hasPage( id )
	{
		return this.pages.has( id );
	}
	
	addPage( id, page )
	{
		this.pages.set( id, page );
		return this;
	}
	
	getPage( id )
	{
		if( this.hasPage( id ) ) {
			return this.pages.get( id );
		}
		
		return this;
	}
	
	pageRequiresAuthorization( id )
	{
		id = this.id( id );
		return this.getPage( id ).authorizationRequired || false;
	}
	
	render( id )
	{
		if( this.currentPage === `#${ id }` ) {
			return this;
		}
		
		if( !this.hasPage( id ) ) {
			showAlert( `Page "${ id }" does not exist` );
			return this;
		} else {
			this.currentPage = id;
			
			return Promise.resolve( this.pages.get( id ) )
				.then( d => d.preRender() )
				.then( d => ( this.ele.html( d.html ), d ) )
				.then( d => d.bind() )
				.then( d => d.postRender() )
				.then( () => $( document ).scrollTop() )
				.catch( showAlert );
		}
	}
}

export default new Container();

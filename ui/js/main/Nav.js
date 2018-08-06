/** ****************************************************************************************************
 * File: Nav.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

import { title, mainNav } from '../variables';

import html from '../../html/navbar.html';
import ko from 'knockout';
import Container from './Container';

// import signOut from '../signOut';

class Nav
{
	constructor()
	{
		$( 'body' ).append( html );
		this.ele = $( mainNav );
		
		this.authenticated = ko.observable( false );
		
		this.bind();
	}
	
	visibleIfUnauthenticated()
	{
		return ko.pureComputed( () => !this.authenticated() );
	}
	
	visibleIfAuthenticated()
	{
		return ko.pureComputed( () => this.authenticated() );
	}
	
	bind()
	{
		this.title = title;
		
		this.navLeftItems = [
			{
				display: this.visibleIfUnauthenticated(),
				href: '#home',
				isActive: 'active',
				text: 'Home'
			},
			{
				display: this.visibleIfAuthenticated(),
				href: '#dashboard',
				isActive: 'active',
				text: 'Dashboard'
			}
		];
		
		this.navRightItems = [
			// {
			// 	display: this.visibleIfUnauthenticated(),
			// 	_class: 'mr-3',
			// 	buttonType: 'btn btn-warning',
			// 	text: 'Sign Up',
			// 	click: () => Container.changePage( 'signUp' )
			// },
			// {
			// 	display: this.visibleIfUnauthenticated(),
			// 	_class: '',
			// 	buttonType: 'btn btn-success',
			// 	text: 'Sign In',
			// 	click: () => Container.changePage( 'signIn' )
			// },
			// {
			// 	display: this.visibleIfAuthenticated(),
			// 	_class: '',
			// 	buttonType: 'btn btn-danger',
			// 	text: 'Sign Out',
			// 	click: () => signOut()
			// }
		];
		
		ko.applyBindings( this );
		return this;
	}
}

export default new Nav();

/** ****************************************************************************************************
 * File: global.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

import './main/Nav';

import Container from './main/Container';
import Home from './views/Home';

export function initialize() {
	Container.addPage( 'home', new Home() );
	Container.initialize();
	
	if( !Container.pageRequiresAuthorization( location.hash ) ) {
		Container.changePage( location.hash );
	} else {
		Container.changePage( 'home' );
	}
}

$( document ).ready( initialize );

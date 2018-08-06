/** ****************************************************************************************************
 * File: Home.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

import Page from '../main/Page';

import html from '../../html/home.html';

import hamburger from '../../html/hamburger.html';
import navbar from '../../html/navbar.html';

export default class Home extends Page
{
	constructor()
	{
		super( 'home', html );
		
		this.hamburger = hamburger;
		this.navbar    = navbar;
	}
}

/** ****************************************************************************************************
 * File: Home.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

import Page from './Page';

import html from '../../html/home.html';

export default class Home extends Page
{
	constructor()
	{
		super( 'home', html );
	}
}

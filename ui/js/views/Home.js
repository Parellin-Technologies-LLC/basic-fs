/** ****************************************************************************************************
 * File: Home.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Aug-2018
 *******************************************************************************************************/
'use strict';

import $ from 'jquery';
import ko from 'knockout';

import Page from '../main/Page';

import html from '../../html/home.html';

import hamburger from '../../html/hamburger.html';
import navbar from '../../html/navbar.html';

import BasicFSAPI from '../lib/BasicFSAPI';
import { showAlert } from '../components/statusBar';

export default class Home extends Page
{
	constructor()
	{
		super( 'home', html );

		this.hamburger = hamburger;
		this.navbar    = navbar;
		this.cwd       = '/data/';
	}

	navigateTo( dir )
	{
		console.log( 'navigateTo', dir );
		this.cwd = dir;
	}

	async preRender()
	{
		this.tableHeaders = [
			{ title: 'filename' },
			{ title: 'size' },
			{ title: 'created' },
			{ title: 'modified' },
			{ title: 'actions' }
		];

		this.rebindItems = [];

		this.tableItems = await BasicFSAPI.listFiles( this.cwd )
			.then(
				( { data } ) => data.map( item => {
					item.filename = `<button href="#" id="${ item.filename }" data-bind="click: function(data, event){console.log( data );}">${ item.filename }</button>`;
					item.actions  = [];
					return item;
				} )
			)
			.catch( showAlert );

		console.log( this.tableItems );

		return super.preRender();
	}

	postRender()
	{
	}
}

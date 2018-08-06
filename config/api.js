/** ****************************************************************************************************
 * @file: api.js
 * @project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Jul-2018
 *******************************************************************************************************/
'use strict';

const { resolve } = require( 'path' );

module.exports = [
	{
		route: '/',
		method: 'ALL',
		exec: resolve( './api/home' )
	},
	{
		route: '/ping',
		method: 'ALL',
		exec: resolve( './api/ping' )
	},
	{
		route: '/kill',
		method: 'ALL',
		exec: resolve( './api/kill' )
	},
	{
		route: '/docs',
		method: 'ALL',
		exec: resolve( './api/docs' )
	},
	{
		route: '/data*',
		method: 'GET',
		exec: resolve( './api/getData' )
	},
	{
		route: '/data*',
		method: 'PUT',
		exec: resolve( './api/upload' )
	},
	{
		route: '/data*',
		method: 'POST',
		exec: resolve( './api/upload' )
	},
	{
		route: '/data*',
		method: 'DELETE',
		exec: resolve( './api/deleteData' )
	},
	{
		route: '/form*',
		method: 'GET',
		exec: resolve( './api/getData' )
	},
	{
		route: '/form*',
		method: 'PUT',
		exec: resolve( './api/uploadForm' )
	},
	{
		route: '/form*',
		method: 'POST',
		exec: resolve( './api/uploadForm' )
	},
	{
		route: '/form*',
		method: 'DELETE',
		exec: resolve( './api/deleteData' )
	},
	{
		route: '*',
		method: 'ALL',
		exec: resolve( './api/methodNotAllowed' )
	}
];

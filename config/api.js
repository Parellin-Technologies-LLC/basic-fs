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
		exec: resolve( './src/home' )
	},
	{
		route: '/ping',
		method: 'ALL',
		exec: resolve( './src/ping' )
	},
	{
		route: '/kill',
		method: 'ALL',
		exec: resolve( './src/kill' )
	},
	{
		route: '/docs',
		method: 'ALL',
		exec: resolve( './src/docs' )
	},
	{
		route: '/data*',
		method: 'GET',
		exec: resolve( './src/getData' )
	},
	{
		route: '/data*',
		method: 'PUT',
		exec: resolve( './src/upload' )
	},
	{
		route: '/data*',
		method: 'POST',
		exec: resolve( './src/upload' )
	},
	{
		route: '/data*',
		method: 'DELETE',
		exec: resolve( './src/deleteData' )
	},
	{
		route: '/form*',
		method: 'GET',
		exec: resolve( './src/getData' )
	},
	{
		route: '/form*',
		method: 'PUT',
		exec: resolve( './src/uploadForm' )
	},
	{
		route: '/form*',
		method: 'POST',
		exec: resolve( './src/uploadForm' )
	},
	{
		route: '/form*',
		method: 'DELETE',
		exec: resolve( './src/deleteData' )
	},
	{
		route: '*',
		method: 'ALL',
		exec: resolve( './src/methodNotAllowed' )
	}
];

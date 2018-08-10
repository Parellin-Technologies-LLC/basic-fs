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
		exec: resolve( './api/routes/home' )
	},
	{
		route: '/ping',
		method: 'ALL',
		exec: resolve( './api/routes/ping' )
	},
	{
		route: '/kill',
		method: 'ALL',
		exec: resolve( './api/routes/kill' )
	},
	{
		route: '/docs',
		method: 'ALL',
		exec: resolve( './api/routes/docs' )
	},
	{
		route: '/data*',
		method: 'GET',
		exec: resolve( './api/routes/getData' )
	},
	{
		route: '/data*',
		method: 'POST',
		exec: resolve( './api/routes/upload' )
	},
	{
		route: '/data*',
		method: 'DELETE',
		exec: resolve( './api/routes/deleteData' )
	},
	{
		route: '/form*',
		method: 'GET',
		exec: resolve( './api/routes/getData' )
	},
	{
		route: '/form*',
		method: 'POST',
		exec: resolve( './api/routes/uploadForm' )
	},
	{
		route: '/form*',
		method: 'DELETE',
		exec: resolve( './api/routes/deleteData' )
	},
	{
		route: '*',
		method: 'ALL',
		exec: resolve( './api/routes/methodNotAllowed' )
	}
];

/** ****************************************************************************************************
 * File: config.js
 * Project: basic-fs
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 11-Jul-2017
 *******************************************************************************************************/
'use strict';

const
	{ version, name } = require( './package.json' ),
	{ join }          = require( 'path' );

module.exports = {
	name,
	version,
	cwd: process.cwd(),
	dataDirectory: 'data/',
	dotfiles: 'allow',
	timeout: 20000,
	maximumURISize: 1600,
	maximumHeaderSize: 4000,
	maximumPayloadSize: 53687091200,
	minimumHTTPVersion: 1.1,
	speedStandard: 8,
	port: 3000,
	api: {
		home: {
			route: '/',
			method: [ 'ALL' ]
		},
		ping: {
			route: '/ping',
			method: [ 'ALL' ]
		},
		kill: {
			route: '/kill',
			method: [ 'ALL' ]
		},
		docs: {
			route: '/docs',
			method: [ 'ALL' ]
		},
		data: {
			route: '/data*',
			method: [ 'GET', 'PUT', 'POST', 'DELETE' ]
		}
	}
};

// TODO: create a "download" function to zip up files and download

module.exports.root = join( module.exports.cwd, module.exports.dataDirectory );
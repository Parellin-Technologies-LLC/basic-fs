'use strict';

const
	{ version } = require( './package.json' ),
	{ join }    = require( 'path' );

module.exports = {
	version,
	cwd: process.cwd(),
	dataDirectory: 'data/',
	dotfiles: 'allow',
	timeout: 20000,
	maximumURISize: 1600,
	maximumHeaderSize: 4000,
	maximumPayloadSize: 53687091200,
	minimumHTTPVersion: 1.0,
	port: 3000,
	ping: '/ping',
	kill: '/kill',
	docs: '/docs',
	data: [ '/data', '/data/*' ]
};

// TODO: create a "download" function to zip up files and download

module.exports.root = join( module.exports.cwd, module.exports.dataDirectory );
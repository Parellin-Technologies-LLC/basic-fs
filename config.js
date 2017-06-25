'use strict';

const { version } = require( './package.json' );

module.exports = {
	version,
    cwd: process.cwd(),
    publicDirectory: 'public',
    port: 3000,
    ping: '/ping',
    kill: '/kill',
    docs: '/docs',
    path: '/files',
    proxy: '/files/:name'
};
